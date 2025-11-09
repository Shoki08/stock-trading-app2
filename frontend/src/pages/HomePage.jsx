import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight, RefreshCw } from 'lucide-react';
import { useStore, api } from '../store';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { watchlist } = useStore();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWatchlistData();
  }, [watchlist]);

  const loadWatchlistData = async () => {
    if (watchlist.length === 0) return;
    
    setLoading(true);
    try {
      const stocksData = await Promise.all(
        watchlist.slice(0, 10).map(async (item) => {
          try {
            const info = await api.getStockInfo(item.symbol);
            return info;
          } catch (error) {
            return null;
          }
        })
      );
      setStocks(stocksData.filter(s => s !== null));
    } catch (error) {
      console.error('ウォッチリスト読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="page home-page">
      <header className="page-header">
        <h1>株式取引アシスタント</h1>
        <button className="icon-button" onClick={loadWatchlistData}>
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="content">
        <section className="quick-actions">
          <button className="action-card primary" onClick={() => navigate('/search')}>
            <TrendingUp size={24} />
            <span>銘柄を検索</span>
          </button>
        </section>

        <section className="watchlist-section">
          <div className="section-header">
            <h2>ウォッチリスト</h2>
            <button onClick={() => navigate('/search')}>
              追加 <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="loading">読み込み中...</div>
          ) : watchlist.length === 0 ? (
            <div className="empty-state">
              <p>ウォッチリストが空です</p>
              <button onClick={() => navigate('/search')}>銘柄を追加</button>
            </div>
          ) : (
            <div className="stock-list">
              {stocks.map((stock) => {
                const change = calculateChange(stock.current_price, stock.previous_close);
                const isPositive = change >= 0;

                return (
                  <div
                    key={stock.symbol}
                    className="stock-card"
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                  >
                    <div className="stock-info">
                      <div className="stock-symbol">{stock.symbol}</div>
                      <div className="stock-name">{stock.name}</div>
                    </div>
                    <div className="stock-price">
                      <div className="price">¥{stock.current_price.toLocaleString()}</div>
                      <div className={`change ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {isPositive ? '+' : ''}{change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="market-summary">
          <h2>市場サマリー</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <div className="label">日経平均</div>
              <div className="value">¥38,000</div>
              <div className="change positive">+0.5%</div>
            </div>
            <div className="summary-card">
              <div className="label">TOPIX</div>
              <div className="value">2,700</div>
              <div className="change negative">-0.2%</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
