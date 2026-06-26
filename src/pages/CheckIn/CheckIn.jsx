import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Cloud,
  Moon,
  Cookie,
  Plus,
  Minus,
  Search,
  Camera,
  Check,
  X,
} from 'lucide-react';
import useStore from '../../store/useStore';

const mealIcons = {
  breakfast: Sun,
  lunch: Cloud,
  dinner: Moon,
  snack: Cookie,
};

const mealLabels = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

export default function CheckIn() {
  const {
    foods,
    getTodayMeals,
    todayCalories,
    todayProtein,
    todayFat,
    todayCarbs,
    addFoodToMeal,
  } = useStore();

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showAddFood, setShowAddFood] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState(100);
  const [showSuccess, setShowSuccess] = useState(false);

  const todayMeals = getTodayMeals();

  const getMealCalories = (mealType) => {
    return todayMeals[mealType]?.reduce((sum, food) => {
      return sum + (food.calories * food.amount) / 100;
    }, 0) || 0;
  };

  const handleAddFood = () => {
    if (selectedFood && selectedMeal) {
      addFoodToMeal(selectedMeal, selectedFood, amount);
      setShowAddFood(false);
      setSelectedFood(null);
      setAmount(100);
      setSearchQuery('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCalories = todayCalories;
  const totalProtein = todayProtein;
  const totalFat = todayFat;
  const totalCarbs = todayCarbs;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">饮食打卡</h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Today's Summary */}
        <div className="mt-4 bg-gradient-to-r from-primary-500 to-primary-400 rounded-2xl p-4 text-white">
          <p className="text-primary-100 text-sm mb-2">今日已摄入</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-mono">
              {Math.round(totalCalories)}
            </span>
            <span className="text-primary-100 mb-1">kcal</span>
          </div>
          <div className="mt-3 flex gap-4">
            <div>
              <p className="text-xs text-primary-200">蛋白质</p>
              <p className="text-sm font-semibold">{Math.round(totalProtein)}g</p>
            </div>
            <div>
              <p className="text-xs text-primary-200">脂肪</p>
              <p className="text-sm font-semibold">{Math.round(totalFat)}g</p>
            </div>
            <div>
              <p className="text-xs text-primary-200">碳水</p>
              <p className="text-sm font-semibold">{Math.round(totalCarbs)}g</p>
            </div>
          </div>
        </div>
      </header>

      {/* Meals */}
      <div className="px-5 py-4 space-y-4">
        {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
          const Icon = mealIcons[mealType];
          const meals = todayMeals[mealType] || [];
          const mealCalories = getMealCalories(mealType);

          return (
            <motion.div
              key={mealType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Icon className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{mealLabels[mealType]}</h3>
                    <p className="text-xs text-gray-400">
                      {meals.length > 0
                        ? `${meals.length} 项食物`
                        : '尚未添加'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {Math.round(mealCalories)} kcal
                  </p>
                </div>
              </div>

              {/* Food List */}
              {meals.length > 0 && (
                <div className="px-4 py-3 bg-gray-50">
                  {meals.map((food, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-700">{food.name}</p>
                        <p className="text-xs text-gray-400">{food.amount}g</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-600">
                        {Math.round((food.calories * food.amount) / 100)} kcal
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Button */}
              <button
                onClick={() => {
                  setSelectedMeal(mealType);
                  setShowAddFood(true);
                }}
                className="w-full p-4 text-primary-500 font-medium flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors"
              >
                <Plus size={18} />
                添加{mealLabels[mealType]}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      <AnimatePresence>
        {showAddFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowAddFood(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100">
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">
                    添加{mealLabels[selectedMeal]}
                  </h2>
                  <button onClick={() => setShowAddFood(false)}>
                    <X className="text-gray-400" size={24} />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="搜索食物..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Food List */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {filteredFoods.slice(0, 10).map((food) => (
                    <button
                      key={food.id}
                      onClick={() => setSelectedFood(food)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedFood?.id === food.id
                          ? 'bg-primary-50 border-2 border-primary-500'
                          : 'bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {food.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {food.calories} kcal/{food.unit}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selector */}
              {selectedFood && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    选择份量（g）
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setAmount(Math.max(50, amount - 50))}
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"
                    >
                      <Minus size={20} className="text-gray-600" />
                    </button>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="flex-1 text-center text-2xl font-bold bg-white rounded-xl py-2 shadow-sm"
                    />
                    <button
                      onClick={() => setAmount(amount + 50)}
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"
                    >
                      <Plus size={20} className="text-gray-600" />
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    = {Math.round((selectedFood.calories * amount) / 100)} kcal
                  </p>

                  <button
                    onClick={handleAddFood}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-semibold shadow-gradient hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    确认添加
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-darkBg text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <Check size={18} className="text-primary-400" />
            添加成功
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
