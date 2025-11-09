import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Bell, RefreshCw, Download, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import './AllPages.css';

export default function SettingsPage() {
  const { settings, updateSettings, watchlist, portfolio, alerts, tradeHistory, clearTradeHistory } = useStore();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const toggleNotifications = () => {
    updateSettings({ notifications: !settings.notifications });
  };

  const handleShowOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    window.location.reload();
  };

  const handleExportData = () => {
    const data = {
      watchlist,
      portfolio,
      alerts,
      tradeHistory,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('すべてのデータを削除しますか?この操作は取り消せません。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="page settings-page">
      <header className="page-header">
        <h1>設定</h1>
      </header>

      <div className="content">
        <section className="settings-section">
          <h2>表示設定</h2>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">
                {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                ダークモード
              </div>
              <div className="setting-description">
                暗い背景でアプリを表示します
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={toggleDarkMode}
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h2>通知設定</h2>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">
                <Bell size={20} />
                プッシュ通知
              </div>
              <div className="setting-description">
                価格アラートの通知を受け取ります
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={toggleNotifications}
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h2>API設定</h2>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">APIエンドポイント</div>
              <input
                type="text"
                value={settings.apiUrl}
                onChange={(e) => updateSettings({ apiUrl: e.target.value })}
                className="api-input"
              />
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">
                <RefreshCw size={20} />
                更新間隔
              </div>
              <select
                value={settings.refreshInterval}
                onChange={(e) => updateSettings({ refreshInterval: parseInt(e.target.value) })}
                className="refresh-select"
              >
                <option value={30000}>30秒</option>
                <option value={60000}>1分</option>
                <option value={300000}>5分</option>
                <option value={900000}>15分</option>
              </select>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>データ管理</h2>
          <button className="action-button" onClick={handleExportData}>
            <Download size={20} />
            データをエクスポート
          </button>
          <button className="action-button danger" onClick={handleClearData}>
            <Trash2 size={20} />
            すべてのデータを削除
          </button>
        </section>

        <section className="settings-section">
          <h2>ヘルプ・サポート</h2>
          <button className="action-button" onClick={() => navigate('/help')}>
            📚 ヘルプ・用語集を見る
          </button>
          <button className="action-button" onClick={handleShowOnboarding}>
            🎓 使い方チュートリアルを見る
          </button>
        </section>

        <section className="settings-section">
          <h2>統計情報</h2>
          <div className="stats">
            <div className="stat-item">
              <span>ウォッチリスト</span>
              <strong>{watchlist.length}銘柄</strong>
            </div>
            <div className="stat-item">
              <span>ポートフォリオ</span>
              <strong>{portfolio.length}銘柄</strong>
            </div>
            <div className="stat-item">
              <span>アラート</span>
              <strong>{alerts.length}件</strong>
            </div>
            <div className="stat-item">
              <span>取引履歴</span>
              <strong>{tradeHistory.length}件</strong>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>アプリ情報</h2>
          <div className="info-text">
            <p>バージョン: 1.0.0</p>
            <p>© 2025 株式取引アシスタント</p>
            <p className="disclaimer">
              ※本アプリの情報は参考目的です。投資判断は自己責任で行ってください。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
