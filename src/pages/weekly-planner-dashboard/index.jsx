import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import WeeklyGrid from './components/WeeklyGrid';
import MobileWeeklyView from './components/MobileWeeklyView';
import TaskStats from './components/TaskStats';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import AuthButton from '../../components/ui/AuthButton';

import { useAuth } from '../../hooks/useAuth';
import { saveTasksToCloud, loadTasksFromCloud, saveSettingsToCloud, loadSettingsFromCloud, supabase } from '../../lib/supabase';
 

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

  // Mock initial tasks with expanded structure
  const mockTasks = [
    {
      id: 1,
      title: "Team Meeting",
      description: "Weekly team sync and project updates",
      day: "Monday",
      timeSlot: "Morning",
      completed: false,
      createdAt: "2025-09-08T09:00:00.000Z"
    },
    {
      id: 2,
      title: "Project Review",
      description: "Review current project status and next steps",
      day: "Tuesday",
      timeSlot: "Afternoon",
      completed: false,
      createdAt: "2025-09-08T14:00:00.000Z"
    },
    {
      id: 3,
      title: "Client Call",
      description: "Discuss requirements with the client",
      day: "Wednesday",
      timeSlot: "Morning",
      completed: true,
      createdAt: "2025-09-08T10:30:00.000Z"
    },
    {
      id: 4,
      title: "Code Review",
      description: "Review pull requests and provide feedback",
      day: "Thursday",
      timeSlot: "Afternoon",
      completed: false,
      createdAt: "2025-09-08T15:00:00.000Z"
    },
    {
      id: 5,
      title: "Weekend Planning",
      description: "Plan activities for the weekend",
      day: "Friday",
      timeSlot: "Evening",
      completed: false,
      createdAt: "2025-09-08T17:00:00.000Z"
    }
  ];

  // Load tasks and settings on component mount and auth change
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && user && supabase) {
        try {
          // Load from cloud
          const cloudTasks = await loadTasksFromCloud(user?.id);
          const cloudSettings = await loadSettingsFromCloud(user?.id);
          
          if (cloudTasks?.length > 0) {
            setTasks(cloudTasks);
          } else {
            // If no cloud data, use local storage or mock data
            const savedTasks = localStorage.getItem('weeklyPlannerTasks');
            setTasks(savedTasks ? JSON.parse(savedTasks) : mockTasks);
          }

          if (cloudSettings) {
            setTimeSlotSettings(cloudSettings);
          } else {
            // Use local settings if no cloud data
            const savedSettings = localStorage.getItem('timeSlotSettings');
            if (savedSettings) {
              setTimeSlotSettings(JSON.parse(savedSettings));
            }
          }
        } catch (error) {
          console.error('Error loading cloud data:', error);
          // Fallback to local storage
          const savedTasks = localStorage.getItem('weeklyPlannerTasks');
          setTasks(savedTasks ? JSON.parse(savedTasks) : mockTasks);
        }
      } else {
        // Load from local storage for unauthenticated users or when Supabase is not configured
        const savedTasks = localStorage.getItem('weeklyPlannerTasks');
        const savedSettings = localStorage.getItem('timeSlotSettings');
        const savedHowToUse = localStorage.getItem('showHowToUse');
        
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        } else {
          setTasks(mockTasks);
        }
        
        if (savedSettings) {
          setTimeSlotSettings(JSON.parse(savedSettings));
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
      if (tasks?.length > 0) {
        if (isAuthenticated && user && supabase) {
          try {
            await saveTasksToCloud(tasks, user?.id);
          } catch (error) {
            console.error('Error saving to cloud:', error);
            // Fallback to local storage
            localStorage.setItem('weeklyPlannerTasks', JSON.stringify(tasks));
          }
        } else {
          localStorage.setItem('weeklyPlannerTasks', JSON.stringify(tasks));
        }
      }
    };

    saveData();
  }, [tasks, isAuthenticated, user]);

  // Save settings to cloud or localStorage
  useEffect(() => {
    const saveSettings = async () => {
      if (isAuthenticated && user && supabase) {
        try {
          await saveSettingsToCloud(timeSlotSettings, user?.id);
        } catch (error) {
          console.error('Error saving settings to cloud:', error);
          localStorage.setItem('timeSlotSettings', JSON.stringify(timeSlotSettings));
        }
      } else {
        localStorage.setItem('timeSlotSettings', JSON.stringify(timeSlotSettings));
      }
    };

    saveSettings();
  }, [timeSlotSettings, isAuthenticated, user]);

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
      ...newTask,
      title: newTask?.title || 'New Task',
      description: newTask?.description || '',
      completed: newTask?.completed || false
    };
    setTasks(prev => [...prev, taskWithDefaults]);
  };

  const handleTaskUpdate = (taskId, updatedTask) => {
    setTasks(prev => prev?.map(task => 
      task?.id === taskId ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev?.filter(task => task?.id !== taskId));
  };

  const handleTimeSlotUpdate = (timeSlot, updates) => {
    setTimeSlotSettings(prev => ({
      ...prev,
      [timeSlot]: { ...prev?.[timeSlot], ...updates }
    }));
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
      if (isAuthenticated && user) {
        saveTasksToCloud([], user?.id);
      } else {
        localStorage.removeItem('weeklyPlannerTasks');
      }
    }
  };

  const handleLoadSampleData = () => {
    setTasks(mockTasks);
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onHelpClick={() => setShowHowToUse(true)} />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Planner</h1>
                <p className="text-gray-600">
                  Organize your week with drag-and-drop task management
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <AuthButton />
              </div>
            </div>
          </div>

          {/* Supabase Configuration Notice */}
          {!supabase && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Icon name="AlertTriangle" size={20} className="text-amber-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-900 mb-1">Supabase Configuration Required</h3>
                  <p className="text-sm text-amber-800 mb-2">
                    To enable Google sign-in and cloud sync, please configure your Supabase credentials.
                  </p>
                  <ol className="text-sm text-amber-800 space-y-1 ml-4">
                    <li>1. Create a <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase project</a></li>
                    <li>2. Copy <code className="bg-amber-100 px-1 rounded">env.template</code> to <code className="bg-amber-100 px-1 rounded">.env.local</code></li>
                    <li>3. Add your Supabase URL and API key to <code className="bg-amber-100 px-1 rounded">.env.local</code></li>
                    <li>4. Enable Google OAuth in Supabase Dashboard (Authentication → Providers → Google)</li>
                    <li>5. Set up Google OAuth credentials (see README.md for details)</li>
                    <li>6. Restart the development server</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {showHowToUse && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
              <button
                onClick={() => setShowHowToUse(false)}
                className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
              >
                <Icon name="X" size={16} className="text-blue-600" />
              </button>
              <div className="flex items-start pr-8">
                <Icon name="Info" size={20} className="text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">How to use:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Click on empty gray boxes to create new tasks</li>
                    <li>• Drag and drop tasks between different time slots</li>
                    <li>• Click on existing tasks to edit their content</li>
                    <li>• Click on time slot names to customize them</li>
                    <li>• {!supabase ? 'Configure Supabase to enable cloud sync' : isAuthenticated ? 'Your tasks are saved to the cloud' : 'Sign in to sync tasks across devices'}</li>
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
              onClick={handleLoadSampleData}
              iconName="RefreshCw"
              iconPosition="left"
              size="sm"
            >
              Load Sample
            </Button>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
            <p className="text-sm text-gray-500">
              {!supabase 
                ? 'Tasks are saved locally. Configure Supabase to enable cloud sync.'
                : isAuthenticated 
                  ? 'Tasks are automatically synced to your Google account' 
                  : 'Tasks are saved locally. Sign in to sync across devices.'
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeeklyPlannerDashboard;