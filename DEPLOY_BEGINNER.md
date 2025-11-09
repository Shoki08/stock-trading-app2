# 超初心者向け：Webアプリとして公開する方法 🌐

このガイドでは、作ったアプリを**インターネットに公開**して、スマホやどこからでもアクセスできるようにする方法を説明します。

## 🎯 ゴール

完成すると、こうなります：
- `https://あなたの名前.github.io/stock-trading-app` でアクセス可能
- iPhoneやAndroidからでも使える
- ホーム画面に追加してアプリのように使える

## ⏰ 所要時間

- **初めての人**: 約1時間
- **慣れている人**: 約30分

## 📋 必要なもの

1. **GitHubアカウント**（無料）
2. **Renderアカウント**（無料）
3. **Git**（インストール済みであること）
4. **パソコン**（Windows/Mac/Linux）

---

## 🚀 ステップ1: GitHubにコードをアップロード

### 1-1. GitHubアカウントを作る

1. https://github.com にアクセス
2. 「Sign up」をクリック
3. メールアドレス、パスワードを入力
4. アカウント作成完了！

### 1-2. 新しいリポジトリを作る

1. GitHubにログイン
2. 右上の「+」→「New repository」をクリック
3. 以下を入力：
   ```
   Repository name: stock-trading-app
   Description: 株式取引アシスタントPWA
   Public を選択
   ```
4. 「Create repository」をクリック

### 1-3. コードをアップロード

**ターミナル（コマンドプロンプト）で実行:**

```bash
# プロジェクトフォルダに移動
cd stock-trading-app

# Gitの初期設定（初回のみ）
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメール"

# Gitリポジトリを初期化
git init

# すべてのファイルを追加
git add .

# コミット（保存）
git commit -m "Initial commit"

# GitHubに接続
git remote add origin https://github.com/あなたのユーザー名/stock-trading-app.git

# アップロード
git branch -M main
git push -u origin main
```

**ユーザー名とパスワードを聞かれたら:**
- ユーザー名: GitHubのユーザー名
- パスワード: Personal Access Token（後述）

#### Personal Access Tokenの作成方法

1. GitHub → 右上のアイコン → Settings
2. 左メニュー → Developer settings
3. Personal access tokens → Tokens (classic)
4. Generate new token (classic)
5. Note: `stock-trading-app`
6. Expiration: `No expiration`（期限なし）
7. 以下にチェック:
   - ✅ repo（すべて）
   - ✅ workflow
8. Generate token
9. **表示されたトークンをコピー**（二度と表示されません！）

このトークンをパスワードの代わりに使います。

---

## 🖥️ ステップ2: バックエンドをRenderにデプロイ

### 2-1. Renderアカウントを作る

1. https://render.com にアクセス
2. 「Get Started」→「Sign up with GitHub」
3. GitHubアカウントで連携

### 2-2. バックエンドをデプロイ

1. Renderダッシュボードで「New +」→「Web Service」
2. GitHubリポジトリを接続
3. `stock-trading-app` リポジトリを選択
4. 以下を設定:

```
Name: stock-trading-api
Region: Singapore（または最寄り）
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

5. 環境変数を追加（Advanced → Environment Variables）:
```
ALLOWED_ORIGINS=https://あなたのユーザー名.github.io
```

6. 「Create Web Service」をクリック

7. デプロイが完了すると、URLが表示されます:
   ```
   https://stock-trading-api-xxxx.onrender.com
   ```
   **このURLをメモしてください！**

---

## 🌐 ステップ3: フロントエンドをGitHub Pagesにデプロイ

### 3-1. GitHub Secretsを設定

1. GitHubリポジトリのページを開く
2. Settings → Secrets and variables → Actions
3. New repository secret をクリック
4. 以下を追加:

```
Name: API_URL
Secret: https://stock-trading-api-xxxx.onrender.com
```
（ステップ2でメモしたRenderのURL）

### 3-2. GitHub Pagesを有効化

1. リポジトリの Settings → Pages
2. Source: `GitHub Actions` を選択
3. 保存

### 3-3. デプロイ実行

コードがGitHubにプッシュされると、自動的にデプロイが開始されます。

**状態確認:**
1. リポジトリの「Actions」タブをクリック
2. ワークフローの実行状況を確認
3. 緑のチェックマーク ✅ が表示されたら完了！

### 3-4. アクセス

以下のURLでアクセスできます:
```
https://あなたのユーザー名.github.io/stock-trading-app
```

🎉 **完成です！**

---

## 📱 スマホで使う方法

### iPhone/iPadの場合

1. Safariでアプリを開く
2. 画面下の「共有」ボタン（□に↑のマーク）をタップ
3. 「ホーム画面に追加」を選択
4. 名前を「株式アシスタント」などに変更
5. 「追加」をタップ

→ ホーム画面にアイコンが追加されます！

### Androidの場合

1. Chromeでアプリを開く
2. 画面右上のメニュー（⋮）をタップ
3. 「ホーム画面に追加」を選択
4. 「追加」をタップ

---

## 🔧 トラブルシューティング

### エラー1: バックエンドが起動しない

**原因**: 環境変数が設定されていない

**解決法**:
1. Renderダッシュボード → あなたのサービス
2. Environment タブ
3. `ALLOWED_ORIGINS` が正しく設定されているか確認

### エラー2: フロントエンドからAPIに接続できない

**原因**: CORSエラー

**解決法**:
1. バックエンドの`ALLOWED_ORIGINS`を確認
2. フロントエンドのGitHub Secrets `API_URL`を確認
3. 両方が一致していることを確認

### エラー3: GitHub Actionsが失敗する

**原因**: ビルドエラー

**解決法**:
1. GitHubの「Actions」タブでログを確認
2. エラーメッセージを読む
3. 必要なファイルが全てコミットされているか確認

### エラー4: デプロイ後、画面が真っ白

**原因**: ビルドパスの問題

**解決法**:
1. `vite.config.js`の`base`を確認:
```javascript
base: '/stock-trading-app/'  // リポジトリ名と一致させる
```

---

## 🔄 更新方法

コードを変更したら、以下を実行:

```bash
git add .
git commit -m "変更内容の説明"
git push origin main
```

自動的に再デプロイされます！

---

## 💰 費用について

### 完全無料で使える範囲

**GitHub Pages:**
- ✅ 完全無料
- ✅ 容量: 1GB
- ✅ 転送量: 月100GB

**Render（無料プラン）:**
- ✅ 月750時間無料
- ⚠️ 15分使わないとスリープ
- ⚠️ 起動に30秒ほどかかる

### 有料プランが必要な場合

- より速い応答が必要
- 常時起動したい
- 多くの人が使う

**Render Pro**: $7/月〜

---

## 📞 サポート

### 困ったときは

1. **エラーメッセージを確認**
2. **GitHub Actionsのログを見る**
3. **Renderのログを見る**
4. **GitHubのIssuesで質問**

### よくある質問

**Q: デプロイにどのくらい時間がかかる？**
A: 
- バックエンド: 5-10分
- フロントエンド: 2-5分

**Q: 無料で使い続けられる？**
A: はい、ただしRenderは使わない時間が長いとスリープします。

**Q: 独自ドメイン（example.com）を使える？**
A: はい！GitHub Pagesのカスタムドメイン設定から可能です。

**Q: HTTPSで接続される？**
A: はい、GitHub PagesもRenderも自動的にHTTPS対応です。

---

## 🎉 完了チェックリスト

デプロイが成功したか確認:

- [ ] GitHubにコードがアップされている
- [ ] Renderでバックエンドが動いている（緑の●）
- [ ] GitHub Actionsが成功している（✅）
- [ ] ブラウザでフロントエンドが開ける
- [ ] 銘柄検索が動く
- [ ] スマホからアクセスできる
- [ ] ホーム画面に追加できる

全部✅なら**大成功です！** 🎊

---

## 🚀 次のステップ

1. **友達に共有**してフィードバックをもらう
2. **機能を追加**してみる
3. **デザインをカスタマイズ**する
4. **独自ドメイン**を設定する

楽しいWebアプリ開発を！ 📱✨
