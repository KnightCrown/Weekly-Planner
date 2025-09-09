import React from 'react';
import Button from './Button';
import Icon from '../AppIcon';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const AuthButton = ({ className = "" }) => {
  const { user, loading, signIn, signOut, isAuthenticated } = useAuth();

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
            src={user?.user_metadata?.avatar_url}
            alt={user?.user_metadata?.full_name || 'User'}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.user_metadata?.full_name || 'User'}
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

  // Show configuration message if Supabase is not configured
  if (!supabase) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Icon name="AlertCircle" size={16} className="text-amber-500" />
        <span className="text-sm text-amber-600">
          Configure Supabase to enable sign-in
        </span>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={signIn}
      iconName="LogIn"
      iconPosition="left"
      className={className}
    >
      Sign In with Google
    </Button>
  );
};

export default AuthButton;