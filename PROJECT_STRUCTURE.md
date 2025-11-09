# プロジェクト構造

```
stock-trading-app/
├── frontend/                      # フロントエンド (React PWA)
│   ├── src/
│   │   ├── pages/                # ページコンポーネント
│   │   │   ├── HomePage.jsx      # ホーム画面
│   │   │   ├── SearchPage.jsx    # 銘柄検索
│   │   │   ├── StockDetailPage.jsx  # 株式詳細
│   │   │   ├── PortfolioPage.jsx    # ポートフォリオ
│   │   │   ├── AlertsPage.jsx       # アラート管理
│   │   │   ├── SettingsPage.jsx     # 設定
│   │   │   ├── HomePage.css
│   │   │   ├── SearchPage.css
│   │   │   ├── StockDetailPage.css
│   │   │   └── AllPages.css         # 共通CSS
│   │   ├── App.jsx               # メインアプリ
│   │   ├── App.css               # メインスタイル
│   │   ├── store.js              # Zustand状態管理 + API
│   │   ├── main.jsx              # エントリーポイント
│   │   └── index.css             # グローバルスタイル
│   ├── public/                   # 静的ファイル
│   ├── index.html                # HTMLテンプレート
│   ├── vite.config.js            # Vite + PWA設定
│   ├── package.json              # 依存関係
│   ├── .env.example              # 環境変数サンプル
│   └── .env                      # 環境変数 (Git管理外)
│
├── backend/                       # バックエンド (Python FastAPI)
│   ├── main.py                   # メインAPIアプリケーション
│   ├── ml_models.py              # 機械学習モデル (LSTM/GRU)
│   ├── requirements.txt          # Python依存関係
│   ├── .env.example              # 環境変数サンプル
│   └── .env                      # 環境変数 (Git管理外)
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions (自動デプロイ)
│
├── setup.sh                      # Unix/Mac用セットアップスクリプト
├── setup.bat                     # Windows用セットアップスクリプト
├── .gitignore                    # Git除外設定
├── README.md                     # メインドキュメント
├── QUICKSTART.md                 # クイックスタートガイド
├── DEPLOY.md                     # デプロイガイド
└── PROJECT_STRUCTURE.md          # このファイル
```

## 📁 詳細説明

### フロントエンド

#### ページコンポーネント

| ファイル | 説明 | 主要機能 |
|---------|------|---------|
| `HomePage.jsx` | ホーム画面 | ウォッチリスト表示、市場サマリー |
| `SearchPage.jsx` | 銘柄検索 | 銘柄検索、人気銘柄一覧 |
| `StockDetailPage.jsx` | 株式詳細 | 総合分析、チャート、テクニカル、予測、ニュース |
| `PortfolioPage.jsx` | ポートフォリオ | 保有株管理、損益計算 |
| `AlertsPage.jsx` | アラート | 価格アラート設定・管理 |
| `SettingsPage.jsx` | 設定 | アプリ設定、データ管理 |

#### 状態管理 (store.js)

```javascript
- watchlist: ウォッチリスト
- portfolio: ポートフォリオ
- alerts: アラート
- settings: 設定
- tradeHistory: 取引履歴
- api: APIクライアント関数
```

#### PWA機能

- オフライン対応
- ホーム画面に追加
- プッシュ通知
- iOS Safari最適化

### バックエンド

#### APIエンドポイント

| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| `/` | GET | ヘルスチェック |
| `/api/stock/info` | POST | 株式基本情報 |
| `/api/stock/historical` | POST | 過去株価データ |
| `/api/stock/technical-analysis` | POST | テクニカル分析 |
| `/api/stock/prediction` | POST | 価格予測 |
| `/api/stock/news` | POST | ニュース + センチメント |
| `/api/stock/comprehensive-analysis` | POST | 総合分析 |

#### 機械学習モデル (ml_models.py)

```python
- StockPricePredictor: LSTM/GRU価格予測クラス
- calculate_trading_signals: 売買シグナル生成
- テクニカル指標計算
```

#### 使用ライブラリ

- **FastAPI**: API構築
- **yfinance**: 株価データ取得
- **TensorFlow/Keras**: 深層学習
- **scikit-learn**: 機械学習
- **pandas/numpy**: データ処理
- **ta**: テクニカル分析
- **TextBlob**: センチメント分析

## 🔄 データフロー

```
ユーザー → フロントエンド → API呼び出し → バックエンド
                ↓                              ↓
          Zustand Store                   データ取得・分析
                ↓                              ↓
          LocalStorage ← ← ← ← ← ← ← ← レスポンス
```

## 🎨 デザインシステム

### カラーパレット

```css
--primary-color: #1a73e8    /* メインカラー */
--success-color: #34a853    /* 成功・上昇 */
--danger-color: #ea4335     /* 警告・下降 */
--background: #ffffff       /* 背景 */
--text-primary: #202124     /* メインテキスト */
```

### レスポンシブデザイン

- モバイルファースト
- iOS Safari最適化
- タッチジェスチャー対応
- セーフエリア対応

## 🧩 主要機能の実装場所

### テクニカル分析
- バックエンド: `main.py` - `technical_analysis()`
- フロントエンド: `StockDetailPage.jsx` - テクニカルタブ

### AI価格予測
- バックエンド: `main.py` - `predict_price()` (線形回帰)
- バックエンド: `ml_models.py` - `StockPricePredictor` (LSTM/GRU)
- フロントエンド: `StockDetailPage.jsx` - AI予測タブ

### ニュース分析
- バックエンド: `main.py` - `get_stock_news()`
- センチメント分析: TextBlob使用
- フロントエンド: `StockDetailPage.jsx` - ニュースタブ

### 総合分析
- バックエンド: `main.py` - `comprehensive_analysis()`
- スコアリングロジック: テクニカル + 予測 + ニュース
- フロントエンド: `StockDetailPage.jsx` - 推奨カード

### ウォッチリスト
- 状態管理: `store.js` - watchlist
- 永続化: LocalStorage
- 表示: `HomePage.jsx`

### アラート
- 状態管理: `store.js` - alerts
- 通知: Web Notifications API
- 管理: `AlertsPage.jsx`

## 📦 ビルドプロセス

### 開発環境

```bash
# バックエンド
cd backend
python main.py

# フロントエンド
cd frontend
npm run dev
```

### 本番ビルド

```bash
# フロントエンド
cd frontend
npm run build
# → dist/フォルダに静的ファイル生成
```

## 🚀 デプロイフロー

```
Git Push → GitHub Actions → ビルド → デプロイ
   ↓                ↓          ↓         ↓
 main         ワークフロー   dist/   GitHub Pages
              実行
```

## 🔐 セキュリティ

### 環境変数管理
- `.env` ファイルは Git 管理外
- GitHub Secrets で本番環境の環境変数を管理
- API キーは環境変数から読み込み

### CORS設定
- バックエンドで適切なオリジンのみ許可
- 本番環境では厳密に設定

## 📊 パフォーマンス最適化

- コード分割 (Vite自動)
- 遅延ローディング
- Service Worker キャッシング
- 画像最適化
- API レスポンスキャッシング

## 🧪 テスト

現在テストは未実装。将来追加予定:

- ユニットテスト (Jest/Vitest)
- 統合テスト
- E2Eテスト (Playwright)
- APIテスト (pytest)

## 📚 参考資料

- [React ドキュメント](https://react.dev)
- [FastAPI ドキュメント](https://fastapi.tiangolo.com)
- [Vite ドキュメント](https://vitejs.dev)
- [PWA ガイド](https://web.dev/progressive-web-apps/)
