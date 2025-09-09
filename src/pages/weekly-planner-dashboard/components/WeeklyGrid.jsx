import React, { useState } from 'react';
import TimeBlock from './TimeBlock';
import Icon from '../../../components/AppIcon';
import { getCurrentWeekDate, formatPlannerDate } from '../../../utils/dateUtils';

const WeeklyGrid = ({ 
  tasks, 
  onTaskCreate, 
  onTaskUpdate, 
  onTaskDelete,
  draggedTask,
  dragOverPosition,
  onDragStart,
  onDragOver,
  onDrop,
  timeSlotSettings,
  onTimeSlotUpdate
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening'];
  
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [editingField, setEditingField] = useState(null); // 'name' or 'subtitle'
  const [editValue, setEditValue] = useState('');

  const getTaskForSlot = (day, timeSlot) => {
    return tasks?.find(task => task?.day === day && task?.timeSlot === timeSlot);
  };

  const isDragOverSlot = (day, timeSlot) => {
    return dragOverPosition?.day === day && dragOverPosition?.timeSlot === timeSlot;
  };

  const handleTimeSlotEdit = (timeSlot, field, currentValue) => {
    setEditingTimeSlot(timeSlot);
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleTimeSlotSave = () => {
    if (editValue?.trim()) {
      onTimeSlotUpdate(editingTimeSlot, {
        [editingField]: editValue?.trim()
      });
    }
    setEditingTimeSlot(null);
    setEditingField(null);
    setEditValue('');
  };

  const handleTimeSlotCancel = () => {
    setEditingTimeSlot(null);
    setEditingField(null);
    setEditValue('');
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleTimeSlotSave();
    } else if (e?.key === 'Escape') {
      handleTimeSlotCancel();
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header Row */}
        <div className="grid grid-cols-8 gap-4 mb-4">
          <div className="font-semibold text-gray-700 dark:text-gray-300 text-sm"></div>
          {days?.map(day => {
            const currentDate = getCurrentWeekDate(day);
            return (
              <div key={day} className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{day}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatPlannerDate(currentDate)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Time Slots Grid */}
        {timeSlots?.map(timeSlot => (
          <div key={timeSlot} className="grid grid-cols-8 gap-4 mb-4">
            <div className="flex flex-col items-start justify-center pr-2">
              {/* Editable Time Slot Name */}
              <div className="mb-1 w-full">
                {editingTimeSlot === timeSlot && editingField === 'name' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e?.target?.value)}
                    onBlur={handleTimeSlotSave}
                    onKeyDown={handleKeyPress}
                    className="w-full max-w-[120px] font-medium text-gray-700 dark:text-gray-300 text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5"
                    autoFocus
                    maxLength={20}
                  />
                ) : (
                  <span 
                    className="font-medium text-gray-700 dark:text-gray-300 text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group max-w-[120px] truncate"
                    onClick={() => handleTimeSlotEdit(timeSlot, 'name', timeSlotSettings?.[timeSlot]?.name)}
                  >
                    {timeSlotSettings?.[timeSlot]?.name}
                    <Icon name="Edit2" size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </span>
                )}
              </div>
              
              {/* Editable Subtitle */}
              <div className="w-full">
                {editingTimeSlot === timeSlot && editingField === 'subtitle' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e?.target?.value)}
                    onBlur={handleTimeSlotSave}
                    onKeyDown={handleKeyPress}
                    className="w-full max-w-[120px] text-xs text-gray-500 dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5"
                    autoFocus
                    maxLength={30}
                  />
                ) : (
                  <span 
                    className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-colors group flex items-center max-w-[120px] truncate"
                    onClick={() => handleTimeSlotEdit(timeSlot, 'subtitle', timeSlotSettings?.[timeSlot]?.subtitle)}
                  >
                    {timeSlotSettings?.[timeSlot]?.subtitle || 'Add subtitle...'}
                    <Icon name="Edit2" size={10} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </span>
                )}
              </div>
            </div>
            {days?.map(day => (
              <div key={`${day}-${timeSlot}`} className="group">
                <TimeBlock
                  day={day}
                  timeSlot={timeSlot}
                  task={getTaskForSlot(day, timeSlot)}
                  onTaskCreate={onTaskCreate}
                  onTaskUpdate={onTaskUpdate}
                  onTaskDelete={onTaskDelete}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  isDragOver={isDragOverSlot(day, timeSlot)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyGrid;