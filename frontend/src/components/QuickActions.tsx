import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: '💸',
      label: 'Send',
      path: '/send',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: '💰',
      label: 'Request',
      path: '/request',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: '🔄',
      label: 'Convert',
      path: '/convert',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: '📊',
      label: 'History',
      path: '/history',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => (
        <button
          key={action.path}
          onClick={() => navigate(action.path)}
          className={`${action.color} rounded-xl p-6 flex flex-col items-center gap-3 hover:scale-105 transition-transform`}
        >
          <span className="text-4xl">{action.icon}</span>
          <span className="font-semibold">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
