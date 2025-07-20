import { aiService } from './aiService';

class MarketDataService {
  async getMarketOverview() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      indices: [
        { symbol: 'SPY', name: 'S&P 500', price: 425.30, change: 5.42, changePercent: 1.29 },
        { symbol: 'QQQ', name: 'NASDAQ', price: 350.15, change: -2.18, changePercent: -0.62 },
        { symbol: 'IWM', name: 'Russell 2000', price: 185.75, change: 3.25, changePercent: 1.78 },
        { symbol: 'VTI', name: 'Total Stock Market', price: 220.40, change: 4.12, changePercent: 1.90 }
      ],
      trending: [
        { symbol: 'NVDA', name: 'NVIDIA Corp', price: 850.25, change: 45.30, changePercent: 5.62 },
        { symbol: 'TSLA', name: 'Tesla Inc', price: 245.80, change: -12.45, changePercent: -4.82 },
        { symbol: 'AAPL', name: 'Apple Inc', price: 185.50, change: 2.35, changePercent: 1.28 },
        { symbol: 'MSFT', name: 'Microsoft Corp', price: 415.20, change: 8.75, changePercent: 2.15 },
        { symbol: 'AMZN', name: 'Amazon', price: 155.30, change: -3.20, changePercent: -2.02 }
      ],
      news: [
        {
          id: 1,
          title: 'Fed Holds Interest Rates Steady, Signals Potential Future Cuts',
          content: 'The Federal Reserve maintained current interest rates while hinting at possible reductions in the coming quarters...',
          source: 'Financial Times',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          title: 'AI Chip Demand Drives Semiconductor Rally',
          content: 'Artificial intelligence demand continues to fuel growth in semiconductor stocks, with NVIDIA leading gains...',
          source: 'Reuters',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          title: 'Clean Energy Stocks Surge on Policy Optimism',
          content: 'Renewable energy companies see significant gains following new government policy announcements...',
          source: 'Bloomberg',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }

  async generateMarketAnalysis(symbol) {
    const marketData = await this.getMarketOverview();
    return await aiService.generateMarketAnalysis(marketData, symbol);
  }

  async getPersonalizedRecommendations(portfolio) {
    return await aiService.generatePersonalizedRecommendations(portfolio);
  }

  async getPortfolioData() {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      accounts: [
        {
          id: 1,
          name: 'Brokerage Account',
          type: 'Investment',
          balance: 45000,
          holdings: [
            { symbol: 'AAPL', shares: 50, value: 9275 },
            { symbol: 'MSFT', shares: 25, value: 10380 },
            { symbol: 'NVDA', shares: 15, value: 12754 },
            { symbol: 'VOO', shares: 30, value: 12591 }
          ]
        },
        {
          id: 2,
          name: '401(k) Account',
          type: 'Retirement',
          balance: 85000,
          holdings: [
            { symbol: 'VTSAX', shares: 750, value: 85000 }
          ]
        }
      ],
      performance: {
        totalValue: 130000,
        todayChange: 2450.50,
        todayChangePercent: 1.92,
        monthChange: 5200.25,
        monthChangePercent: 4.17,
        yearChange: 15600.75,
        yearChangePercent: 13.64
      }
    };
  }
}

export const marketDataService = new MarketDataService();