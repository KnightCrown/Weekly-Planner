import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Sign in with Google using Supabase Auth
 * @returns {Promise<Object>} Authentication result
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase?.auth?.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'openid profile email https://www.googleapis.com/auth/calendar',
        redirectTo: `${window.location?.origin}/weekly-planner-dashboard`,
      },
    });

    if (error) throw error;
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
  try {
    const { error } = await supabase?.auth?.signOut();
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
  try {
    const { data: { session }, error } = await supabase?.auth?.getSession();
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
  try {
    const { data, error } = await supabase?.from('weekly_planner_tasks')?.upsert({ 
        user_id: userId,
        tasks_data: tasks,
        updated_at: new Date()?.toISOString()
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
  try {
    const { data, error } = await supabase?.from('weekly_planner_tasks')?.select('tasks_data')?.eq('user_id', userId)?.single();

    if (error && error?.code !== 'PGRST116') { // PGRST116 is "not found"
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
  try {
    const { data, error } = await supabase?.from('weekly_planner_settings')?.upsert({ 
        user_id: userId,
        time_slot_settings: settings,
        updated_at: new Date()?.toISOString()
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
  try {
    const { data, error } = await supabase?.from('weekly_planner_settings')?.select('time_slot_settings')?.eq('user_id', userId)?.single();

    if (error && error?.code !== 'PGRST116') {
      throw error;
    }

    return data?.time_slot_settings || null;
  } catch (error) {
    console.error('Error loading settings from cloud:', error);
    return null;
  }
}