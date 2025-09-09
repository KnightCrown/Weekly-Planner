import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import SettingsModal from './SettingsModal';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ onHelpClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const primaryNavItems = [
    {
      label: 'Weekly Planner',
      path: '/weekly-planner-dashboard',
      icon: 'Calendar'
    }
  ];

  const secondaryNavItems = [
    {
      label: 'Settings',
      path: '/settings',
      icon: 'Settings'
    },
    {
      label: 'Help',
      path: '/help',
      icon: 'HelpCircle'
    }
  ];

  const handleNavigation = (path) => {
    if (path === '/help' && onHelpClick) {
      onHelpClick();
      setIsMoreMenuOpen(false);
    } else if (path === '/settings') {
      setIsSettingsOpen(true);
      setIsMoreMenuOpen(false);
    } else {
      navigate(path);
      setIsMoreMenuOpen(false);
    }
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleSettingsChange = (newSettings) => {
    setTheme(newSettings.theme);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="white" />
            </div>
            <h1 className="text-xl font-semibold text-text-primary dark:text-white">WeeklyBlocks</h1>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={18}
              className="px-4 py-2"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              iconName="Menu"
              size="icon"
              className="w-10 h-10"
            />
            
            {isMoreMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                  {secondaryNavItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            iconName="Menu"
            size="icon"
            className="w-10 h-10"
          />
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMoreMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="py-2">
            {primaryNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-sm transition-colors duration-150 ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-white' :'text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </button>
            ))}
            
            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              {secondaryNavItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className="w-full flex items-center space-x-3 px-6 py-3 text-sm text-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={{ theme }}
        onSettingsChange={handleSettingsChange}
      />
    </header>
  );
};

export default Header;