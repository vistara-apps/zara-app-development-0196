import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMarketData } from '../contexts/MarketDataContext';
import { Target, TrendingUp, Shield, Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Recommendations() {
  const { user, isPremium } = useAuth();
  const { recommendations, getPersonalizedRecommendations } = useMarketData();
  const [isLoading, setIsLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    if (user && isPremium && recommendations.length === 0) {
      handleGenerateRecommendations();
    }
  }, [user, isPremium]);

  const handleGenerateRecommendations = async () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    setIsLoading(true);
    try {
      await getPersonalizedRecommendations(user.investmentPortfolio);
      toast.success('Personalized recommendations generated!');
    } catch (error) {
      toast.error('Failed to generate recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Please log in to access personalized investment recommendations.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Personalized Investment Recommendations</h1>
        <p className="text-gray-600 mt-2">AI-powered suggestions tailored to your portfolio and goals</p>
      </div>

      {!isPremium && (
        <div className="card mb-8 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Unlock Personalized Recommendations</h3>
              <p className="text-yellow-700 mt-1">
                Get AI-powered investment suggestions tailored to your portfolio and risk tolerance.
              </p>
            </div>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="btn-primary whitespace-nowrap"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Target className="mr-2 text-primary-600" />
          Your Recommendations
        </h2>
        {isPremium && (
          <button
            onClick={handleGenerateRecommendations}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Generating...' : 'Refresh Recommendations'}
          </button>
        )}
      </div>

      {isPremium && recommendations.length > 0 ? (
        <div className="grid gap-6">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      ) : isPremium ? (
        <div className="card text-center py-12">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600 mb-6">
            Generate personalized investment recommendations based on your portfolio.
          </p>
          <button
            onClick={handleGenerateRecommendations}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Generating...' : 'Generate Recommendations'}
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Show sample recommendations for non-premium users */}
          <div className="relative">
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="text-center">
                <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">Premium Feature</p>
                <p className="text-gray-600">Upgrade to unlock personalized recommendations</p>
              </div>
            </div>
            <RecommendationCard 
              recommendation={{
                id: 1,
                title: 'Diversify into ESG Funds',
                description: 'Consider adding ESG-focused ETFs to align with sustainable investing trends',
                confidence: 88,
                risk: 'Low',
                expectedReturn: '8-12%',
                timeHorizon: 'Long-term',
                reasoning: 'Your portfolio currently lacks ESG exposure which is becoming increasingly important...'
              }} 
              isBlurred={true}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="text-center">
                <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">Premium Feature</p>
                <p className="text-gray-600">Upgrade to unlock personalized recommendations</p>
              </div>
            </div>
            <RecommendationCard 
              recommendation={{
                id: 2,
                title: 'Technology Sector Allocation',
                description: 'Increase exposure to cloud computing and AI technology stocks',
                confidence: 76,
                risk: 'Medium',
                expectedReturn: '12-18%',
                timeHorizon: 'Medium-term',
                reasoning: 'AI and cloud technologies showing strong growth potential in current market conditions...'
              }} 
              isBlurred={true}
            />
          </div>
        </div>
      )}

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upgrade to Premium</h3>
            <p className="text-gray-600 mb-6">
              Unlock personalized investment recommendations powered by AI analysis of your portfolio.
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

function RecommendationCard({ recommendation, isBlurred = false }) {
  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
      case 'medium-high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`card ${isBlurred ? 'blur-sm' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{recommendation.title}</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(recommendation.confidence / 20)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">{recommendation.confidence}%</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{recommendation.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Shield size={20} className="mx-auto mb-1 text-gray-600" />
          <p className="text-sm text-gray-600">Risk Level</p>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(recommendation.risk)}`}>
            {recommendation.risk}
          </span>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <TrendingUp size={20} className="mx-auto mb-1 text-gray-600" />
          <p className="text-sm text-gray-600">Expected Return</p>
          <p className="font-medium">{recommendation.expectedReturn}</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Clock size={20} className="mx-auto mb-1 text-gray-600" />
          <p className="text-sm text-gray-600">Time Horizon</p>
          <p className="font-medium">{recommendation.timeHorizon}</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Target size={20} className="mx-auto mb-1 text-gray-600" />
          <p className="text-sm text-gray-600">Confidence</p>
          <p className="font-medium">{recommendation.confidence}%</p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">AI Reasoning</h4>
        <p className="text-blue-700 text-sm">{recommendation.reasoning}</p>
      </div>
    </div>
  );
}