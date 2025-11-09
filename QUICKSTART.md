# クイックスタートガイド

このガイドでは、株式取引アシスタントPWAを最速でセットアップして起動する方法を説明します。

## 📋 前提条件

以下がインストールされていることを確認してください:

- **Python 3.11以上** - [ダウンロード](https://www.python.org/downloads/)
- **Node.js 18以上** - [ダウンロード](https://nodejs.org/)
- **Git** - [ダウンロード](https://git-scm.com/)

## 🚀 5分でセットアップ

### ステップ1: リポジトリをクローン

```bash
git clone https://github.com/yourusername/stock-trading-app.git
cd stock-trading-app
```

### ステップ2: 自動セットアップスクリプトを実行

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
setup.bat
```

### ステップ3: バックエンドを起動

**Mac/Linux:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Windows:**
```bash
cd backend
venv\Scripts\activate
python main.py
```

✅ バックエンドが http://localhost:8000 で起動します

### ステップ4: フロントエンドを起動 (新しいターミナル)

```bash
cd frontend
npm run dev
```

✅ フロントエンドが http://localhost:5173 で起動します

## 🎉 完了！

ブラウザで http://localhost:5173 を開いてアプリを使用できます。

## 📱 iOS Safariでの使用

1. iPhoneのSafariでアプリを開く
2. 共有ボタンをタップ
3. 「ホーム画面に追加」を選択
4. ホーム画面からアプリを起動

## 🔧 よくある問題

### バックエンドが起動しない

```bash
# Pythonのバージョンを確認
python --version  # 3.11以上が必要

# 依存関係を再インストール
pip install -r requirements.txt --force-reinstall
```

### フロントエンドが起動しない

```bash
# Node.jsのバージョンを確認
node --version  # 18以上が必要

# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### API接続エラー

1. バックエンドが起動しているか確認
2. `frontend/.env`ファイルで`VITE_API_URL=http://localhost:8000`が設定されているか確認

## 📖 次のステップ

- [完全なREADME](README.md)を読む
- [デプロイガイド](DEPLOY.md)でGitHub Pagesにデプロイ
- 銘柄を検索してウォッチリストに追加
- テクニカル分析とAI予測を試す

## 💡 ヒント

- **楽天証券の銘柄コード**: 日本株は「7203.T」のように「.T」を付ける
- **米国株**: 「AAPL」「GOOGL」などそのまま入力
- **リアルタイムデータ**: 開発中は遅延データが表示されます
- **通知**: ブラウザの通知を許可してアラートを受け取る

## ⚠️ 重要

このアプリは個人使用目的の参考情報ツールです。投資判断は必ず自己責任で行ってください。

## 🆘 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。
