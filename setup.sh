#!/bin/bash

echo "🚀 株式取引アシスタント - 開発環境セットアップ"
echo "================================================"

# バックエンドのセットアップ
echo ""
echo "📦 バックエンドのセットアップ中..."
cd backend

# 仮想環境の作成
if [ ! -d "venv" ]; then
    echo "仮想環境を作成中..."
    python3 -m venv venv
fi

# 仮想環境の有効化
source venv/bin/activate

# 依存関係のインストール
echo "依存関係をインストール中..."
pip install -r requirements.txt

# .envファイルの作成
if [ ! -f ".env" ]; then
    echo ".envファイルを作成中..."
    cp .env.example .env
    echo "✅ .envファイルを作成しました。必要に応じて編集してください。"
fi

cd ..

# フロントエンドのセットアップ
echo ""
echo "📦 フロントエンドのセットアップ中..."
cd frontend

# 依存関係のインストール
if [ ! -d "node_modules" ]; then
    echo "依存関係をインストール中..."
    npm install
fi

# .envファイルの作成
if [ ! -f ".env" ]; then
    echo ".envファイルを作成中..."
    cp .env.example .env
    echo "✅ .envファイルを作成しました。必要に応じて編集してください。"
fi

cd ..

echo ""
echo "✅ セットアップが完了しました！"
echo ""
echo "🚀 開発サーバーを起動するには:"
echo ""
echo "バックエンド:"
echo "  cd backend"
echo "  source venv/bin/activate  # Windows: venv\\Scripts\\activate"
echo "  python main.py"
echo ""
echo "フロントエンド (別のターミナルで):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "📝 詳細はREADME.mdを参照してください。"
