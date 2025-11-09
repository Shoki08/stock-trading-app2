import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useStore } from '../store';
import './AllPages.css';

export default function PortfolioPage() {
  const navigate = useNavigate();
  const { portfolio, removeFromPortfolio } = useStore();

  const totalValue = portfolio.reduce((sum, stock) => 
    sum + (stock.shares * stock.avgPrice), 0
  );

  const totalGain = portfolio.reduce((sum, stock) => {
    const currentValue = stock.shares * stock.currentPrice;
    const costBasis = stock.shares * stock.avgPrice;
    return sum + (currentValue - costBasis);
  }, 0);

  const totalGainPercent = totalValue > 0 ? (totalGain / totalValue) * 100 : 0;

  return (
    <div className="page portfolio-page">
      <header className="page-header">
        <h1>ポートフォリオ</h1>
        <button className="icon-button" onClick={() => navigate('/search')}>
          <Plus size={20} />
        </button>
      </header>

      <div className="content">
        <div className="portfolio-summary">
          <div className="summary-item">
            <span>総資産額</span>
            <strong>¥{totalValue.toLocaleString()}</strong>
          </div>
          <div className="summary-item">
            <span>損益</span>
            <strong className={totalGain >= 0 ? 'positive' : 'negative'}>
              {totalGain >= 0 ? '+' : ''}¥{totalGain.toLocaleString()}
              ({totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%)
            </strong>
          </div>
        </div>

        {portfolio.length === 0 ? (
          <div className="empty-state">
            <p>ポートフォリオが空です</p>
            <button onClick={() => navigate('/search')}>銘柄を追加</button>
          </div>
        ) : (
          <div className="holdings-list">
            {portfolio.map((stock) => {
              const currentValue = stock.shares * stock.currentPrice;
              const costBasis = stock.shares * stock.avgPrice;
              const gain = currentValue - costBasis;
              const gainPercent = (gain / costBasis) * 100;
              const isPositive = gain >= 0;

              return (
                <div
                  key={stock.id}
                  className="holding-card"
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                >
                  <div className="holding-header">
                    <div>
                      <div className="symbol">{stock.symbol}</div>
                      <div className="shares">{stock.shares}株</div>
                    </div>
                    <div className="value">¥{currentValue.toLocaleString()}</div>
                  </div>
                  <div className="holding-details">
                    <div className="detail-item">
                      <span>平均取得単価</span>
                      <span>¥{stock.avgPrice.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span>現在単価</span>
                      <span>¥{stock.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span>損益</span>
                      <span className={isPositive ? 'positive' : 'negative'}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isPositive ? '+' : ''}¥{gain.toLocaleString()}
                        ({isPositive ? '+' : ''}{gainPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
