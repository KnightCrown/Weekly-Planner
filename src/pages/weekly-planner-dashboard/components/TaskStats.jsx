import React from 'react';
import Icon from '../../../components/AppIcon';

const TaskStats = ({ tasks }) => {
  const totalTasks = tasks?.length;
  const completedTasks = tasks?.filter(task => task?.completed)?.length;
  const todayTasks = tasks?.filter(task => {
    const today = new Date()?.toLocaleDateString('en-US', { weekday: 'long' });
    return task?.day === today;
  })?.length;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: 'Calendar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Today\'s Tasks',
      value: todayTasks,
      icon: 'Clock',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Completion Rate',
      value: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%',
      icon: 'TrendingUp',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats?.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat?.bgColor} mr-3`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat?.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat?.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;