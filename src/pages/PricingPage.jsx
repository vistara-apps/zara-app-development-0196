import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { Check, Crown, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const { user, isPremium, upgradeToPremium } = useAuth();
  const { createSession } = usePaymentContext();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please log in to upgrade');
      return;
    }

    setIsUpgrading(true);
    try {
      await createSession();
      upgradeToPremium();
      toast.success('Successfully upgraded to Premium!');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const freeFeatures = [
    'Basic market overview',
    'Limited news access',
    'Basic portfolio tracking',
    'One AI analysis per day'
  ];

  const premiumFeatures = [
    'Unlimited AI-powered market analysis',
    'Real-time news from premium sources',
    'Personalized investment recommendations',
    'Advanced portfolio analytics',
    'Risk assessment tools',
    'Priority customer support',
    'Export capabilities',
    'Custom alerts and notifications'
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">
          Start free and upgrade to unlock the full power of AI-driven investment insights
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="card relative">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Free</h2>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-gray-600 mt-2">Perfect for getting started</p>
          </div>

          <ul className="space-y-3 mb-8">
            {freeFeatures.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button 
            className="w-full btn-secondary py-3"
            disabled
          >
            Current Plan
          </button>
        </div>

        <div className="card relative border-2 border-blue-500">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <Crown className="mr-2 text-yellow-500" />
              Premium
            </h2>
            <div className="mt-4">
              <span className="text-4xl font-bold">$10</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-gray-600 mt-2">Full access to all features</p>
          </div>

          <ul className="space-y-3 mb-8">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {isPremium ? (
            <button className="w-full btn-primary py-3 bg-green-600 hover:bg-green-700" disabled>
              <Check className="mr-2" size={18} />
              Current Plan
            </button>
          ) : (
            <button 
              onClick={handleUpgrade}
              disabled={isUpgrading || !user}
              className="w-full btn-primary py-3 flex items-center justify-center"
            >
              <Zap className="mr-2" size={18} />
              {isUpgrading ? 'Processing...' : 'Upgrade Now'}
            </button>
          )}

          {!user && (
            <p className="text-center text-sm text-gray-600 mt-2">
              Please log in to upgrade
            </p>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 font-medium">Feature</th>
                  <th className="text-center py-4 font-medium">Free</th>
                  <th className="text-center py-4 font-medium">Premium</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <FeatureRow feature="AI Market Analysis" free="1 per day" premium="Unlimited" />
                <FeatureRow feature="Investment Recommendations" free="❌" premium="✅" />
                <FeatureRow feature="Real-time News" free="Basic" premium="Premium Sources" />
                <FeatureRow feature="Portfolio Analytics" free="Basic" premium="Advanced" />
                <FeatureRow feature="Risk Assessment" free="❌" premium="✅" />
                <FeatureRow feature="Custom Alerts" free="❌" premium="✅" />
                <FeatureRow feature="Export Data" free="❌" premium="✅" />
                <FeatureRow feature="Priority Support" free="❌" premium="✅" />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FAQItem 
            question="Can I cancel anytime?"
            answer="Yes, you can cancel your Premium subscription at any time. You'll continue to have access to Premium features until the end of your billing period."
          />
          <FAQItem 
            question="Do you offer refunds?"
            answer="We offer a 30-day money-back guarantee for new Premium subscribers. If you're not satisfied, contact our support team."
          />
          <FAQItem 
            question="How accurate are the AI recommendations?"
            answer="Our AI models are trained on extensive market data and provide insights based on patterns and trends. However, all investments carry risk and past performance doesn't guarantee future results."
          />
          <FAQItem 
            question="Is my financial data secure?"
            answer="Yes, we use bank-level encryption and security measures to protect your data. We never store your login credentials for financial institutions."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ feature, free, premium }) {
  return (
    <tr className="border-b">
      <td className="py-3">{feature}</td>
      <td className="text-center py-3">{free}</td>
      <td className="text-center py-3">{premium}</td>
    </tr>
  );
}

function FAQItem({ question, answer }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-2">{question}</h3>
      <p className="text-gray-600 text-sm">{answer}</p>
    </div>
  );
}