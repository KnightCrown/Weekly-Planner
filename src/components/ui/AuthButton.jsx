import React, { useState } from 'react';
import Button from './Button';
import Icon from '../AppIcon';
import { useAuth } from '../../hooks/useAuth';
import AuthModal from './AuthModal';

const AuthButton = ({ className = "" }) => {
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  if (loading) {
    return (
      <Button variant="outline" disabled className={className}>
        <Icon name="Loader2" size={16} className="animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <img
            src={!avatarError ? (user?.photoURL || undefined) : undefined}
            alt={user?.displayName || user?.email || 'User'}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              setAvatarError(true);
            }}
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.displayName || user?.email || 'User'}
            </p>
            <p className="text-xs text-gray-500">Cloud Sync Active</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          iconName="LogOut"
          iconPosition="left"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        iconName="LogIn"
        iconPosition="left"
        className={className}
      >
        Sign In
      </Button>
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAuthSuccess={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AuthButton;