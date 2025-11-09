from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import ta
from textblob import TextBlob
import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Stock Trading Assistant API")

# CORS設定
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データモデル
class StockSymbol(BaseModel):
    symbol: str

class WatchlistAdd(BaseModel):
    symbol: str
    target_price: Optional[float] = None

class AnalysisRequest(BaseModel):
    symbol: str
    period: str = "1mo"  # 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y

class PriceAlert(BaseModel):
    symbol: str
    target_price: float
    condition: str  # "above" or "below"

@app.get("/")
async def root():
    return {"message": "Stock Trading Assistant API", "version": "1.0.0"}

@app.post("/api/stock/info")
async def get_stock_info(stock: StockSymbol):
    """株式の基本情報を取得"""
    try:
        ticker = yf.Ticker(stock.symbol)
        info = ticker.info
        
        return {
            "symbol": stock.symbol,
            "name": info.get("longName", "N/A"),
            "current_price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
            "previous_close": info.get("previousClose", 0),
            "open": info.get("open", 0),
            "day_high": info.get("dayHigh", 0),
            "day_low": info.get("dayLow", 0),
            "volume": info.get("volume", 0),
            "market_cap": info.get("marketCap", 0),
            "pe_ratio": info.get("trailingPE", 0),
            "dividend_yield": info.get("dividendYield", 0),
            "52week_high": info.get("fiftyTwoWeekHigh", 0),
            "52week_low": info.get("fiftyTwoWeekLow", 0),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching stock info: {str(e)}")

@app.post("/api/stock/historical")
async def get_historical_data(request: AnalysisRequest):
    """過去の株価データを取得"""
    try:
        ticker = yf.Ticker(request.symbol)
        df = ticker.history(period=request.period)
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No data found for this symbol")
        
        # データを辞書形式に変換
        data = []
        for index, row in df.iterrows():
            data.append({
                "date": index.strftime("%Y-%m-%d"),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": int(row["Volume"])
            })
        
        return {"symbol": request.symbol, "period": request.period, "data": data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching historical data: {str(e)}")

@app.post("/api/stock/technical-analysis")
async def technical_analysis(request: AnalysisRequest):
    """テクニカル分析を実行"""
    try:
        ticker = yf.Ticker(request.symbol)
        df = ticker.history(period=request.period)
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No data found")
        
        # テクニカル指標の計算
        # 移動平均
        df['SMA_20'] = ta.trend.sma_indicator(df['Close'], window=20)
        df['SMA_50'] = ta.trend.sma_indicator(df['Close'], window=50)
        df['EMA_12'] = ta.trend.ema_indicator(df['Close'], window=12)
        df['EMA_26'] = ta.trend.ema_indicator(df['Close'], window=26)
        
        # MACD
        macd = ta.trend.MACD(df['Close'])
        df['MACD'] = macd.macd()
        df['MACD_signal'] = macd.macd_signal()
        df['MACD_diff'] = macd.macd_diff()
        
        # RSI
        df['RSI'] = ta.momentum.rsi(df['Close'], window=14)
        
        # ボリンジャーバンド
        bollinger = ta.volatility.BollingerBands(df['Close'])
        df['BB_upper'] = bollinger.bollinger_hband()
        df['BB_middle'] = bollinger.bollinger_mavg()
        df['BB_lower'] = bollinger.bollinger_lband()
        
        # ストキャスティクス
        stoch = ta.momentum.StochasticOscillator(df['High'], df['Low'], df['Close'])
        df['Stoch_K'] = stoch.stoch()
        df['Stoch_D'] = stoch.stoch_signal()
        
        # 最新の値を取得
        latest = df.iloc[-1]
        
        # トレンド判定
        trend = "中立"
        if latest['SMA_20'] > latest['SMA_50']:
            trend = "上昇トレンド"
        elif latest['SMA_20'] < latest['SMA_50']:
            trend = "下降トレンド"
        
        # シグナル判定
        signals = []
        
        # RSIシグナル
        if latest['RSI'] < 30:
            signals.append({"type": "買いシグナル", "indicator": "RSI", "value": float(latest['RSI']), "reason": "売られすぎ"})
        elif latest['RSI'] > 70:
            signals.append({"type": "売りシグナル", "indicator": "RSI", "value": float(latest['RSI']), "reason": "買われすぎ"})
        
        # MACDシグナル
        if latest['MACD'] > latest['MACD_signal'] and df.iloc[-2]['MACD'] <= df.iloc[-2]['MACD_signal']:
            signals.append({"type": "買いシグナル", "indicator": "MACD", "value": float(latest['MACD']), "reason": "ゴールデンクロス"})
        elif latest['MACD'] < latest['MACD_signal'] and df.iloc[-2]['MACD'] >= df.iloc[-2]['MACD_signal']:
            signals.append({"type": "売りシグナル", "indicator": "MACD", "value": float(latest['MACD']), "reason": "デッドクロス"})
        
        # ボリンジャーバンドシグナル
        if latest['Close'] < latest['BB_lower']:
            signals.append({"type": "買いシグナル", "indicator": "ボリンジャーバンド", "value": float(latest['Close']), "reason": "下限突破"})
        elif latest['Close'] > latest['BB_upper']:
            signals.append({"type": "売りシグナル", "indicator": "ボリンジャーバンド", "value": float(latest['Close']), "reason": "上限突破"})
        
        return {
            "symbol": request.symbol,
            "trend": trend,
            "indicators": {
                "SMA_20": float(latest['SMA_20']) if not pd.isna(latest['SMA_20']) else None,
                "SMA_50": float(latest['SMA_50']) if not pd.isna(latest['SMA_50']) else None,
                "EMA_12": float(latest['EMA_12']) if not pd.isna(latest['EMA_12']) else None,
                "EMA_26": float(latest['EMA_26']) if not pd.isna(latest['EMA_26']) else None,
                "RSI": float(latest['RSI']) if not pd.isna(latest['RSI']) else None,
                "MACD": float(latest['MACD']) if not pd.isna(latest['MACD']) else None,
                "MACD_signal": float(latest['MACD_signal']) if not pd.isna(latest['MACD_signal']) else None,
                "BB_upper": float(latest['BB_upper']) if not pd.isna(latest['BB_upper']) else None,
                "BB_middle": float(latest['BB_middle']) if not pd.isna(latest['BB_middle']) else None,
                "BB_lower": float(latest['BB_lower']) if not pd.isna(latest['BB_lower']) else None,
                "Stoch_K": float(latest['Stoch_K']) if not pd.isna(latest['Stoch_K']) else None,
                "Stoch_D": float(latest['Stoch_D']) if not pd.isna(latest['Stoch_D']) else None,
            },
            "signals": signals,
            "current_price": float(latest['Close']),
            "updated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Technical analysis error: {str(e)}")

@app.post("/api/stock/prediction")
async def predict_price(request: AnalysisRequest):
    """簡易的な価格予測 (線形回帰ベース)"""
    try:
        from sklearn.linear_model import LinearRegression
        from sklearn.preprocessing import StandardScaler
        
        ticker = yf.Ticker(request.symbol)
        df = ticker.history(period=request.period)
        
        if len(df) < 30:
            raise HTTPException(status_code=400, detail="Insufficient data for prediction")
        
        # 特徴量の準備
        df['Returns'] = df['Close'].pct_change()
        df['SMA_5'] = ta.trend.sma_indicator(df['Close'], window=5)
        df['SMA_20'] = ta.trend.sma_indicator(df['Close'], window=20)
        df['RSI'] = ta.momentum.rsi(df['Close'], window=14)
        df['Volume_Change'] = df['Volume'].pct_change()
        
        df = df.dropna()
        
        # 特徴量とターゲットの準備
        features = ['Returns', 'SMA_5', 'SMA_20', 'RSI', 'Volume_Change']
        X = df[features].values
        y = df['Close'].values
        
        # 訓練データとテストデータに分割
        train_size = int(len(X) * 0.8)
        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]
        
        # スケーリング
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # モデル訓練
        model = LinearRegression()
        model.fit(X_train_scaled, y_train)
        
        # 予測
        predictions = model.predict(X_test_scaled)
        
        # 次の5日間の予測
        last_features = X_test_scaled[-1].reshape(1, -1)
        future_predictions = []
        
        for i in range(5):
            pred = model.predict(last_features)[0]
            future_predictions.append(float(pred))
        
        current_price = float(df['Close'].iloc[-1])
        avg_prediction = np.mean(future_predictions)
        
        # 推奨判定
        price_change_pct = ((avg_prediction - current_price) / current_price) * 100
        
        if price_change_pct > 2:
            recommendation = "買い推奨"
            confidence = min(abs(price_change_pct) * 10, 80)
        elif price_change_pct < -2:
            recommendation = "売り推奨"
            confidence = min(abs(price_change_pct) * 10, 80)
        else:
            recommendation = "様子見"
            confidence = 50
        
        return {
            "symbol": request.symbol,
            "current_price": current_price,
            "predicted_prices": future_predictions,
            "average_prediction": float(avg_prediction),
            "price_change_percent": float(price_change_pct),
            "recommendation": recommendation,
            "confidence": float(confidence),
            "note": "※この予測は参考情報であり、投資判断は自己責任でお願いします",
            "updated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.post("/api/stock/news")
async def get_stock_news(stock: StockSymbol):
    """株式関連ニュースを取得"""
    try:
        ticker = yf.Ticker(stock.symbol)
        news = ticker.news
        
        news_list = []
        for item in news[:10]:  # 最新10件
            # センチメント分析
            title = item.get('title', '')
            sentiment_score = TextBlob(title).sentiment.polarity
            
            if sentiment_score > 0.1:
                sentiment = "ポジティブ"
            elif sentiment_score < -0.1:
                sentiment = "ネガティブ"
            else:
                sentiment = "中立"
            
            news_list.append({
                "title": title,
                "publisher": item.get('publisher', 'Unknown'),
                "link": item.get('link', ''),
                "published_at": datetime.fromtimestamp(item.get('providerPublishTime', 0)).isoformat(),
                "sentiment": sentiment,
                "sentiment_score": float(sentiment_score)
            })
        
        # 全体的なセンチメント
        avg_sentiment = np.mean([n['sentiment_score'] for n in news_list]) if news_list else 0
        
        overall_sentiment = "中立"
        if avg_sentiment > 0.1:
            overall_sentiment = "ポジティブ"
        elif avg_sentiment < -0.1:
            overall_sentiment = "ネガティブ"
        
        return {
            "symbol": stock.symbol,
            "news": news_list,
            "overall_sentiment": overall_sentiment,
            "average_sentiment_score": float(avg_sentiment)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"News fetch error: {str(e)}")

@app.post("/api/stock/comprehensive-analysis")
async def comprehensive_analysis(request: AnalysisRequest):
    """総合分析 - テクニカル、ファンダメンタル、ニュースを統合"""
    try:
        # 各分析を実行
        technical = await technical_analysis(request)
        prediction = await predict_price(request)
        stock_info = await get_stock_info(StockSymbol(symbol=request.symbol))
        news = await get_stock_news(StockSymbol(symbol=request.symbol))
        
        # スコアリング
        score = 50  # 基準点
        
        # テクニカル分析から加点/減点
        for signal in technical['signals']:
            if signal['type'] == "買いシグナル":
                score += 5
            elif signal['type'] == "売りシグナル":
                score -= 5
        
        # 予測から加点/減点
        if prediction['price_change_percent'] > 2:
            score += 10
        elif prediction['price_change_percent'] < -2:
            score -= 10
        
        # ニュースセンチメントから加点/減点
        if news['overall_sentiment'] == "ポジティブ":
            score += 10
        elif news['overall_sentiment'] == "ネガティブ":
            score -= 10
        
        # スコアを0-100に制限
        score = max(0, min(100, score))
        
        # 総合判定
        if score >= 70:
            overall_recommendation = "強い買い"
        elif score >= 60:
            overall_recommendation = "買い"
        elif score >= 40:
            overall_recommendation = "中立・様子見"
        elif score >= 30:
            overall_recommendation = "売り"
        else:
            overall_recommendation = "強い売り"
        
        return {
            "symbol": request.symbol,
            "overall_score": score,
            "overall_recommendation": overall_recommendation,
            "technical_analysis": technical,
            "price_prediction": prediction,
            "stock_info": stock_info,
            "news_sentiment": news,
            "summary": f"{stock_info['name']}の総合スコアは{score}点です。{overall_recommendation}と判断されます。",
            "disclaimer": "※この分析は参考情報です。最終的な投資判断はご自身の責任で行ってください。",
            "updated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Comprehensive analysis error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
