import { motion } from 'framer-motion';
import {
  TrendingDown,
  Target,
  Flame,
  ChevronRight,
  Plus,
  Calendar,
  Star,
  ArrowUpRight,
  Scale,
  UtensilsCrossed,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const dailyCalories = 1800;
const dailyProtein = 120;
const dailyFat = 50;
const dailyCarbs = 200;

export default function Home() {
  const {
    user,
    isLoggedIn,
    weightRecords,
    targetWeight,
    todayCalories,
    todayProtein,
    todayFat,
    todayCarbs,
    userAchievements,
    getConsecutiveDays,
    getCurrentWeight,
    getWeightLost,
    favoriteRecipes,
  } = useStore();

  const currentWeight = getCurrentWeight();
  const weightLost = getWeightLost();
  const consecutiveDays = getConsecutiveDays();

  const progressCalories = Math.min((todayCalories / dailyCalories) * 100, 100);
  const progressProtein = Math.min((todayProtein / dailyProtein) * 100, 100);
  const progressFat = Math.min((todayFat / dailyFat) * 100, 100);
  const progressCarbs = Math.min((todayCarbs / dailyCarbs) * 100, 100);

  const chartData = weightRecords.slice(-7).map((r) => ({
    date: r.date.slice(5),
    weight: r.weight,
  }));

  const unlockedAchievements = userAchievements.filter((a) => a.unlocked);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-500 to-primary-400 text-white px-5 pt-12 pb-8 rounded-b-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-primary-100 text-sm">
              {new Date().toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
            <h1 className="text-2xl font-bold mt-1">
              {user ? `你好，${user.nickname}` : '欢迎使用体重管理'}
            </h1>
          </div>
          <Link
            to="/checkin"
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full"
          >
            <Plus size={24} />
          </Link>
        </motion.div>

        {/* Today's Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 grid grid-cols-2 gap-3"
        >
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 text-primary-100 text-xs mb-1">
              <Flame size={14} />
              今日摄入
            </div>
            <p className="text-2xl font-bold font-mono">
              {Math.round(todayCalories)}
              <span className="text-sm font-normal ml-1">kcal</span>
            </p>
            <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressCalories}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 text-primary-100 text-xs mb-1">
              <Scale size={14} />
              当前体重
            </div>
            <p className="text-2xl font-bold font-mono">
              {currentWeight || '--'}
              <span className="text-sm font-normal ml-1">kg</span>
            </p>
            <p className="mt-2 text-xs text-primary-100">
              目标 {targetWeight}kg
            </p>
          </div>
        </motion.div>
      </header>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-5 -mt-4"
      >
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Calendar, label: '打卡', path: '/checkin', color: 'bg-primary-50 text-primary-500' },
              { icon: Target, label: '体重', path: '/weight', color: 'bg-accent-50 text-accent-500' },
              { icon: UtensilsCrossed, label: '食物', path: '/foods', color: 'bg-blue-50 text-blue-500' },
              { icon: BookOpen, label: '菜谱', path: '/recipes', color: 'bg-purple-50 text-purple-500' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex flex-col items-center"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-1`}>
                  <item.icon size={22} />
                </div>
                <span className="text-xs text-gray-600">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Weight Trend */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 mt-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">体重趋势</h2>
          <Link to="/weight" className="text-primary-500 text-sm flex items-center">
            查看详情 <ChevronRight size={16} />
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400">近7天变化</p>
              <p className="text-xl font-bold text-accent-500 flex items-center gap-1">
                <TrendingDown size={18} />
                {weightLost > 0 ? `${weightLost.toFixed(1)}kg` : '0kg'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">目标进度</p>
              <p className="text-xl font-bold font-mono">
                {currentWeight ? Math.round(((currentWeight - targetWeight) / (currentWeight || 1)) * 100) : 0}%
              </p>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  width={35}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#4ECDC4"
                  strokeWidth={2}
                  fill="url(#colorWeight)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>

      {/* Today's Nutrition */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-5 mt-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">今日营养</h2>
          <Link to="/checkin" className="text-primary-500 text-sm flex items-center">
            去记录 <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '蛋白质', value: todayProtein, max: dailyProtein, unit: 'g', color: 'text-blue-500' },
            { label: '脂肪', value: todayFat, max: dailyFat, unit: 'g', color: 'text-yellow-500' },
            { label: '碳水', value: todayCarbs, max: dailyCarbs, unit: 'g', color: 'text-orange-500' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl shadow-card p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className={`text-lg font-bold font-mono ${item.color}`}>
                {Math.round(item.value)}
                <span className="text-xs font-normal text-gray-400">/{item.max}{item.unit}</span>
              </p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color.replace('text-', 'bg-')} rounded-full`}
                  style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Achievements */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-5 mt-6 mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">我的成就</h2>
          <Link to="/community" className="text-primary-500 text-sm flex items-center">
            查看全部 <ChevronRight size={16} />
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-primary-400 to-primary-500 w-14 h-14 rounded-2xl flex items-center justify-center">
              <Flame className="text-white" size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-400">连续打卡</p>
              <p className="text-2xl font-bold text-gray-800">
                {consecutiveDays}
                <span className="text-sm font-normal text-gray-400 ml-1">天</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {userAchievements.slice(0, 6).map((achievement) => (
              <div
                key={achievement.id}
                className={`flex-shrink-0 w-16 text-center ${
                  achievement.unlocked ? '' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-accent-400 to-accent-500'
                      : 'bg-gray-100'
                  }`}
                >
                  <Star
                    size={20}
                    className={achievement.unlocked ? 'text-white' : 'text-gray-300'}
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1 truncate">
                  {achievement.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
