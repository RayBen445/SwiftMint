import { Link } from 'react-router-dom';

export default function QuickActions() {
  const actions = [
    {
      title: 'Send Money',
      description: 'Transfer to anyone, anywhere',
      icon: '💸',
      link: '/send',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    },
    {
      title: 'Request Money',
      description: 'Request payment from others',
      icon: '💰',
      link: '/request',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
    },
    {
      title: 'Convert Currency',
      description: 'Exchange at best rates',
      icon: '🔄',
      link: '/convert',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    },
    {
      title: 'View History',
      description: 'Track all transactions',
      icon: '📊',
      link: '/transactions',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link
          key={action.title}
          to={action.link}
          className={`${action.color} border-2 rounded-xl p-6 transition-all hover:shadow-md`}
        >
          <div className="text-4xl mb-3">{action.icon}</div>
          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
          <p className="text-sm text-gray-600">{action.description}</p>
        </Link>
      ))}
    </div>
  );
}
