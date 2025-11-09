import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Check } from 'lucide-react';
import { useStore, api } from '../store';
import './SearchPage.css';

export default function SearchPage() {
  const navigate = useNavigate();
  const { watchlist, addToWatchlist } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 人気銘柄のサンプル
  const popularStocks = [
    { symbol: '7203.T', name: 'トヨタ自動車' },
    { symbol: '6758.T', name: 'ソニーグループ' },
    { symbol: '9984.T', name: 'ソフトバンクグループ' },
    { symbol: '6861.T', name: 'キーエンス' },
    { symbol: '9433.T', name: 'KDDI' },
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'GOOGL', name: 'Alphabet' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'NVDA', name: 'NVIDIA' },
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const info = await api.getStockInfo(searchTerm.toUpperCase());
      setSearchResults([info]);
    } catch (error) {
      alert('銘柄が見つかりませんでした');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = (symbol) => {
    addToWatchlist(symbol);
  };

  const isInWatchlist = (symbol) => {
    return watchlist.some(item => item.symbol === symbol);
  };

  return (
    <div className="page search-page">
      <header className="page-header">
        <h1>銘柄検索</h1>
      </header>

      <div className="content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="銘柄コードを入力 (例: 7203.T, AAPL)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading}>
            <Search size={20} />
          </button>
        </div>

        {loading && <div className="loading">検索中...</div>}

        {searchResults.length > 0 && (
          <section className="search-results">
            <h2>検索結果</h2>
            <div className="stock-list">
              {searchResults.map((stock) => (
                <div key={stock.symbol} className="stock-card">
                  <div
                    className="stock-info"
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                  >
                    <div className="stock-symbol">{stock.symbol}</div>
                    <div className="stock-name">{stock.name}</div>
                    <div className="stock-price">¥{stock.current_price.toLocaleString()}</div>
                  </div>
                  <button
                    className={`add-button ${isInWatchlist(stock.symbol) ? 'added' : ''}`}
                    onClick={() => handleAddToWatchlist(stock.symbol)}
                    disabled={isInWatchlist(stock.symbol)}
                  >
                    {isInWatchlist(stock.symbol) ? <Check size={20} /> : <Plus size={20} />}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="popular-stocks">
          <h2>人気銘柄</h2>
          <div className="stock-list">
            {popularStocks.map((stock) => (
              <div key={stock.symbol} className="stock-card">
                <div
                  className="stock-info"
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                >
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
                <button
                  className={`add-button ${isInWatchlist(stock.symbol) ? 'added' : ''}`}
                  onClick={() => handleAddToWatchlist(stock.symbol)}
                  disabled={isInWatchlist(stock.symbol)}
                >
                  {isInWatchlist(stock.symbol) ? <Check size={20} /> : <Plus size={20} />}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
