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
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Today\'s Tasks',
      value: todayTasks,
      icon: 'Clock',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Completion Rate',
      value: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%',
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats?.map((stat, index) => (
        <div key={index} className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat?.bgColor} mr-3`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat?.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;