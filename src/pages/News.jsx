import React, { useState } from 'react';
import { useMarketData } from '../contexts/MarketDataContext';
import { Newspaper, ExternalLink, Clock, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function News() {
  const { marketData } = useMarketData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'earnings', label: 'Earnings' },
    { value: 'tech', label: 'Technology' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'markets', label: 'Markets' },
  ];

  const filteredNews = marketData.news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Market News</h1>
        <p className="text-gray-600 mt-2">Stay updated with real-time financial news and market insights</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="lg:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input w-full"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
        
        {/* Additional mock news articles */}
        <NewsCard article={{
          id: 4,
          title: 'Tesla Reports Strong Q4 Delivery Numbers',
          content: 'Electric vehicle manufacturer Tesla exceeded expectations with record quarterly deliveries, boosting investor confidence...',
          source: 'MarketWatch',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        }} />
        
        <NewsCard article={{
          id: 5,
          title: 'Apple Unveils New AI Features for iPhone',
          content: 'Apple announced significant AI enhancements coming to iOS, focusing on personal productivity and privacy-first features...',
          source: 'TechCrunch',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }} />
        
        <NewsCard article={{
          id: 6,
          title: 'Banking Sector Sees Mixed Results in Latest Earnings',
          content: 'Major banks report varied performance with some exceeding expectations while others face headwinds from economic uncertainty...',
          source: 'CNN Business',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }} />
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Newspaper size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No News Found</h3>
          <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
        </div>
      )}
    </div>
  );
}

function NewsCard({ article }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 leading-tight">
          {article.title}
        </h2>
        <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
          <ExternalLink size={18} />
        </button>
      </div>
      
      <p className="text-gray-700 mb-4 leading-relaxed">
        {article.content}
      </p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-600">
            <Newspaper size={16} className="mr-1" />
            <span className="font-medium">{article.source}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock size={16} className="mr-1" />
            <span>{formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            Market News
          </span>
        </div>
      </div>
    </div>
  );
}