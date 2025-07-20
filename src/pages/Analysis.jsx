import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMarketData } from '../contexts/MarketDataContext';
import { Brain, TrendingUp, AlertTriangle, Target, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Analysis() {
  const { user, isPremium } = useAuth();
  const { analysis, generateAnalysis } = useMarketData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('SPY');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleGenerateAnalysis = async () => {
    if (!isPremium && analysis) {
      setShowPremiumModal(true);
      return;
    }

    setIsGenerating(true);
    try {
      await generateAnalysis(selectedSymbol);
      toast.success('Market analysis generated successfully!');
    } catch (error) {
      toast.error('Failed to generate analysis');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Please log in to access AI-powered market analysis.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI-Powered Market Analysis</h1>
        <p className="text-gray-600 mt-2">Get intelligent insights and pattern recognition for your investments</p>
      </div>

      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Brain className="mr-2 text-primary-600" />
            Generate Market Analysis
          </h2>
          {!isPremium && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              Premium Feature
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Symbol</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="input"
            >
              <option value="SPY">S&P 500 (SPY)</option>
              <option value="QQQ">NASDAQ (QQQ)</option>
              <option value="NVDA">NVIDIA (NVDA)</option>
              <option value="AAPL">Apple (AAPL)</option>
              <option value="TSLA">Tesla (TSLA)</option>
              <option value="MSFT">Microsoft (MSFT)</option>
            </select>
          </div>
          <div className="pt-6">
            <button
              onClick={handleGenerateAnalysis}
              disabled={isGenerating}
              className="btn-primary flex items-center px-6 py-2"
            >
              <Search className="mr-2" size={16} />
              {isGenerating ? 'Analyzing...' : 'Generate Analysis'}
            </button>
          </div>
        </div>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Analysis Summary</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">{analysis.summary}</p>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Analysis for {analysis.symbol}</span>
              <span className="mx-2">•</span>
              <span>{new Date(analysis.timestamp).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-2 text-success-600" />
                Market Trends
              </h3>
              <div className="space-y-3">
                {analysis.trends.map((trend, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{trend.name}</p>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {trend.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{trend.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="mr-2 text-yellow-600" />
                Risk Assessment
              </h3>
              <div className="space-y-3">
                {analysis.risks.map((risk, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Risk Level: {risk.level}</p>
                    </div>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="mr-2 text-green-600" />
              Investment Opportunities
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {analysis.opportunities.map((opportunity, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800">{opportunity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!analysis && !isGenerating && (
        <div className="card text-center py-12">
          <Brain size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Analysis Generated Yet</h3>
          <p className="text-gray-600 mb-6">
            Generate AI-powered market analysis to get insights on trends, risks, and opportunities.
          </p>
          <button
            onClick={handleGenerateAnalysis}
            className="btn-primary"
          >
            Generate Your First Analysis
          </button>
        </div>
      )}

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Premium Feature</h3>
            <p className="text-gray-600 mb-6">
              You've used your free analysis. Upgrade to Premium to generate unlimited AI-powered market analyses.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPremiumModal(false);
                  // Navigate to pricing
                }}
                className="btn-primary flex-1"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}