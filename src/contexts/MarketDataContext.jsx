import React, { createContext, useContext, useState, useEffect } from 'react';
import { marketDataService } from '../services/marketDataService';

const MarketDataContext = createContext();

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
}

export function MarketDataProvider({ children }) {
  const [marketData, setMarketData] = useState({
    indices: [],
    trending: [],
    news: [],
    isLoading: true
  });
  const [recommendations, setRecommendations] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      const data = await marketDataService.getMarketOverview();
      setMarketData({ ...data, isLoading: false });
    } catch (error) {
      console.error('Error loading market data:', error);
      setMarketData(prev => ({ ...prev, isLoading: false }));
    }
  };

  const generateAnalysis = async (symbol) => {
    try {
      const analysisData = await marketDataService.generateMarketAnalysis(symbol);
      setAnalysis(analysisData);
      return analysisData;
    } catch (error) {
      console.error('Error generating analysis:', error);
      throw error;
    }
  };

  const getPersonalizedRecommendations = async (portfolio) => {
    try {
      const recs = await marketDataService.getPersonalizedRecommendations(portfolio);
      setRecommendations(recs);
      return recs;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  };

  const value = {
    marketData,
    recommendations,
    analysis,
    loadMarketData,
    generateAnalysis,
    getPersonalizedRecommendations
  };

  return <MarketDataContext.Provider value={value}>{children}</MarketDataContext.Provider>;
}