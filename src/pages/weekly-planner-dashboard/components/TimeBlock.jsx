import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import TaskModal from './TaskModal';

const TimeBlock = ({ 
  day, 
  timeSlot, 
  task, 
  onTaskCreate, 
  onTaskUpdate, 
  onTaskDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver 
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleCreateTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'New Task',
      description: '',
      day,
      timeSlot,
      completed: false,
      createdAt: new Date()?.toISOString()
    };
    onTaskCreate(newTask);
    setShowModal(true);
  };

  const handleTaskClick = () => {
    setShowModal(true);
  };

  const handleModalSave = (updatedTask) => {
    onTaskUpdate(task?.id, updatedTask);
    setShowModal(false);
  };

  const handleModalDelete = () => {
    onTaskDelete(task?.id);
    setShowModal(false);
  };

  const handleDragStart = (e) => {
    // Create a small, clean drag image instead of the default ghost image
    const dragImage = document.createElement('div');
    dragImage.style.cssText = `
      position: fixed;
      top: -100px;
      left: -100px;
      width: 200px;
      height: 60px;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    dragImage.textContent = task?.title || 'Task';
    document.body?.appendChild(dragImage);
    
    // Set the custom drag image
    e?.dataTransfer?.setDragImage(dragImage, 100, 30);
    
    // Clean up the temporary element after drag starts
    setTimeout(() => {
      if (document.body?.contains(dragImage)) {
        document.body?.removeChild(dragImage);
      }
    }, 0);
    
    onDragStart(e, task);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    onDragOver(e, day, timeSlot);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    onDrop(e, day, timeSlot);
  };

  if (!task) {
    // Empty time block
    return (
      <div
        className={`h-20 bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 ${
          isDragOver ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
        }`}
        onClick={handleCreateTask}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Icon 
          name="Plus" 
          size={20} 
          color="#D3D3D3" 
          className="transition-colors duration-200 hover:text-gray-400 dark:text-gray-500 dark:hover:text-gray-300"
        />
      </div>
    );
  }

  // Occupied time block - show green if completed
  return (
    <>
      <div
        className={`relative h-20 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
          task?.completed 
            ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30' :'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
        } ${isDragOver ? 'ring-2 ring-blue-300 dark:ring-blue-600' : ''}`}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleTaskClick}
      >
        <div className="p-3 h-full flex items-center justify-center">
          <p className={`text-sm font-medium text-center line-clamp-3 leading-tight ${
            task?.completed ? 'text-green-800 dark:text-green-200' : 'text-gray-900 dark:text-white'
          }`}>
            {task?.title}
          </p>
          {task?.completed && (
            <div className="absolute top-2 right-2">
              <Icon name="Check" size={14} className="text-green-600 dark:text-green-400" />
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={task}
          onSave={handleModalSave}
          onDelete={handleModalDelete}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default TimeBlock;