import React from 'react';
import { Bell, BellOff, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import './AllPages.css';

export default function AlertsPage() {
  const navigate = useNavigate();
  const { alerts, removeAlert, toggleAlert } = useStore();

  return (
    <div className="page alerts-page">
      <header className="page-header">
        <h1>価格アラート</h1>
        <button className="icon-button" onClick={() => navigate('/search')}>
          <Plus size={20} />
        </button>
      </header>

      <div className="content">
        {alerts.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <p>設定されたアラートがありません</p>
            <button onClick={() => navigate('/search')}>
              アラートを追加
            </button>
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert-card ${!alert.active ? 'inactive' : ''}`}>
                <div className="alert-main" onClick={() => navigate(`/stock/${alert.symbol}`)}>
                  <div className="alert-symbol">{alert.symbol}</div>
                  <div className="alert-condition">
                    {alert.condition === 'above' ? '以上' : '以下'}
                  </div>
                  <div className="alert-price">¥{alert.targetPrice.toLocaleString()}</div>
                </div>
                <div className="alert-actions">
                  <button
                    className="toggle-button"
                    onClick={() => toggleAlert(alert.id)}
                  >
                    {alert.active ? <Bell size={18} /> : <BellOff size={18} />}
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => {
                      if (confirm('このアラートを削除しますか?')) {
                        removeAlert(alert.id);
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="alert-info">
          <h2>アラートについて</h2>
          <ul>
            <li>価格が設定値に達すると通知が届きます</li>
            <li>アラートは有効/無効の切り替えが可能です</li>
            <li>通知を受け取るにはブラウザの通知を許可してください</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
