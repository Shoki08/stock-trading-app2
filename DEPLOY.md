# デプロイガイド

株式取引アシスタントPWAを本番環境にデプロイする方法を説明します。

## 📦 デプロイ構成

- **フロントエンド**: GitHub Pages (無料)
- **バックエンド**: Render / Railway (無料プランあり)

## 🚀 バックエンドのデプロイ

### オプション1: Render (推奨)

1. **Renderアカウントを作成**
   - https://render.com にアクセス
   - GitHubアカウントでサインアップ

2. **新しいWeb Serviceを作成**
   - 「New +」→ 「Web Service」を選択
   - GitHubリポジトリを接続

3. **設定を入力**
   ```
   Name: stock-trading-api
   Region: Singapore (または最寄りのリージョン)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **環境変数を設定**
   - 「Environment」タブで以下を追加:
   ```
   ALLOWED_ORIGINS=https://yourusername.github.io
   ```

5. **デプロイ**
   - 「Create Web Service」をクリック
   - デプロイが完了すると `https://your-service.onrender.com` のようなURLが発行されます

### オプション2: Railway

1. **Railwayアカウントを作成**
   - https://railway.app にアクセス
   - GitHubアカウントでサインアップ

2. **新しいプロジェクトを作成**
   - 「New Project」→ 「Deploy from GitHub repo」を選択
   - リポジトリを選択

3. **設定**
   - Pythonプロジェクトとして自動検出されます
   - ルートディレクトリを `backend` に設定

4. **環境変数を設定**
   ```
   ALLOWED_ORIGINS=https://yourusername.github.io
   ```

5. **デプロイ**
   - 自動的にデプロイが開始されます

## 🌐 フロントエンドのデプロイ (GitHub Pages)

### ステップ1: リポジトリをGitHubにプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/stock-trading-app.git
git push -u origin main
```

### ステップ2: GitHub Pagesを有効化

1. GitHubリポジトリの「Settings」→「Pages」に移動
2. Source: 「GitHub Actions」を選択
3. 保存

### ステップ3: GitHub Secretsを設定

1. 「Settings」→「Secrets and variables」→「Actions」に移動
2. 「New repository secret」をクリック
3. 以下のシークレットを追加:
   ```
   Name: API_URL
   Value: https://your-backend-url.onrender.com
   ```

### ステップ4: デプロイワークフローを実行

`.github/workflows/deploy.yml`が自動的にデプロイを実行します:

```bash
git push origin main
```

デプロイが完了すると、`https://yourusername.github.io/stock-trading-app` でアクセスできます。

## 🔧 環境変数の設定

### バックエンド

Renderまたはrailwayの環境変数:

```bash
# CORS設定
ALLOWED_ORIGINS=https://yourusername.github.io

# オプション: 追加のAPI設定
NEWS_API_KEY=your_news_api_key
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
```

### フロントエンド

GitHub Secrets:

```bash
API_URL=https://your-backend-url.onrender.com
```

## 📱 PWA設定

### manifest.json

`frontend/vite.config.js`のmanifest設定を確認:

```javascript
manifest: {
  name: '株式取引アシスタント',
  short_name: '株取引',
  description: 'AI搭載の株式取引支援アプリ',
  theme_color: '#1a73e8',
  icons: [
    {
      src: 'pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: 'pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
}
```

### アイコンの準備

`frontend/public/`に以下のファイルを配置:

- `pwa-192x192.png` (192x192ピクセル)
- `pwa-512x512.png` (512x512ピクセル)
- `apple-touch-icon.png` (180x180ピクセル)
- `favicon.ico`

## 🔐 セキュリティ設定

### CORS

バックエンドの`main.py`でCORS設定を確認:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yourusername.github.io",
        "http://localhost:5173"  # 開発用
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### HTTPS

- GitHub Pagesは自動的にHTTPS対応
- RenderとRailwayも自動的にHTTPS対応

## 🧪 デプロイ後のテスト

1. **API接続テスト**
   ```bash
   curl https://your-backend-url.onrender.com
   ```
   レスポンス: `{"message": "Stock Trading Assistant API", "version": "1.0.0"}`

2. **フロントエンドアクセステスト**
   - ブラウザで `https://yourusername.github.io/stock-trading-app` を開く
   - ホームページが表示されることを確認

3. **銘柄検索テスト**
   - 検索ページで「AAPL」を検索
   - 株式情報が表示されることを確認

4. **PWAインストールテスト**
   - iOS Safariで共有→ホーム画面に追加
   - ホーム画面からアプリが起動することを確認

## 🔄 継続的デプロイ

mainブランチにプッシュすると自動的にデプロイされます:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 📊 モニタリング

### Renderダッシュボード

- https://dashboard.render.com
- ログの確認
- メトリクスの監視
- リソース使用状況

### GitHub Actions

- リポジトリの「Actions」タブ
- デプロイログの確認
- エラーの追跡

## 💰 コスト

### 無料プラン

- **GitHub Pages**: 完全無料
- **Render**: 月750時間の無料枠 (アイドル状態で停止)
- **Railway**: 月500時間の無料枠

### 本番運用

- Render: Pro プラン $7/月〜
- Railway: Developer プラン $5/月〜

## 🚨 トラブルシューティング

### デプロイが失敗する

1. GitHub Actionsのログを確認
2. ビルドエラーをチェック
3. 依存関係のバージョンを確認

### API接続エラー

1. バックエンドのURLが正しいか確認
2. CORSエラーの場合、ALLOWED_ORIGINSを確認
3. バックエンドが起動しているか確認

### PWAがインストールできない

1. HTTPSで提供されているか確認
2. manifest.jsonが正しく設定されているか確認
3. service workerが登録されているか確認

## 📝 チェックリスト

デプロイ前に以下を確認:

- [ ] バックエンドがRender/Railwayにデプロイされている
- [ ] フロントエンドがGitHub Pagesにデプロイされている
- [ ] 環境変数が正しく設定されている
- [ ] CORS設定が正しい
- [ ] PWAアイコンが配置されている
- [ ] APIエンドポイントが正しく設定されている
- [ ] テスト環境で動作確認済み

## 🆘 サポート

問題が発生した場合:

1. [README.md](README.md)を確認
2. [QUICKSTART.md](QUICKSTART.md)を参照
3. GitHubのIssuesで質問

---

**注意**: 本番環境では、必ず.envファイルの内容をGitにコミットしないでください。
