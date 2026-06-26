import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ChevronRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 模拟网络延迟
    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-5 pt-12">
        <h1 className="text-3xl font-bold text-gray-800">欢迎回来</h1>
        <p className="text-gray-400 mt-2">登录您的账户开始健康管理</p>
      </header>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600"
        >
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="flex-1 px-5 mt-6">
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              邮箱
            </label>
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              密码
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button type="button" className="text-sm text-primary-500">
              忘记密码？
            </button>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-2xl font-semibold shadow-gradient hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                登录
                <ChevronRight size={20} />
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Register Link */}
      <div className="px-5 pb-8">
        <p className="text-center text-gray-500">
          还没有账户？{' '}
          <Link to="/register" className="text-primary-500 font-medium">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
}
