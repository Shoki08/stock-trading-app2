import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Star, Bell, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore, api } from '../store';
import './StockDetailPage.css';

export default function StockDetailPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { watchlist, addToWatchlist, removeFromWatchlist, addAlert, settings } = useStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('simple');
  const [stockInfo, setStockInfo] = useState(null);
  const [historical, setHistorical] = useState([]);
  const [technical, setTechnical] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [news, setNews] = useState(null);
  const [comprehensive, setComprehensive] = useState(null);
  const [showExplanation, setShowExplanation] = useState({});
  const [beginnerMode, setBeginnerMode] = useState(true);

  useEffect(() => {
    loadStockData();
  }, [symbol]);

  const loadStockData = async () => {
    setLoading(true);
    try {
      const [info, hist, tech, pred, newsData, comp] = await Promise.all([
        api.getStockInfo(symbol),
        api.getHistoricalData(symbol, '3mo'),
        api.getTechnicalAnalysis(symbol, '3mo'),
        api.getPrediction(symbol, '3mo'),
        api.getNews(symbol),
        api.getComprehensiveAnalysis(symbol, '3mo')
      ]);

      setStockInfo(info);
      setHistorical(hist.data);
      setTechnical(tech);
      setPrediction(pred);
      setNews(newsData);
      setComprehensive(comp);
    } catch (error) {
      console.error('データ読み込みエラー:', error);
      alert('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const isInWatchlist = watchlist.some(item => item.symbol === symbol);

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist(symbol);
    }
  };

  const handleAddAlert = () => {
    const targetPrice = prompt('アラート価格を入力してください:', stockInfo?.current_price);
    if (targetPrice) {
      addAlert({
        symbol,
        targetPrice: parseFloat(targetPrice),
        condition: 'above',
        createdAt: new Date().toISOString()
      });
      alert('アラートを設定しました');
    }
  };

  // 初心者向けの判断文言を生成
  const getSimpleRecommendation = (score) => {
    if (score >= 80) return { text: '今は強い買い時！', emoji: '🚀', color: 'very-positive' };
    if (score >= 65) return { text: '今は買い時です', emoji: '📈', color: 'positive' };
    if (score >= 45) return { text: '様子を見ましょう', emoji: '👀', color: 'neutral' };
    if (score >= 30) return { text: '今は売り時かも', emoji: '📉', color: 'negative' };
    return { text: '今は強い売り時', emoji: '⚠️', color: 'very-negative' };
  };

  // 初心者向けの説明文を生成
  const getBeginnerExplanation = () => {
    if (!comprehensive) return '';
    
    const score = comprehensive.overall_score;
    let explanation = '';

    if (score >= 70) {
      explanation = `この株は今、上昇の兆しが見えています。複数の分析結果から、価格が上がる可能性が高いと判断されました。`;
    } else if (score >= 55) {
      explanation = `この株は今、やや買い時の傾向にあります。ただし、確実ではないので慎重に判断してください。`;
    } else if (score >= 45) {
      explanation = `この株は今、判断が難しい状況です。もう少し様子を見てから決めるのが良いでしょう。`;
    } else if (score >= 30) {
      explanation = `この株は今、やや下落の兆しが見えています。価格が下がる可能性があるので注意が必要です。`;
    } else {
      explanation = `この株は今、価格が下がる可能性が高いと判断されました。売却を検討する時期かもしれません。`;
    }

    // 理由を追加
    const reasons = [];
    if (technical?.signals?.length > 0) {
      const buySignals = technical.signals.filter(s => s.type === '買いシグナル').length;
      const sellSignals = technical.signals.filter(s => s.type === '売りシグナル').length;
      if (buySignals > sellSignals) {
        reasons.push('上昇の兆しが複数見られる');
      } else if (sellSignals > buySignals) {
        reasons.push('下落の兆しが複数見られる');
      }
    }

    if (prediction?.price_change_percent) {
      if (prediction.price_change_percent > 2) {
        reasons.push('AIが価格上昇を予測');
      } else if (prediction.price_change_percent < -2) {
        reasons.push('AIが価格下落を予測');
      }
    }

    if (news?.overall_sentiment) {
      if (news.overall_sentiment === 'ポジティブ') {
        reasons.push('最近のニュースが良い');
      } else if (news.overall_sentiment === 'ネガティブ') {
        reasons.push('最近のニュースが悪い');
      }
    }

    if (reasons.length > 0) {
      explanation += '\n\n理由：' + reasons.join('、');
    }

    return explanation;
  };

  const toggleExplanation = (key) => {
    setShowExplanation(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="page stock-detail-page">
        <div className="loading-full">読み込み中...</div>
      </div>
    );
  }

  if (!stockInfo) {
    return (
      <div className="page stock-detail-page">
        <div className="error">データの読み込みに失敗しました</div>
      </div>
    );
  }

  const change = stockInfo.current_price - stockInfo.previous_close;
  const changePercent = (change / stockInfo.previous_close) * 100;
  const isPositive = change >= 0;

  const simpleRec = getSimpleRecommendation(comprehensive.overall_score);

  return (
    <div className="page stock-detail-page">
      <header className="detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-actions">
          <button onClick={() => navigate('/help')} title="ヘルプ">
            <HelpCircle size={20} />
          </button>
          <button onClick={handleAddAlert}>
            <Bell size={20} />
          </button>
          <button onClick={toggleWatchlist}>
            <Star size={20} fill={isInWatchlist ? 'currentColor' : 'none'} />
          </button>
          <button onClick={loadStockData}>
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      <div className="content">
        <div className="stock-header">
          <div className="stock-title">
            <h1>{stockInfo.symbol}</h1>
            <p>{stockInfo.name}</p>
          </div>
          <div className="stock-price-large">
            <div className="price">¥{stockInfo.current_price.toLocaleString()}</div>
            <div className={`change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* 初心者向け：一目でわかる判断 */}
        {comprehensive && (
          <div className={`big-decision-card ${simpleRec.color}`}>
            <div className="decision-emoji">{simpleRec.emoji}</div>
            <div className="decision-content">
              <h2>{simpleRec.text}</h2>
              <div className="confidence-display">
                <div className="score-display">
                  <span className="score-label">総合スコア</span>
                  <span className="score-value">{comprehensive.overall_score}<small>/100点</small></span>
                </div>
              </div>
              <button 
                className="explanation-toggle"
                onClick={() => toggleExplanation('main')}
              >
                {showExplanation.main ? (
                  <>なぜそう判断？ <ChevronUp size={16} /></>
                ) : (
                  <>なぜそう判断？ <ChevronDown size={16} /></>
                )}
              </button>
              {showExplanation.main && (
                <div className="explanation-text">
                  {getBeginnerExplanation()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* モード切替ボタン */}
        <div className="mode-toggle">
          <button
            className={beginnerMode ? 'active' : ''}
            onClick={() => setBeginnerMode(true)}
          >
            かんたん表示
          </button>
          <button
            className={!beginnerMode ? 'active' : ''}
            onClick={() => setBeginnerMode(false)}
          >
            くわしく表示
          </button>
        </div>

        {beginnerMode ? (
          /* 初心者モード */
          <div className="beginner-mode">
            <section className="simple-chart">
              <h3>📊 最近3ヶ月の値動き</h3>
              <p className="chart-description">
                この線が上がっていれば価格が上昇、下がっていれば下落しています
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={historical}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="close" stroke="#1a73e8" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="simple-info">
              <h3>📝 基本情報</h3>
              <div className="simple-info-grid">
                <div className="simple-info-item">
                  <span className="info-icon">💰</span>
                  <div>
                    <div className="info-label">今の値段</div>
                    <div className="info-value">¥{stockInfo.current_price.toLocaleString()}</div>
                  </div>
                </div>
                <div className="simple-info-item">
                  <span className="info-icon">📅</span>
                  <div>
                    <div className="info-label">昨日の終値</div>
                    <div className="info-value">¥{stockInfo.previous_close.toLocaleString()}</div>
                  </div>
                </div>
                <div className="simple-info-item">
                  <span className="info-icon">📈</span>
                  <div>
                    <div className="info-label">今日の高値</div>
                    <div className="info-value">¥{stockInfo.day_high.toLocaleString()}</div>
                  </div>
                </div>
                <div className="simple-info-item">
                  <span className="info-icon">📉</span>
                  <div>
                    <div className="info-label">今日の安値</div>
                    <div className="info-value">¥{stockInfo.day_low.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </section>

            {prediction && (
              <section className="simple-prediction">
                <h3>🤖 AIの予測</h3>
                <div className="prediction-card">
                  <div className="prediction-result">
                    {prediction.price_change_percent >= 2 ? (
                      <div className="prediction-positive">
                        <TrendingUp size={32} />
                        <span>上がりそう</span>
                      </div>
                    ) : prediction.price_change_percent <= -2 ? (
                      <div className="prediction-negative">
                        <TrendingDown size={32} />
                        <span>下がりそう</span>
                      </div>
                    ) : (
                      <div className="prediction-neutral">
                        <span>横ばい</span>
                      </div>
                    )}
                  </div>
                  <div className="prediction-details">
                    <p>
                      AIの予測では、今後5日間で
                      <strong className={prediction.price_change_percent >= 0 ? 'positive' : 'negative'}>
                        {prediction.price_change_percent >= 0 ? '+' : ''}{prediction.price_change_percent.toFixed(1)}%
                      </strong>
                      の変動が見込まれます
                    </p>
                    <p className="confidence-note">
                      信頼度: {prediction.confidence.toFixed(0)}%
                      {prediction.confidence >= 70 ? ' （比較的確実）' : prediction.confidence >= 50 ? ' （やや不確実）' : ' （不確実）'}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {news && news.news.length > 0 && (
              <section className="simple-news">
                <h3>📰 最近のニュース</h3>
                <div className={`news-sentiment-badge ${news.overall_sentiment.toLowerCase()}`}>
                  全体の雰囲気: {news.overall_sentiment}
                  {news.overall_sentiment === 'ポジティブ' && ' 😊'}
                  {news.overall_sentiment === 'ネガティブ' && ' 😟'}
                  {news.overall_sentiment === '中立' && ' 😐'}
                </div>
                <div className="simple-news-list">
                  {news.news.slice(0, 3).map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="simple-news-item"
                    >
                      <div className="news-title">{item.title}</div>
                      <div className="news-meta">
                        <span>{item.publisher}</span>
                        <span className={`sentiment-badge ${item.sentiment.toLowerCase()}`}>
                          {item.sentiment === 'ポジティブ' && '😊 良い'}
                          {item.sentiment === 'ネガティブ' && '😟 悪い'}
                          {item.sentiment === '中立' && '😐 普通'}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <div className="beginner-tips">
              <h4>💡 初心者のためのヒント</h4>
              <ul>
                <li>スコアが70点以上でも、必ず上がるわけではありません</li>
                <li>一つの情報だけで判断せず、総合的に考えましょう</li>
                <li>わからないことは「ヘルプ」ボタンで確認できます</li>
                <li>少額から始めて、徐々に慣れていきましょう</li>
              </ul>
            </div>
          </div>
        ) : (
          /* 詳細モード（元のタブ表示） */
          <div className="detail-mode">
            <div className="tabs">
              <button
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                概要
              </button>
              <button
                className={activeTab === 'technical' ? 'active' : ''}
                onClick={() => setActiveTab('technical')}
              >
                テクニカル
              </button>
              <button
                className={activeTab === 'prediction' ? 'active' : ''}
                onClick={() => setActiveTab('prediction')}
              >
                AI予測
              </button>
              <button
                className={activeTab === 'news' ? 'active' : ''}
                onClick={() => setActiveTab('news')}
              >
                ニュース
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="tab-content">
            <section className="chart-section">
              <h2>株価チャート (3ヶ月)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historical}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="close" stroke="#1a73e8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="info-grid">
              <div className="info-item">
                <span>前日終値</span>
                <strong>¥{stockInfo.previous_close.toLocaleString()}</strong>
              </div>
              <div className="info-item">
                <span>始値</span>
                <strong>¥{stockInfo.open.toLocaleString()}</strong>
              </div>
              <div className="info-item">
                <span>高値</span>
                <strong>¥{stockInfo.day_high.toLocaleString()}</strong>
              </div>
              <div className="info-item">
                <span>安値</span>
                <strong>¥{stockInfo.day_low.toLocaleString()}</strong>
              </div>
              <div className="info-item">
                <span>出来高</span>
                <strong>{(stockInfo.volume / 1000000).toFixed(2)}M</strong>
              </div>
              <div className="info-item">
                <span>時価総額</span>
                <strong>{(stockInfo.market_cap / 1000000000).toFixed(2)}B</strong>
              </div>
              <div className="info-item">
                <span>PER</span>
                <strong>{stockInfo.pe_ratio?.toFixed(2) || 'N/A'}</strong>
              </div>
              <div className="info-item">
                <span>52週高値</span>
                <strong>¥{stockInfo['52week_high'].toLocaleString()}</strong>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'technical' && technical && (
          <div className="tab-content">
            <div className="trend-indicator">
              <h2>トレンド: {technical.trend}</h2>
            </div>

            <section className="indicators">
              <h3>テクニカル指標</h3>
              <div className="indicator-list">
                <div className="indicator-item">
                  <span>RSI (14)</span>
                  <strong>{technical.indicators.RSI?.toFixed(2) || 'N/A'}</strong>
                </div>
                <div className="indicator-item">
                  <span>MACD</span>
                  <strong>{technical.indicators.MACD?.toFixed(2) || 'N/A'}</strong>
                </div>
                <div className="indicator-item">
                  <span>移動平均 (20日)</span>
                  <strong>¥{technical.indicators.SMA_20?.toLocaleString() || 'N/A'}</strong>
                </div>
                <div className="indicator-item">
                  <span>移動平均 (50日)</span>
                  <strong>¥{technical.indicators.SMA_50?.toLocaleString() || 'N/A'}</strong>
                </div>
              </div>
            </section>

            <section className="signals">
              <h3>売買シグナル</h3>
              {technical.signals.length === 0 ? (
                <p>現在シグナルはありません</p>
              ) : (
                <div className="signal-list">
                  {technical.signals.map((signal, index) => (
                    <div key={index} className={`signal-card ${signal.type === '買いシグナル' ? 'buy' : 'sell'}`}>
                      <div className="signal-type">{signal.type}</div>
                      <div className="signal-indicator">{signal.indicator}</div>
                      <div className="signal-reason">{signal.reason}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'prediction' && prediction && (
          <div className="tab-content">
            <div className="prediction-summary">
              <h2>{prediction.recommendation}</h2>
              <div className="confidence">信頼度: {prediction.confidence.toFixed(0)}%</div>
            </div>

            <section className="prediction-details">
              <div className="detail-item">
                <span>現在価格</span>
                <strong>¥{prediction.current_price.toLocaleString()}</strong>
              </div>
              <div className="detail-item">
                <span>予測平均価格</span>
                <strong>¥{prediction.average_prediction.toLocaleString()}</strong>
              </div>
              <div className="detail-item">
                <span>変動予測</span>
                <strong className={prediction.price_change_percent >= 0 ? 'positive' : 'negative'}>
                  {prediction.price_change_percent >= 0 ? '+' : ''}{prediction.price_change_percent.toFixed(2)}%
                </strong>
              </div>
            </section>

            <section className="future-predictions">
              <h3>今後5日間の予測価格</h3>
              <div className="prediction-list">
                {prediction.predicted_prices.map((price, index) => (
                  <div key={index} className="prediction-item">
                    <span>Day {index + 1}</span>
                    <strong>¥{price.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </section>

            <div className="disclaimer">
              <p>{prediction.note}</p>
            </div>
          </div>
        )}

        {activeTab === 'news' && news && (
          <div className="tab-content">
            <div className="sentiment-summary">
              <h2>ニュースセンチメント: {news.overall_sentiment}</h2>
              <div className="sentiment-score">
                スコア: {news.average_sentiment_score.toFixed(2)}
              </div>
            </div>

            <section className="news-list">
              {news.news.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-item"
                >
                  <div className="news-content">
                    <h3>{item.title}</h3>
                    <div className="news-meta">
                      <span>{item.publisher}</span>
                      <span className={`sentiment ${item.sentiment.toLowerCase()}`}>
                        {item.sentiment}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </section>
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  );
}
