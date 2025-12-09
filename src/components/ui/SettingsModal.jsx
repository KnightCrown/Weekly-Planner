import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';
import Input from './Input';

const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState({
    theme: 'light',
    colors: {
      background: '#FFFFFF',
      primary: '#2563EB',
      accent: '#10B981'
    }
  });

  // Initialize settings when modal opens
  useEffect(() => {
    if (isOpen && settings) {
      setLocalSettings({
        theme: settings.theme || 'light',
        colors: {
          background: settings.colors?.background || '#FFFFFF',
          primary: settings.colors?.primary || '#2563EB',
          accent: settings.colors?.accent || '#10B981'
        }
      });
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings || {
      theme: 'light',
      colors: {
        background: '#FFFFFF',
        primary: '#2563EB',
        accent: '#10B981'
      }
    });
    onClose();
  };

  const updateSetting = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateColor = (colorKey, value) => {
    setLocalSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'strawberry', label: 'Strawberry' }
  ];


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-lg shadow-xl border border-border w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Settings" size={20} className="text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Setting */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Theme</h3>
            <Select
              options={themeOptions}
              value={localSettings.theme}
              onChange={(value) => updateSetting('theme', value)}
              placeholder="Select theme"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
