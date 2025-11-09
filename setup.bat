@echo off
echo 🚀 株式取引アシスタント - 開発環境セットアップ
echo ================================================

REM バックエンドのセットアップ
echo.
echo 📦 バックエンドのセットアップ中...
cd backend

REM 仮想環境の作成
if not exist "venv" (
    echo 仮想環境を作成中...
    python -m venv venv
)

REM 仮想環境の有効化
call venv\Scripts\activate.bat

REM 依存関係のインストール
echo 依存関係をインストール中...
pip install -r requirements.txt

REM .envファイルの作成
if not exist ".env" (
    echo .envファイルを作成中...
    copy .env.example .env
    echo ✅ .envファイルを作成しました。必要に応じて編集してください。
)

cd ..

REM フロントエンドのセットアップ
echo.
echo 📦 フロントエンドのセットアップ中...
cd frontend

REM 依存関係のインストール
if not exist "node_modules" (
    echo 依存関係をインストール中...
    npm install
)

REM .envファイルの作成
if not exist ".env" (
    echo .envファイルを作成中...
    copy .env.example .env
    echo ✅ .envファイルを作成しました。必要に応じて編集してください。
)

cd ..

echo.
echo ✅ セットアップが完了しました！
echo.
echo 🚀 開発サーバーを起動するには:
echo.
echo バックエンド:
echo   cd backend
echo   venv\Scripts\activate
echo   python main.py
echo.
echo フロントエンド (別のターミナルで):
echo   cd frontend
echo   npm run dev
echo.
echo 📝 詳細はREADME.mdを参照してください。
pause
