import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/ui/Header';
import WeeklyGrid from './components/WeeklyGrid';
import MobileWeeklyView from './components/MobileWeeklyView';
import TaskStats from './components/TaskStats';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import AuthButton from '../../components/ui/AuthButton';

import { useAuth } from '../../hooks/useAuth';
import { saveTasksToCloud, loadTasksFromCloud, saveSettingsToCloud, loadSettingsFromCloud } from '../../lib/firebaseDatabase';
 

const WeeklyPlannerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(true);
  
  const [showAISuggestions, setShowAISuggestions] = useState(null);
  const [timeSlotSettings, setTimeSlotSettings] = useState({
    Morning: { name: 'Morning', subtitle: '10am - 2pm' },
    Afternoon: { name: 'Afternoon', subtitle: '3pm - 5pm' },
    Evening: { name: 'Evening', subtitle: '8pm - 12pm' }
  });

  const { user, isAuthenticated } = useAuth();
  const hasLoadedFromCloud = useRef(false);
  const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);

  // Get app version from HTML meta tag
  const getAppVersion = () => {
    const metaTag = document.querySelector('meta[name="app-version"]');
    return metaTag ? metaTag.getAttribute('content') : 'v1.0.0';
  };


  // Load tasks and settings on component mount and auth change
  useEffect(() => {
    const loadData = async () => {
      console.log('📥 Loading data:', {
        isAuthenticated,
        hasUser: !!user?.uid,
        userId: user?.uid
      });

      // Reset the flags when loading new data
      hasLoadedFromCloud.current = false;
      setHasUserMadeChanges(false);

      if (isAuthenticated && user?.uid) {
        try {
          // Load from cloud
          console.log('☁️ Loading from Firestore...');
          const cloudTasksResult = await loadTasksFromCloud(user.uid);
          const cloudSettingsResult = await loadSettingsFromCloud(user.uid);
          
          if (cloudTasksResult.exists) {
            // If Firestore doc exists, use it (tasks default to [] if missing)
            console.log('✅ Using Firestore tasks:', cloudTasksResult.tasks);
            console.log('📍 Task locations being restored:', cloudTasksResult.tasks?.map(task => ({
              title: task.title,
              day: task.day,
              timeSlot: task.timeSlot
            })));
            setTasks(cloudTasksResult.tasks || []);
          } else {
            // If no cloud data, fallback to localStorage
            console.log('📭 No Firestore data, falling back to localStorage');
            const savedTasks = localStorage.getItem('weeklyPlannerTasks');
            const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
            console.log('💾 Using localStorage tasks:', parsedTasks);
            setTasks(parsedTasks);
          }

          if (cloudSettingsResult.exists) {
            // If Firestore doc exists, use it (settings default to {} if missing)
            console.log('✅ Using Firestore settings:', cloudSettingsResult.settings);
            setTimeSlotSettings(cloudSettingsResult.settings || {});
          } else {
            // If no cloud data, fallback to localStorage
            console.log('📭 No Firestore settings, falling back to localStorage');
            const savedSettings = localStorage.getItem('timeSlotSettings');
            if (savedSettings) {
              const parsedSettings = JSON.parse(savedSettings);
              console.log('💾 Using localStorage settings:', parsedSettings);
              setTimeSlotSettings(parsedSettings);
            }
          }
        } catch (error) {
          console.error('❌ Error loading cloud data:', error);
          // Fallback to local storage
          const savedTasks = localStorage.getItem('weeklyPlannerTasks');
          const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
          console.log('💾 Error fallback: Using localStorage tasks:', parsedTasks);
          setTasks(parsedTasks);
        }
      } else {
        // Load from local storage for unauthenticated users
        console.log('👤 Not authenticated, loading from localStorage only');
        const savedTasks = localStorage.getItem('weeklyPlannerTasks');
        const savedSettings = localStorage.getItem('timeSlotSettings');
        const savedHowToUse = localStorage.getItem('showHowToUse');
        
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          console.log('💾 Using localStorage tasks (unauthenticated):', parsedTasks);
          setTasks(parsedTasks);
        } else {
          console.log('📭 No localStorage tasks, using empty array');
          setTasks([]);
        }
        
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          console.log('💾 Using localStorage settings (unauthenticated):', parsedSettings);
          setTimeSlotSettings(parsedSettings);
        }
        
        if (savedHowToUse !== null) {
          setShowHowToUse(JSON.parse(savedHowToUse));
        }
      }
    };

    loadData();
  }, [isAuthenticated, user]);

  // Save tasks to cloud or localStorage
  useEffect(() => {
    const saveData = async () => {
      // Only save if user has made changes
      if (!hasUserMadeChanges) {
        console.log('⏸️ Skipping save - no user changes detected');
        return;
      }

      if (isAuthenticated && user?.uid) {
        if (!hasLoadedFromCloud.current) {
          // Skip first save after load
          hasLoadedFromCloud.current = true;
          return;
        }
        
        try {
          await saveTasksToCloud(tasks, user.uid);
          console.log('✅ Tasks saved to Firestore successfully');
        } catch (error) {
          console.error('❌ Error saving to cloud:', error);
          // Fallback to local storage
          localStorage.setItem('weeklyPlannerTasks', JSON.stringify(tasks));
          console.log('💾 Fallback: Tasks saved to localStorage');
        }
      } else {
        localStorage.setItem('weeklyPlannerTasks', JSON.stringify(tasks));
        console.log('💾 Tasks saved to localStorage (not authenticated)');
      }
    };

    saveData();
  }, [tasks, isAuthenticated, user, hasUserMadeChanges]);

  // Save settings to cloud or localStorage
  useEffect(() => {
    const saveSettings = async () => {
      // Only save if user has made changes
      if (!hasUserMadeChanges) {
        console.log('⏸️ Skipping settings save - no user changes detected');
        return;
      }

      if (isAuthenticated && user?.uid) {
        try {
          await saveSettingsToCloud(timeSlotSettings, user.uid);
        } catch (error) {
          console.error('Error saving settings to cloud:', error);
          localStorage.setItem('timeSlotSettings', JSON.stringify(timeSlotSettings));
        }
      } else {
        localStorage.setItem('timeSlotSettings', JSON.stringify(timeSlotSettings));
      }
    };

    saveSettings();
  }, [timeSlotSettings, isAuthenticated, user, hasUserMadeChanges]);

  // Save how to use visibility state
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('showHowToUse', JSON.stringify(showHowToUse));
    }
  }, [showHowToUse, isAuthenticated]);

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTaskCreate = (newTask) => {
    const taskWithDefaults = {
      id: newTask?.id || Date.now(),
      title: newTask?.title || 'New Task',
      description: newTask?.description || '',
      day: newTask?.day || null,
      timeSlot: newTask?.timeSlot || null,
      completed: newTask?.completed || false,
      createdAt: newTask?.createdAt || new Date().toISOString()
    };
    setTasks(prev => [...prev, taskWithDefaults]);
    setHasUserMadeChanges(true); // Mark that user has made changes
    console.log('📝 User created task - changes will be saved');
  };

  const handleTaskUpdate = (taskId, updatedTask) => {
    setTasks(prev => prev?.map(task => 
      task?.id === taskId ? updatedTask : task
    ));
    setHasUserMadeChanges(true); // Mark that user has made changes
    console.log('📝 User updated task - changes will be saved');
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev?.filter(task => task?.id !== taskId));
    setHasUserMadeChanges(true); // Mark that user has made changes
    console.log('📝 User deleted task - changes will be saved');
  };

  const handleTimeSlotUpdate = (timeSlot, updates) => {
    setTimeSlotSettings(prev => ({
      ...prev,
      [timeSlot]: { ...prev?.[timeSlot], ...updates }
    }));
    setHasUserMadeChanges(true); // Mark that user has made changes
    console.log('📝 User updated settings - changes will be saved');
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, day, timeSlot) => {
    e?.preventDefault();
    setDragOverPosition({ day, timeSlot });
  };

  const handleDrop = (e, day, timeSlot) => {
    e?.preventDefault();
    
    if (draggedTask && (draggedTask?.day !== day || draggedTask?.timeSlot !== timeSlot)) {
      // Check if target slot is empty
      const existingTask = tasks?.find(task => task?.day === day && task?.timeSlot === timeSlot);
      
      if (!existingTask) {
        // Move task to new position
        const updatedTask = {
          ...draggedTask,
          day,
          timeSlot
        };
        handleTaskUpdate(draggedTask?.id, updatedTask);
      }
    }
    
    setDraggedTask(null);
    setDragOverPosition(null);
  };

  const handleClearAllTasks = () => {
    if (window.confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      setTasks([]);
      setHasUserMadeChanges(true); // Mark that user has made changes
      console.log('📝 User cleared all tasks - changes will be saved');
      // Note: The useEffect will automatically save the empty array to Firestore
      // No need to manually call saveTasksToCloud here
    }
  };


  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onHelpClick={() => setShowHowToUse(true)} />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Weekly Planner</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Organize your week with drag-and-drop task management
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <AuthButton />
              </div>
            </div>
          </div>

          {/* Firebase is used for auth and cloud sync. No configuration notice needed here. */}

          {/* Instructions */}
          {showHowToUse && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 relative">
              <button
                onClick={() => setShowHowToUse(false)}
                className="absolute top-2 right-2 p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"
              >
                <Icon name="X" size={16} className="text-blue-600 dark:text-blue-400" />
              </button>
              <div className="flex items-start pr-8">
                <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">How to use:</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Click on empty gray boxes to create new tasks</li>
                    <li>• Drag and drop tasks between different time slots</li>
                    <li>• Click on existing tasks to edit their content</li>
                    <li>• Click on time slot names to customize them</li>
                    <li>• {isAuthenticated ? 'Your tasks are saved to the cloud' : 'Sign in to sync tasks across devices'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Task Statistics */}
          <TaskStats tasks={tasks} />

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button
              variant="outline"
              onClick={handleClearAllTasks}
              iconName="Trash2"
              iconPosition="left"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear All
            </Button>
            
          </div>

          

          {/* Weekly Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {isMobile ? (
              <MobileWeeklyView
                tasks={tasks}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                draggedTask={draggedTask}
                dragOverPosition={dragOverPosition}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                timeSlotSettings={timeSlotSettings}
                onTimeSlotUpdate={handleTimeSlotUpdate}
              />
            ) : (
              <WeeklyGrid
                tasks={tasks}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                draggedTask={draggedTask}
                dragOverPosition={dragOverPosition}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                timeSlotSettings={timeSlotSettings}
                onTimeSlotUpdate={handleTimeSlotUpdate}
              />
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isAuthenticated 
                ? 'Tasks are automatically synced to your account (Firebase)'
                : 'Tasks are saved locally. Sign in to sync across devices.'}
            </p>
            {!isAuthenticated && (
              <p className="mt-1 text-xs text-gray-400">{getAppVersion()}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeeklyPlannerDashboard;