import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingDown,
  TrendingUp,
  Target,
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import useStore from '../../store/useStore';

export default function Weight() {
  const {
    weightRecords,
    targetWeight,
    addWeightRecord,
    getCurrentWeight,
    getWeightLost,
  } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [viewRange, setViewRange] = useState('week');

  const currentWeight = getCurrentWeight();
  const weightLost = getWeightLost();
  const initialWeight = weightRecords[0]?.weight || currentWeight;
  const progress = initialWeight - targetWeight;
  const achievedProgress = initialWeight - currentWeight;
  const progressPercent = Math.min((achievedProgress / progress) * 100, 100);

  const bmi = currentWeight && currentWeight > 0
    ? (currentWeight / ((1.7) * (1.7))).toFixed(1)
    : '--';

  const getBmiStatus = () => {
    const bmiVal = parseFloat(bmi);
    if (isNaN(bmiVal)) return { text: '暂无数据', color: 'text-gray-400' };
    if (bmiVal < 18.5) return { text: '偏瘦', color: 'text-yellow-500' };
    if (bmiVal < 24) return { text: '正常', color: 'text-green-500' };
    if (bmiVal < 28) return { text: '偏重', color: 'text-orange-500' };
    return { text: '肥胖', color: 'text-red-500' };
  };

  const chartData = weightRecords
    .slice(-7)
    .map((r) => ({
      date: r.date.slice(5),
      weight: r.weight,
      fullDate: r.date,
    }));

  const handleAddWeight = () => {
    if (newWeight && parseFloat(newWeight) > 0) {
      addWeightRecord(parseFloat(newWeight));
      setNewWeight('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-500 to-primary-400 text-white px-5 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-bold">体重追踪</h1>

        {/* Current Weight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white/15 backdrop-blur-sm rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">当前体重</p>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-5xl font-bold font-mono">
                  {currentWeight || '--'}
                </span>
                <span className="text-primary-100 mb-2">kg</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-100 text-sm">BMI</p>
              <p className="text-2xl font-bold mt-1">
                {bmi}
                <span className={`text-sm ml-1 ${getBmiStatus().color}`}>
                  {getBmiStatus().text}
                </span>
              </p>
            </div>
          </div>

          {/* Target Progress */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-primary-100">目标 {targetWeight}kg</span>
              <span className={weightLost > 0 ? 'text-white' : 'text-primary-200'}>
                已减 {weightLost.toFixed(1)}kg
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </header>

      {/* Stats Cards */}
      <div className="px-5 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-card"
          >
            <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center mb-2">
              {weightLost > 0 ? (
                <TrendingDown className="text-accent-500" size={20} />
              ) : (
                <TrendingUp className="text-blue-500" size={20} />
              )}
            </div>
            <p className="text-xs text-gray-400">累计变化</p>
            <p className={`text-xl font-bold ${weightLost > 0 ? 'text-accent-500' : 'text-blue-500'}`}>
              {weightLost > 0 ? '-' : '+'}{Math.abs(weightLost).toFixed(1)}kg
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-card"
          >
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-2">
              <Target className="text-primary-500" size={20} />
            </div>
            <p className="text-xs text-gray-400">距目标</p>
            <p className="text-xl font-bold text-primary-500">
              {currentWeight > 0 ? (currentWeight - targetWeight).toFixed(1) : '--'}kg
            </p>
          </motion.div>
        </div>
      </div>

      {/* Weight Chart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 mt-6"
      >
        <div className="bg-white rounded-2xl shadow-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">体重趋势</h2>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['周', '月', '年'].map((range) => (
                <button
                  key={range}
                  onClick={() => setViewRange(range.toLowerCase())}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    viewRange === range.toLowerCase()
                      ? 'bg-white shadow-sm text-gray-800'
                      : 'text-gray-500'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
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
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A2E',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                  }}
                  formatter={(value) => [`${value}kg`, '体重']}
                />
                <ReferenceLine
                  y={targetWeight}
                  stroke="#4ECDC4"
                  strokeDasharray="5 5"
                  label={{
                    value: '目标',
                    position: 'right',
                    fill: '#4ECDC4',
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#FF6B6B"
                  strokeWidth={3}
                  dot={{ fill: '#FF6B6B', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#FF6B6B' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>

      {/* Records List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-5 mt-6 mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">记录历史</h2>
          <button className="text-primary-500 text-sm">查看全部</button>
        </div>

        <div className="bg-white rounded-2xl shadow-card divide-y divide-gray-50">
          {weightRecords
            .slice()
            .reverse()
            .slice(0, 5)
            .map((record, index) => (
              <div
                key={record.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {record.fullDate?.slice(5) || record.date.slice(5)}
                    </p>
                    {record.note && (
                      <p className="text-xs text-gray-400">{record.note}</p>
                    )}
                  </div>
                </div>
                <p className="text-lg font-bold font-mono text-gray-800">
                  {record.weight}kg
                </p>
              </div>
            ))}
        </div>
      </motion.section>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full shadow-gradient flex items-center justify-center hover:shadow-lg transition-all"
      >
        <Plus size={24} className="text-white" />
      </button>

      {/* Add Weight Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-sm rounded-3xl p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">记录今日体重</h3>
            <div className="relative">
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="输入体重"
                className="w-full px-6 py-4 text-3xl font-bold text-center bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:outline-none"
                step="0.1"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                kg
              </span>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
              >
                取消
              </button>
              <button
                onClick={handleAddWeight}
                className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-medium"
              >
                确认
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
