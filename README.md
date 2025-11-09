# 株式取引アシスタント PWA

楽天証券での短期株式取引をサポートする、AI搭載のPWAアプリです。

## 🚀 主要機能

### 📊 テクニカル分析
- 移動平均線 (SMA, EMA)
- RSI (相対力指数)
- MACD (移動平均収束拡散法)
- ボリンジャーバンド
- ストキャスティクス

### 🤖 AI価格予測
- 線形回帰モデル
- LSTM/GRU深層学習モデル
- 5日先までの価格予測
- 信頼度スコア付き推奨

### 📰 ニュース分析
- リアルタイムニュース取得
- センチメント分析
- ポジティブ/ネガティブ判定

### 📈 総合分析
- テクニカル + AI予測 + ニュースの統合スコア
- 買い/売り/様子見の推奨
- 0-100のスコアリング

### 🔔 アラート機能
- 価格アラート設定
- プッシュ通知対応
- カスタマイズ可能な条件

### 💼 ポートフォリオ管理
- 保有株管理
- 損益計算
- 資産推移追跡

## 🛠️ 技術スタック

### フロントエンド
- **React 18** - UIフレームワーク
- **Vite** - 高速ビルドツール
- **Zustand** - 状態管理
- **Recharts** - チャート表示
- **PWA** - オフライン対応、ホーム画面追加

### バックエンド
- **Python 3.11+**
- **FastAPI** - 高速APIフレームワーク
- **yfinance** - 株価データ取得
- **TensorFlow/Keras** - 機械学習
- **scikit-learn** - 予測モデル
- **TextBlob** - センチメント分析
- **pandas/numpy** - データ処理

## 📦 インストール

### 前提条件
- Node.js 18+
- Python 3.11+
- pip

### バックエンドのセットアップ

```bash
cd backend

# 仮想環境を作成
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存関係をインストール
pip install -r requirements.txt

# 環境変数を設定
cp .env.example .env
# .envファイルを編集してAPIキーなどを設定

# サーバーを起動
python main.py
```

サーバーは http://localhost:8000 で起動します。

### フロントエンドのセットアップ

```bash
cd frontend

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .envファイルのVITE_API_URLを設定

# 開発サーバーを起動
npm run dev
```

アプリは http://localhost:5173 で起動します。

## 🌐 デプロイ

### バックエンド (Render / Railway)

1. **Render の場合:**
   ```bash
   # Render.comでNew Web Serviceを作成
   # Build Command: pip install -r requirements.txt
   # Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. **Railway の場合:**
   ```bash
   # Railway.appでプロジェクトを作成
   # Pythonプロジェクトとして自動検出
   ```

### フロントエンド (GitHub Pages)

```bash
cd frontend

# package.jsonのhomepageを設定
# "homepage": "https://yourusername.github.io/stock-trading-app"

# デプロイ
npm run build
npm run deploy
```

## 📱 iOS Safari対応

### PWAとしてインストール
1. Safariでアプリを開く
2. 共有ボタン → 「ホーム画面に追加」
3. アプリアイコンからアクセス

### 最適化機能
- タッチイベント最適化
- セーフエリア対応
- スムーズスクロール
- オフライン動作

## 🎨 デザイン

- LINEライクなシンプルUI
- Appleデザインガイドライン準拠
- ダークモード対応
- レスポンシブデザイン

## 🔒 セキュリティとプライバシー

- すべてのデータはローカルストレージに保存
- API通信はHTTPS推奨
- 個人情報の外部送信なし

## ⚠️ 免責事項

**重要:** このアプリは個人使用目的の参考情報ツールです。

- 表示される分析結果や予測は参考情報であり、投資助言ではありません
- 最終的な投資判断はご自身の責任で行ってください
- 作者は投資損失について一切の責任を負いません
- 金融商品取引法に基づく投資助言業者ではありません

## 📊 使用例

### 銘柄検索
```
1. 検索ページで銘柄コードを入力 (例: 7203.T, AAPL)
2. ウォッチリストに追加
3. 銘柄をタップして詳細分析を表示
```

### テクニカル分析
```
1. 株式詳細ページの「テクニカル」タブ
2. RSI、MACD、ボリンジャーバンドなどを確認
3. 売買シグナルをチェック
```

### AI予測
```
1. 「AI予測」タブを開く
2. 今後5日間の価格予測を確認
3. 推奨アクションと信頼度を参照
```

### アラート設定
```
1. 株式詳細ページでベルアイコンをタップ
2. 目標価格を入力
3. 価格に達すると通知が届く
```

## 🛣️ ロードマップ

- [ ] より高度なLSTM/GRUモデルの実装
- [ ] リアルタイム価格更新
- [ ] ソーシャルセンチメント分析
- [ ] バックテスト機能
- [ ] カスタムアラート条件
- [ ] データエクスポート機能
- [ ] 多言語対応

## 🐛 トラブルシューティング

### バックエンドが起動しない
```bash
# 依存関係を再インストール
pip install -r requirements.txt --force-reinstall

# Pythonバージョンを確認
python --version  # 3.11以上が必要
```

### フロントエンドが表示されない
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### API接続エラー
- .envファイルのVITE_API_URLが正しいか確認
- バックエンドが起動しているか確認
- CORSエラーの場合、バックエンドのCORS設定を確認

## 📄 ライセンス

個人使用目的のため、商用利用は禁止です。

## 🤝 貢献

個人プロジェクトのため、外部からの貢献は受け付けていません。

## 📧 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

---

**注意:** 株式投資にはリスクが伴います。このツールを使用する際は、必ず自己責任で判断してください。
