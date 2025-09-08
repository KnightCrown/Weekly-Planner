import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import TimeBlock from './TimeBlock';
import { getCurrentWeekDate, formatPlannerDate } from '../../../utils/dateUtils';

const MobileWeeklyView = ({ 
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
  
  const [selectedDay, setSelectedDay] = useState(days?.[0]);
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [editingField, setEditingField] = useState(null);
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
    <div className="w-full">
      {/* Day Selector */}
      <div className="mb-6">
        <div className="flex overflow-x-auto pb-2">
          {days?.map(day => {
            const currentDate = getCurrentWeekDate(day);
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-4 py-2 mx-1 rounded-lg text-sm font-medium transition-all ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-center">
                  <p>{day}</p>
                  <p className="text-xs opacity-75">
                    {formatPlannerDate(currentDate)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Time Slots for Selected Day */}
      <div className="space-y-4">
        {timeSlots?.map(timeSlot => (
          <div key={timeSlot} className="bg-gray-50 rounded-lg p-4">
            {/* Time Slot Header with Editable Name and Subtitle */}
            <div className="mb-3">
              <div className="mb-1">
                {editingTimeSlot === timeSlot && editingField === 'name' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e?.target?.value)}
                    onBlur={handleTimeSlotSave}
                    onKeyDown={handleKeyPress}
                    className="w-full max-w-[200px] font-semibold text-gray-900 text-lg bg-transparent border border-gray-300 rounded px-1 py-0.5"
                    autoFocus
                    maxLength={20}
                  />
                ) : (
                  <h3 
                    className="font-semibold text-gray-900 text-lg cursor-pointer hover:text-blue-600 transition-colors flex items-center group"
                    onClick={() => handleTimeSlotEdit(timeSlot, 'name', timeSlotSettings?.[timeSlot]?.name)}
                  >
                    {timeSlotSettings?.[timeSlot]?.name}
                    <Icon name="Edit2" size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                )}
              </div>
              
              <div>
                {editingTimeSlot === timeSlot && editingField === 'subtitle' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e?.target?.value)}
                    onBlur={handleTimeSlotSave}
                    onKeyDown={handleKeyPress}
                    className="w-full max-w-[250px] text-sm text-gray-500 bg-transparent border border-gray-300 rounded px-1 py-0.5"
                    autoFocus
                    maxLength={30}
                  />
                ) : (
                  <p 
                    className="text-sm text-gray-500 cursor-pointer hover:text-blue-500 transition-colors group flex items-center"
                    onClick={() => handleTimeSlotEdit(timeSlot, 'subtitle', timeSlotSettings?.[timeSlot]?.subtitle)}
                  >
                    {timeSlotSettings?.[timeSlot]?.subtitle || 'Add subtitle...'}
                    <Icon name="Edit2" size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                )}
              </div>
            </div>
            
            <TimeBlock
              day={selectedDay}
              timeSlot={timeSlot}
              task={getTaskForSlot(selectedDay, timeSlot)}
              onTaskCreate={onTaskCreate}
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              isDragOver={isDragOverSlot(selectedDay, timeSlot)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileWeeklyView;