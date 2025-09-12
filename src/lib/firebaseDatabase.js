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
    const normalizedTasks = (tasks || []).map(task => ({
      id: task.id || Date.now(),
      title: task.title || "",
      description: task.description || "",
      day: task.day || null,
      timeSlot: task.timeSlot || null,
      completed: task.completed || false,
      createdAt: task.createdAt || new Date().toISOString()
    }));

    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      tasks: normalizedTasks,
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log("✅ Tasks saved to Firestore:", normalizedTasks);
    return { success: true };
  } catch (error) {
    console.error("❌ Error saving tasks to cloud:", error);
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
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const tasks = (data.tasks || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || "",
        day: task.day,
        timeSlot: task.timeSlot,
        completed: task.completed || false,
        createdAt: task.createdAt || null
      }));
      return { exists: true, tasks };
    }

    return { exists: false, tasks: [] };
  } catch (error) {
    console.error("❌ Error loading tasks from cloud:", error);
    return { exists: false, tasks: [] };
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
    console.log('⚙️ Saving settings to Firestore:', {
      userId,
      settings: settings
    });
    
    const userDocRef = doc(db, 'users', userId);
    const settingsData = {
      timeSlotSettings: settings,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userDocRef, settingsData, { merge: true });
    
    console.log('✅ Settings saved successfully to Firestore');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Error saving settings to cloud:', error);
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
    console.log('⚙️ Loading settings from Firestore for user:', userId);
    
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      const settings = data.timeSlotSettings || {};
      
      console.log('✅ Settings loaded from Firestore:', {
        userId,
        settings: settings,
        documentExists: true
      });
      
      return { exists: true, settings: settings };
    }
    
    console.log('📭 No settings found in Firestore for user:', userId);
    return { exists: false, settings: null };
  } catch (error) {
    console.error('❌ Error loading settings from cloud:', error);
    return { exists: false, settings: null };
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
