import React, { useState, useEffect, useRef } from 'react';

interface SpendingData {
  month: string;
  amount: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const Analytics: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pieCanvasRef = useRef<HTMLCanvasElement>(null);

  const [monthlySpending] = useState<SpendingData[]>([
    { month: 'Jun', amount: 450 },
    { month: 'Jul', amount: 520 },
    { month: 'Aug', amount: 380 },
    { month: 'Sep', amount: 680 },
    { month: 'Oct', amount: 590 },
    { month: 'Nov', amount: 720 },
  ]);

  const [categoryData] = useState<CategoryData[]>([
    { category: 'Food & Dining', amount: 280, percentage: 35, color: '#0EA5E9' },
    { category: 'Transport', amount: 180, percentage: 22, color: '#8B5CF6' },
    { category: 'Entertainment', amount: 140, percentage: 18, color: '#10B981' },
    { category: 'Shopping', amount: 120, percentage: 15, color: '#F59E0B' },
    { category: 'Bills', amount: 80, percentage: 10, color: '#EF4444' },
  ]);

  // Draw bar chart
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / monthlySpending.length - 10;
    const maxAmount = Math.max(...monthlySpending.map(d => d.amount));

    // Draw bars
    monthlySpending.forEach((data, index) => {
      const barHeight = (data.amount / maxAmount) * chartHeight;
      const x = padding + index * (barWidth + 10);
      const y = canvas.height - padding - barHeight;

      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, '#0EA5E9');
      gradient.addColorStop(1, '#3B82F6');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw month label
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(data.month, x + barWidth / 2, canvas.height - 15);

      // Draw amount
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 12px Inter';
      ctx.fillText(`$${data.amount}`, x + barWidth / 2, y - 5);
    });
  }, [monthlySpending]);

  // Draw pie chart
  useEffect(() => {
    if (!pieCanvasRef.current) return;
    
    const canvas = pieCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    let currentAngle = -Math.PI / 2;

    categoryData.forEach(data => {
      const sliceAngle = (data.percentage / 100) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = data.color;
      ctx.fill();

      currentAngle += sliceAngle;
    });
  }, [categoryData]);

  const currentMonthSpending = monthlySpending[monthlySpending.length - 1].amount;
  const previousMonthSpending = monthlySpending[monthlySpending.length - 2].amount;
  const trend = ((currentMonthSpending - previousMonthSpending) / previousMonthSpending * 100).toFixed(1);
  const trendUp = currentMonthSpending > previousMonthSpending;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics & Insights</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Track your spending patterns and financial health</p>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Spending</p>
              <span className={`text-sm font-medium ${trendUp ? 'text-red-600' : 'text-green-600'}`}>
                {trendUp ? '↑' : '↓'} {Math.abs(parseFloat(trend))}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${currentMonthSpending}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Transaction</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$45.20</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">16</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Largest Transaction</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$120</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends</h2>
            <canvas ref={canvasRef} width={500} height={300} className="w-full"></canvas>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h2>
            <div className="flex items-center justify-center">
              <canvas ref={pieCanvasRef} width={250} height={250}></canvas>
            </div>
            <div className="mt-4 space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{cat.category}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">${cat.amount} ({cat.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Spending Categories</h2>
          <div className="space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.category}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">${cat.amount}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 rounded-xl shadow-sm text-white">
          <h2 className="text-xl font-semibold mb-4">💡 Financial Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="font-medium mb-1">Spending Pattern</p>
              <p className="text-sm opacity-90">Your biggest expense this month is Food & Dining ($280)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="font-medium mb-1">Budget Recommendation</p>
              <p className="text-sm opacity-90">Consider setting a $300 monthly budget for dining</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="font-medium mb-1">Savings Opportunity</p>
              <p className="text-sm opacity-90">You could save $50/month by reducing entertainment expenses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="font-medium mb-1">Peak Spending Time</p>
              <p className="text-sm opacity-90">Most transactions occur on weekends (Friday-Sunday)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
