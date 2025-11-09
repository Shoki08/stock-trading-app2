import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, GRU, Dense, Dropout
from tensorflow.keras.optimizers import Adam
import yfinance as yf
from datetime import datetime, timedelta
import pickle
import os

class StockPricePredictor:
    """LSTMとGRUを使った株価予測モデル"""
    
    def __init__(self, symbol: str, model_type: str = "lstm"):
        self.symbol = symbol
        self.model_type = model_type.lower()
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.sequence_length = 60  # 60日分のデータで予測
        
    def prepare_data(self, data: pd.DataFrame, target_column: str = 'Close'):
        """データの前処理"""
        # 欠損値の処理
        data = data.fillna(method='ffill').fillna(method='bfill')
        
        # 特徴量の追加
        data['Returns'] = data['Close'].pct_change()
        data['Volume_Change'] = data['Volume'].pct_change()
        data['High_Low_Diff'] = data['High'] - data['Low']
        data['Close_Open_Diff'] = data['Close'] - data['Open']
        
        # テクニカル指標
        data['SMA_5'] = data['Close'].rolling(window=5).mean()
        data['SMA_20'] = data['Close'].rolling(window=20).mean()
        data['SMA_50'] = data['Close'].rolling(window=50).mean()
        data['EMA_12'] = data['Close'].ewm(span=12).mean()
        data['EMA_26'] = data['Close'].ewm(span=26).mean()
        
        # RSI
        delta = data['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        data['RSI'] = 100 - (100 / (1 + rs))
        
        # MACD
        data['MACD'] = data['EMA_12'] - data['EMA_26']
        data['MACD_Signal'] = data['MACD'].ewm(span=9).mean()
        
        # ボリンジャーバンド
        data['BB_Middle'] = data['Close'].rolling(window=20).mean()
        data['BB_Std'] = data['Close'].rolling(window=20).std()
        data['BB_Upper'] = data['BB_Middle'] + (data['BB_Std'] * 2)
        data['BB_Lower'] = data['BB_Middle'] - (data['BB_Std'] * 2)
        
        # 欠損値を削除
        data = data.dropna()
        
        return data
    
    def create_sequences(self, data: np.ndarray):
        """時系列データをシーケンスに変換"""
        X, y = [], []
        for i in range(self.sequence_length, len(data)):
            X.append(data[i-self.sequence_length:i])
            y.append(data[i, 0])  # Closeの値
        return np.array(X), np.array(y)
    
    def build_model(self, input_shape):
        """モデルの構築"""
        model = Sequential()
        
        if self.model_type == "lstm":
            model.add(LSTM(units=100, return_sequences=True, input_shape=input_shape))
            model.add(Dropout(0.2))
            model.add(LSTM(units=100, return_sequences=True))
            model.add(Dropout(0.2))
            model.add(LSTM(units=50))
            model.add(Dropout(0.2))
        else:  # GRU
            model.add(GRU(units=100, return_sequences=True, input_shape=input_shape))
            model.add(Dropout(0.2))
            model.add(GRU(units=100, return_sequences=True))
            model.add(Dropout(0.2))
            model.add(GRU(units=50))
            model.add(Dropout(0.2))
        
        model.add(Dense(units=25))
        model.add(Dense(units=1))
        
        model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')
        
        return model
    
    def train(self, period: str = "2y", epochs: int = 50, batch_size: int = 32):
        """モデルの訓練"""
        # データ取得
        ticker = yf.Ticker(self.symbol)
        df = ticker.history(period=period)
        
        if len(df) < self.sequence_length + 100:
            raise ValueError("訓練に十分なデータがありません")
        
        # データ準備
        df = self.prepare_data(df)
        
        # 特徴量の選択
        feature_columns = ['Close', 'Volume', 'Returns', 'Volume_Change', 
                          'High_Low_Diff', 'Close_Open_Diff', 'SMA_5', 'SMA_20', 
                          'RSI', 'MACD', 'BB_Upper', 'BB_Lower']
        
        data = df[feature_columns].values
        
        # スケーリング
        scaled_data = self.scaler.fit_transform(data)
        
        # シーケンス作成
        X, y = self.create_sequences(scaled_data)
        
        # 訓練/テストデータ分割
        split = int(0.8 * len(X))
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]
        
        # モデル構築
        self.model = self.build_model((X_train.shape[1], X_train.shape[2]))
        
        # 訓練
        history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=(X_test, y_test),
            verbose=1
        )
        
        return history
    
    def predict_future(self, days: int = 5):
        """将来の価格を予測"""
        if self.model is None:
            raise ValueError("モデルが訓練されていません")
        
        # 最新データ取得
        ticker = yf.Ticker(self.symbol)
        df = ticker.history(period="1y")
        df = self.prepare_data(df)
        
        feature_columns = ['Close', 'Volume', 'Returns', 'Volume_Change', 
                          'High_Low_Diff', 'Close_Open_Diff', 'SMA_5', 'SMA_20', 
                          'RSI', 'MACD', 'BB_Upper', 'BB_Lower']
        
        data = df[feature_columns].values
        scaled_data = self.scaler.transform(data)
        
        # 最新のシーケンスを取得
        last_sequence = scaled_data[-self.sequence_length:]
        predictions = []
        
        current_sequence = last_sequence.copy()
        
        for _ in range(days):
            # 予測
            input_data = current_sequence.reshape(1, self.sequence_length, len(feature_columns))
            pred_scaled = self.model.predict(input_data, verbose=0)
            
            # スケールを元に戻す
            pred_row = np.zeros((1, len(feature_columns)))
            pred_row[0, 0] = pred_scaled[0, 0]
            pred_price = self.scaler.inverse_transform(pred_row)[0, 0]
            
            predictions.append(float(pred_price))
            
            # 次の入力のためにシーケンスを更新
            current_sequence = np.vstack([current_sequence[1:], pred_scaled])
        
        return predictions
    
    def save_model(self, path: str):
        """モデルの保存"""
        if self.model is None:
            raise ValueError("モデルが訓練されていません")
        
        self.model.save(f"{path}/model_{self.symbol}.h5")
        with open(f"{path}/scaler_{self.symbol}.pkl", 'wb') as f:
            pickle.dump(self.scaler, f)
    
    def load_model(self, path: str):
        """モデルの読み込み"""
        self.model = keras.models.load_model(f"{path}/model_{self.symbol}.h5")
        with open(f"{path}/scaler_{self.symbol}.pkl", 'rb') as f:
            self.scaler = pickle.load(f)

def calculate_trading_signals(df: pd.DataFrame):
    """複数の指標から総合的な売買シグナルを生成"""
    signals = {
        'buy_score': 0,
        'sell_score': 0,
        'signals': []
    }
    
    latest = df.iloc[-1]
    previous = df.iloc[-2]
    
    # RSIシグナル
    if latest['RSI'] < 30:
        signals['buy_score'] += 2
        signals['signals'].append("RSI: 売られすぎ (買いシグナル)")
    elif latest['RSI'] > 70:
        signals['sell_score'] += 2
        signals['signals'].append("RSI: 買われすぎ (売りシグナル)")
    
    # MACDシグナル
    if latest['MACD'] > latest['MACD_Signal'] and previous['MACD'] <= previous['MACD_Signal']:
        signals['buy_score'] += 3
        signals['signals'].append("MACD: ゴールデンクロス (買いシグナル)")
    elif latest['MACD'] < latest['MACD_Signal'] and previous['MACD'] >= previous['MACD_Signal']:
        signals['sell_score'] += 3
        signals['signals'].append("MACD: デッドクロス (売りシグナル)")
    
    # 移動平均シグナル
    if latest['SMA_5'] > latest['SMA_20'] and latest['SMA_20'] > latest['SMA_50']:
        signals['buy_score'] += 2
        signals['signals'].append("移動平均: 上昇トレンド")
    elif latest['SMA_5'] < latest['SMA_20'] and latest['SMA_20'] < latest['SMA_50']:
        signals['sell_score'] += 2
        signals['signals'].append("移動平均: 下降トレンド")
    
    # ボリンジャーバンドシグナル
    if latest['Close'] < latest['BB_Lower']:
        signals['buy_score'] += 2
        signals['signals'].append("ボリンジャーバンド: 下限突破 (買いシグナル)")
    elif latest['Close'] > latest['BB_Upper']:
        signals['sell_score'] += 2
        signals['signals'].append("ボリンジャーバンド: 上限突破 (売りシグナル)")
    
    # 総合判定
    total_score = signals['buy_score'] - signals['sell_score']
    
    if total_score >= 5:
        signals['recommendation'] = "強い買い"
    elif total_score >= 2:
        signals['recommendation'] = "買い"
    elif total_score <= -5:
        signals['recommendation'] = "強い売り"
    elif total_score <= -2:
        signals['recommendation'] = "売り"
    else:
        signals['recommendation'] = "様子見"
    
    return signals
