import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { MarketDataProvider } from './contexts/MarketDataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import News from './pages/News';
import Recommendations from './pages/Recommendations';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Register from './pages/Register';
import PricingPage from './pages/PricingPage';

function App() {
  return (
    <AuthProvider>
      <MarketDataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="news" element={<News />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="pricing" element={<PricingPage />} />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </Router>
      </MarketDataProvider>
    </AuthProvider>
  );
}

export default App;