import { motion } from 'framer-motion';
import {
  User,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Heart,
  Star,
  Calendar,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

export default function Profile() {
  const navigate = useNavigate();
  const {
    user,
    isLoggedIn,
    logout,
    weightRecords,
    targetWeight,
    getConsecutiveDays,
    getWeightLost,
    favoriteFoods,
    favoriteRecipes,
    userAchievements,
  } = useStore();

  const currentWeight = weightRecords[weightRecords.length - 1]?.weight || 0;
  const consecutiveDays = getConsecutiveDays();
  const weightLost = getWeightLost();
  const unlockedAchievements = userAchievements.filter((a) => a.unlocked).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: '个人资料', path: '/profile' },
    { icon: Heart, label: '我的收藏', path: '/profile' },
    { icon: Star, label: '我的成就', path: '/community' },
    { icon: Calendar, label: '打卡记录', path: '/checkin' },
    { icon: Bell, label: '消息通知', path: '/profile' },
    { icon: HelpCircle, label: '帮助中心', path: '/profile' },
    { icon: Settings, label: '设置', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-500 to-primary-400 text-white px-5 pt-12 pb-8 rounded-b-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <User size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {user?.nickname || '健康达人'}
            </h1>
            <p className="text-primary-100 text-sm mt-1">
              欢迎使用体重管理
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 grid grid-cols-3 gap-3"
        >
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{consecutiveDays}</p>
            <p className="text-xs text-primary-100">连续天数</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{weightLost.toFixed(1)}</p>
            <p className="text-xs text-primary-100">已减kg</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{unlockedAchievements}</p>
            <p className="text-xs text-primary-100">成就数</p>
          </div>
        </motion.div>
      </header>

      {/* Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-5 -mt-4"
      >
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">目标进度</h2>
            <Link to="/weight" className="text-primary-500 text-sm">
              查看详情
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="8"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#4ECDC4"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min(
                    ((currentWeight - targetWeight) / (currentWeight || 1)) * 100 * 2.51,
                    251
                  )} 251`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-800">
                  {currentWeight || '--'}
                </span>
                <span className="text-xs text-gray-400">kg</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">当前体重</span>
                  <span className="font-medium text-gray-800">{currentWeight || '--'}kg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">目标体重</span>
                  <span className="font-medium text-gray-800">{targetWeight}kg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">还需减</span>
                  <span className="font-medium text-accent-500">
                    {currentWeight > 0 ? (currentWeight - targetWeight).toFixed(1) : '--'}kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Favorites */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 mt-6"
      >
        <div className="bg-white rounded-2xl shadow-card p-4">
          <h2 className="font-semibold text-gray-800 mb-3">我的收藏</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <Heart size={20} className="text-primary-500" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{favoriteFoods.length}</p>
                <p className="text-xs text-gray-400">收藏食物</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center">
                <Star size={20} className="text-accent-500" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{favoriteRecipes.length}</p>
                <p className="text-xs text-gray-400">收藏菜谱</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-5 mt-6"
      >
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="text-gray-400" />
                <span className="text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Logout */}
      {isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-5 mt-6"
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white rounded-2xl shadow-card text-gray-500 hover:text-accent-500 transition-colors"
          >
            <LogOut size={20} />
            退出登录
          </button>
        </motion.div>
      )}

      {/* Login Prompt */}
      {!isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-5 mt-6"
        >
          <Link
            to="/login"
            className="block w-full py-4 bg-gradient-to-r from-primary-500 to-primary-400 rounded-2xl text-white font-semibold text-center shadow-gradient"
          >
            登录 / 注册
          </Link>
        </motion.div>
      )}
    </div>
  );
}
