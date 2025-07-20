import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMarketData } from '../contexts/MarketDataContext';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockPerformanceData = [
  { date: '1/1', value: 45000 },
  { date: '1/2', value: 46200 },
  { date: '1/3', value: 45800 },
  { date: '1/4', value: 47100 },
  { date: '1/5', value: 48300 },
  { date: '1/6', value: 47900 },
  { date: '1/7', value: 49500 }
];

export default function Dashboard() {
  const { user, isPremium } = useAuth();
  const { marketData } = useMarketData();

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Investment Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your portfolio performance and market trends</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Portfolio Value"
          value={`$${user.investmentPortfolio.totalValue.toLocaleString()}`}
          change={user.investmentPortfolio.todayChange}
          changePercent={user.investmentPortfolio.todayChangePercent}
          icon={<DollarSign size={24} />}
        />
        <StatCard
          title="Today's Change"
          value={`$${Math.abs(user.investmentPortfolio.todayChange).toFixed(2)}`}
          change={user.investmentPortfolio.todayChange}
          changePercent={user.investmentPortfolio.todayChangePercent}
          icon={user.investmentPortfolio.todayChange >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
        />
        <StatCard
          title="Active Positions"
          value="12"
          icon={<Activity size={24} />}
        />
        <StatCard
          title="Cash Balance"
          value="$5,240"
          icon={<DollarSign size={24} />}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Top Holdings</h3>
          <div className="space-y-3">
            {[
              { symbol: 'AAPL', name: 'Apple Inc.', allocation: 18.5, value: 9275 },
              { symbol: 'MSFT', name: 'Microsoft', allocation: 15.2, value: 7600 },
              { symbol: 'NVDA', name: 'NVIDIA', allocation: 12.8, value: 6400 },
              { symbol: 'VOO', name: 'Vanguard S&P 500', allocation: 25.1, value: 12550 }
            ].map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{holding.symbol}</p>
                  <p className="text-sm text-gray-600">{holding.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${holding.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{holding.allocation}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Market Indices</h3>
          <div className="space-y-3">
            {marketData.indices.map((index) => (
              <div key={index.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{index.name}</p>
                  <p className="text-sm text-gray-600">{index.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${index.price}</p>
                  <div className={`flex items-center ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {index.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="ml-1 text-sm">{index.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {!isPremium ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Upgrade to Premium to view detailed activity history</p>
              <button className="btn-primary">Upgrade Now</button>
            </div>
          ) : (
            <div className="space-y-3">
              <ActivityItem
                type="buy"
                symbol="NVDA"
                shares={5}
                price={850.25}
                time="2h ago"
              />
              <ActivityItem
                type="sell"
                symbol="TSLA"
                shares={10}
                price={245.80}
                time="1d ago"
              />
              <ActivityItem
                type="dividend"
                symbol="AAPL"
                amount={125.50}
                time="3d ago"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, changePercent, icon }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1 text-sm font-medium">
                {changePercent}% today
              </span>
            </div>
          )}
        </div>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ type, symbol, shares, price, amount, time }) {
  const getTypeInfo = (type) => {
    switch (type) {
      case 'buy':
        return { label: 'Bought', color: 'text-green-600', bg: 'bg-green-50' };
      case 'sell':
        return { label: 'Sold', color: 'text-red-600', bg: 'bg-red-50' };
      case 'dividend':
        return { label: 'Dividend', color: 'text-blue-600', bg: 'bg-blue-50' };
      default:
        return { label: 'Activity', color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const typeInfo = getTypeInfo(type);

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
          <Activity size={16} className={typeInfo.color} />
        </div>
        <div>
          <p className="font-medium">
            {typeInfo.label} {symbol}
            {shares && ` (${shares} shares)`}
          </p>
          <p className="text-sm text-gray-600">{time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">
          {amount ? `$${amount}` : `$${(shares * price).toLocaleString()}`}
        </p>
        {price && <p className="text-sm text-gray-600">@${price}</p>}
      </div>
    </div>
  );
}