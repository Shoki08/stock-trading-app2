import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useStore = create(
  persist(
    (set, get) => ({
      // ウォッチリスト
      watchlist: [],
      addToWatchlist: (symbol) => {
        const current = get().watchlist;
        if (!current.find(item => item.symbol === symbol)) {
          set({ watchlist: [...current, { symbol, addedAt: new Date().toISOString() }] });
        }
      },
      removeFromWatchlist: (symbol) => {
        set({ watchlist: get().watchlist.filter(item => item.symbol !== symbol) });
      },

      // ポートフォリオ
      portfolio: [],
      addToPortfolio: (stock) => {
        set({ portfolio: [...get().portfolio, { ...stock, id: Date.now() }] });
      },
      removeFromPortfolio: (id) => {
        set({ portfolio: get().portfolio.filter(item => item.id !== id) });
      },
      updatePortfolio: (id, updates) => {
        set({
          portfolio: get().portfolio.map(item =>
            item.id === id ? { ...item, ...updates } : item
          )
        });
      },

      // 価格アラート
      alerts: [],
      addAlert: (alert) => {
        set({ alerts: [...get().alerts, { ...alert, id: Date.now(), active: true }] });
      },
      removeAlert: (id) => {
        set({ alerts: get().alerts.filter(alert => alert.id !== id) });
      },
      toggleAlert: (id) => {
        set({
          alerts: get().alerts.map(alert =>
            alert.id === id ? { ...alert, active: !alert.active } : alert
          )
        });
      },

      // 設定
      settings: {
        apiUrl: API_BASE_URL,
        notifications: true,
        darkMode: false,
        refreshInterval: 60000, // 1分
      },
      updateSettings: (updates) => {
        set({ settings: { ...get().settings, ...updates } });
      },

      // 取引履歴
      tradeHistory: [],
      addTrade: (trade) => {
        set({ tradeHistory: [{ ...trade, id: Date.now() }, ...get().tradeHistory] });
      },
      clearTradeHistory: () => {
        set({ tradeHistory: [] });
      },
    }),
    {
      name: 'stock-trading-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        portfolio: state.portfolio,
        alerts: state.alerts,
        settings: state.settings,
        tradeHistory: state.tradeHistory,
      }),
    }
  )
);

// API呼び出し関数
export const api = {
  async getStockInfo(symbol) {
    const response = await fetch(`${API_BASE_URL}/api/stock/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol })
    });
    if (!response.ok) throw new Error('株式情報の取得に失敗しました');
    return response.json();
  },

  async getHistoricalData(symbol, period = '1mo') {
    const response = await fetch(`${API_BASE_URL}/api/stock/historical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, period })
    });
    if (!response.ok) throw new Error('履歴データの取得に失敗しました');
    return response.json();
  },

  async getTechnicalAnalysis(symbol, period = '1mo') {
    const response = await fetch(`${API_BASE_URL}/api/stock/technical-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, period })
    });
    if (!response.ok) throw new Error('テクニカル分析に失敗しました');
    return response.json();
  },

  async getPrediction(symbol, period = '3mo') {
    const response = await fetch(`${API_BASE_URL}/api/stock/prediction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, period })
    });
    if (!response.ok) throw new Error('価格予測に失敗しました');
    return response.json();
  },

  async getNews(symbol) {
    const response = await fetch(`${API_BASE_URL}/api/stock/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol })
    });
    if (!response.ok) throw new Error('ニュースの取得に失敗しました');
    return response.json();
  },

  async getComprehensiveAnalysis(symbol, period = '3mo') {
    const response = await fetch(`${API_BASE_URL}/api/stock/comprehensive-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, period })
    });
    if (!response.ok) throw new Error('総合分析に失敗しました');
    return response.json();
  }
};
