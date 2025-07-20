import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { marketDataService } from '../services/marketDataService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Briefcase, TrendingUp, TrendingDown, DollarSign, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Portfolio() {
  const { user, isPremium } = useAuth();
  const [portfolioData, setPortfolioData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPortfolioData();
    }
  }, [user]);

  const loadPortfolioData = async () => {
    try {
      const data = await marketDataService.getPortfolioData();
      setPortfolioData(data);
    } catch (error) {
      toast.error('Failed to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Please log in to view your portfolio.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading portfolio...</p>
      </div>
    );
  }

  const pieChartData = portfolioData.accounts.reduce((acc, account) => {
    account.holdings.forEach(holding => {
      acc.push({
        name: holding.symbol,
        value: holding.value
      });
    });
    return acc;
  }, []);

  const performanceData = [
    { period: 'Today', value: portfolioData.performance.todayChangePercent },
    { period: 'Month', value: portfolioData.performance.monthChangePercent },
    { period: 'Year', value: portfolioData.performance.yearChangePercent }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Overview</h1>
            <p className="text-gray-600 mt-2">Monitor your investments across all accounts</p>
          </div>
          <button className="btn-primary flex items-center">
            <Plus size={18} className="mr-2" />
            Add Investment
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${portfolioData.performance.totalValue.toLocaleString()}
              </p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Change</p>
              <p className={`text-2xl font-bold ${portfolioData.performance.todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(portfolioData.performance.todayChange).toFixed(2)}
              </p>
              <div className="flex items-center">
                {portfolioData.performance.todayChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="ml-1 text-sm">
                  {portfolioData.performance.todayChangePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            {portfolioData.performance.todayChange >= 0 ? 
              <TrendingUp className="h-8 w-8 text-green-600" /> : 
              <TrendingDown className="h-8 w-8 text-red-600" />
            }
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Month Change</p>
              <p className={`text-2xl font-bold ${portfolioData.performance.monthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(portfolioData.performance.monthChange).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {portfolioData.performance.monthChangePercent.toFixed(2)}%
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Year Change</p>
              <p className={`text-2xl font-bold ${portfolioData.performance.yearChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(portfolioData.performance.yearChange).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {portfolioData.performance.yearChangePercent.toFixed(2)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Change']} />
                <Bar dataKey="value" fill={(entry) => entry >= 0 ? '#10b981' : '#ef4444'}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {portfolioData.accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}

function AccountCard({ account }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">{account.name}</h3>
          <p className="text-gray-600">{account.type}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Account Balance</p>
          <p className="text-2xl font-bold">${account.balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-sm">
          <div>Symbol</div>
          <div className="text-right">Shares</div>
          <div className="text-right">Value</div>
          <div className="text-right">% of Account</div>
        </div>

        {account.holdings.map((holding, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
            <div className="font-medium">{holding.symbol}</div>
            <div className="text-right">{holding.shares}</div>
            <div className="text-right font-medium">${holding.value.toLocaleString()}</div>
            <div className="text-right text-gray-600">
              {((holding.value / account.balance) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}