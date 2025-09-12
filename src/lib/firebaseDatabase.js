import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Save tasks to Firebase Firestore
 * @param {Array} tasks - Array of task objects
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Save result
 */
export async function saveTasksToCloud(tasks, userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const tasksData = {
      tasks: tasks,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userDocRef, tasksData, { merge: true });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving tasks to cloud:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Load tasks from Firebase Firestore
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of tasks
 */
export async function loadTasksFromCloud(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.tasks || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error loading tasks from cloud:', error);
    return [];
  }
}

/**
 * Save time slot settings to Firebase Firestore
 * @param {Object} settings - Time slot settings object
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Save result
 */
export async function saveSettingsToCloud(settings, userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const settingsData = {
      timeSlotSettings: settings,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userDocRef, settingsData, { merge: true });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving settings to cloud:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Load time slot settings from Firebase Firestore
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Time slot settings
 */
export async function loadSettingsFromCloud(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.timeSlotSettings || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading settings from cloud:', error);
    return null;
  }
}

/**
 * Save user profile data to Firebase Firestore
 * @param {Object} profileData - User profile data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Save result
 */
export async function saveUserProfile(profileData, userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const profile = {
      ...profileData,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userDocRef, profile, { merge: true });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving user profile:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Load user profile data from Firebase Firestore
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export async function loadUserProfile(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
}
