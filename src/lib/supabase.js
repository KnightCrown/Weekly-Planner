import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not configured.');
  console.warn('📝 Please create a .env.local file (for local development) or .env file (for production)');
  console.warn('📖 Copy env.template to .env.local and add your Supabase credentials');
  console.warn('🔗 Get your credentials from: https://supabase.com/dashboard');
}

// Create Supabase client with fallback for missing env vars
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Sign in with Google using Supabase Auth
 * @returns {Promise<Object>} Authentication result
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check your environment variables.');
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'openid profile email https://www.googleapis.com/auth/calendar',
        redirectTo: `${window.location.origin}/weekly-planner-dashboard`,
      },
    });

    if (error) {
      // Provide helpful error messages for common configuration issues
      if (error.message?.includes('provider is not enabled')) {
        throw new Error('Google OAuth provider is not enabled in your Supabase project. Please enable it in the Supabase Dashboard under Authentication > Providers.');
      } else if (error.message?.includes('validation_failed')) {
        throw new Error('OAuth configuration error. Please check your Google OAuth settings in Supabase Dashboard.');
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 * @returns {Promise<Object>} Sign out result
 */
export async function signOut() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check your environment variables.');
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Get the current user session
 * @returns {Promise<Object|null>} User session or null
 */
export async function getCurrentUser() {
  if (!supabase) {
    return null;
  }
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Save tasks to Supabase database
 * @param {Array} tasks - Array of task objects
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Save result
 */
export async function saveTasksToCloud(tasks, userId) {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check your environment variables.');
  }
  
  try {
    const { data, error } = await supabase.from('weekly_planner_tasks').upsert({ 
        user_id: userId,
        tasks_data: tasks,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving tasks to cloud:', error);
    throw error;
  }
}

/**
 * Load tasks from Supabase database
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of tasks
 */
export async function loadTasksFromCloud(userId) {
  if (!supabase) {
    return [];
  }
  
  try {
    const { data, error } = await supabase.from('weekly_planner_tasks').select('tasks_data').eq('user_id', userId).single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error;
    }

    return data?.tasks_data || [];
  } catch (error) {
    console.error('Error loading tasks from cloud:', error);
    return [];
  }
}

/**
 * Save time slot settings to cloud
 * @param {Object} settings - Time slot settings object
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Save result
 */
export async function saveSettingsToCloud(settings, userId) {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check your environment variables.');
  }
  
  try {
    const { data, error } = await supabase.from('weekly_planner_settings').upsert({ 
        user_id: userId,
        time_slot_settings: settings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving settings to cloud:', error);
    throw error;
  }
}

/**
 * Load time slot settings from cloud
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Time slot settings
 */
export async function loadSettingsFromCloud(userId) {
  if (!supabase) {
    return null;
  }
  
  try {
    const { data, error } = await supabase.from('weekly_planner_settings').select('time_slot_settings').eq('user_id', userId).single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data?.time_slot_settings || null;
  } catch (error) {
    console.error('Error loading settings from cloud:', error);
    return null;
  }
}