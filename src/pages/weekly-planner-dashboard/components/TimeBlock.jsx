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
        className={`h-20 bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-muted/80 hover:border-border/80 ${
          isDragOver ? 'bg-primary/10 border-primary' : ''
        }`}
        onClick={handleCreateTask}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Icon 
          name="Plus" 
          size={20} 
          className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
        />
      </div>
    );
  }

  // Occupied time block - show green if completed
  return (
    <>
      <div
        className={`relative h-20 border border-border rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
          task?.completed 
            ? 'bg-success border-success hover:bg-success/90' :'bg-card hover:bg-muted'
        } ${isDragOver ? 'ring-2 ring-primary' : ''}`}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleTaskClick}
      >
        <div className="p-3 h-full flex items-center justify-center">
          <p className={`text-sm font-medium text-center line-clamp-3 leading-tight ${
            task?.completed ? 'text-success-foreground' : 'text-foreground'
          }`}>
            {task?.title}
          </p>
          {task?.completed && (
            <div className="absolute top-2 right-2">
              <Icon name="Check" size={14} className="text-success-foreground" />
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