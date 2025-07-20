import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMarketData } from '../contexts/MarketDataContext';
import { TrendingUp, TrendingDown, BarChart3, Newspaper, Target, Zap } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { marketData } = useMarketData();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Unlock the Power of <span className="text-primary-600">AI-Driven</span> Market Intelligence
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized investment insights, real-time market analysis, and AI-powered recommendations 
            to make smarter investment decisions.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/register')}
              className="btn-primary px-8 py-4 text-lg"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="btn-secondary px-8 py-4 text-lg"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <FeatureCard 
            icon={<Zap className="h-8 w-8 text-primary-600" />}
            title="AI-Powered Analysis" 
            description="Advanced algorithms analyze market patterns and trends in real-time"
          />
          <FeatureCard 
            icon={<Newspaper className="h-8 w-8 text-success-600" />}
            title="Real-time News" 
            description="Stay updated with breaking financial news from multiple sources"
          />
          <FeatureCard 
            icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
            title="Portfolio Dashboard" 
            description="Consolidated view of all your investments in one place"
          />
          <FeatureCard 
            icon={<Target className="h-8 w-8 text-purple-600" />}
            title="Personalized Recommendations" 
            description="Get AI-driven investment suggestions tailored to your goals"
          />
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Market Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.indices.map((index) => (
              <div key={index.symbol} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{index.name}</p>
                    <p className="text-sm text-gray-600">{index.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">${index.price}</p>
                  <div className={`flex items-center ${index.change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {index.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="ml-1 text-sm font-medium">
                      {index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here's your market overview and portfolio summary</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Portfolio Value</h3>
          <p className="text-3xl font-bold text-gray-900">${user.investmentPortfolio.totalValue.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            {user.investmentPortfolio.todayChange >= 0 ? 
              <TrendingUp className="text-success-600" size={20} /> : 
              <TrendingDown className="text-danger-600" size={20} />
            }
            <span className={`ml-2 font-medium ${user.investmentPortfolio.todayChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              ${Math.abs(user.investmentPortfolio.todayChange).toFixed(2)} ({user.investmentPortfolio.todayChangePercent}%)
            </span>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/analysis')}
              className="w-full btn-primary py-2"
            >
              Get AI Analysis
            </button>
            <button 
              onClick={() => navigate('/recommendations')}
              className="w-full btn-secondary py-2"
            >
              View Recommendations
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Latest News</h3>
          {marketData.news.slice(0, 2).map((article) => (
            <div key={article.id} className="mb-3 last:mb-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">{article.title}</p>
              <p className="text-xs text-gray-500 mt-1">{article.source}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Market Indices</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.indices.map((index) => (
            <div key={index.symbol} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{index.name}</p>
                  <p className="text-sm text-gray-600">{index.symbol}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">${index.price}</p>
                <div className={`flex items-center ${index.change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {index.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="ml-1 text-sm font-medium">
                    {index.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}