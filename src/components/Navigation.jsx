import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  TrendingUp, 
  Newspaper, 
  Target, 
  Briefcase,
  Crown
} from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/analysis', icon: TrendingUp, label: 'AI Analysis' },
  { to: '/news', icon: Newspaper, label: 'Market News' },
  { to: '/recommendations', icon: Target, label: 'Recommendations' },
  { to: '/portfolio', icon: Briefcase, label: 'Portfolio' },
  { to: '/pricing', icon: Crown, label: 'Premium' }
];

export default function Navigation() {
  return (
    <nav className="fixed left-0 top-16 w-64 h-full bg-white border-r border-gray-200">
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}