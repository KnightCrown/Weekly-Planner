import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const TaskModal = ({ task, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    completed: task?.completed || false
  });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (formData?.title?.trim()) {
      onSave({
        ...task,
        title: formData?.title?.trim(),
        description: formData?.description?.trim(),
        completed: formData?.completed
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <Input
              type="text"
              value={formData?.title}
              onChange={(e) => handleChange('title', e?.target?.value)}
              placeholder="Enter task title"
              maxLength={100}
              required
              autoFocus
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) => handleChange('description', e?.target?.value)}
              placeholder="Enter task description (optional)"
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Completed Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={formData?.completed}
              onChange={(checked) => handleChange('completed', checked)}
            />
            <label htmlFor="completed" className="text-sm font-medium text-gray-700 cursor-pointer">
              Mark as completed
            </label>
          </div>

          {/* Task Info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <p>Day: {task?.day}</p>
            <p>Time Slot: {task?.timeSlot}</p>
            <p>Created: {new Date(task?.createdAt)?.toLocaleString()}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onDelete}
              iconName="Trash2"
              iconPosition="left"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Delete
            </Button>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData?.title?.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;