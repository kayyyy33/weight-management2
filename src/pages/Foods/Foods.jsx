import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Heart, Plus, Info } from 'lucide-react';
import useStore from '../../store/useStore';
import { foodCategories } from '../../data/mockData';

export default function Foods() {
  const { foods, favoriteFoods, toggleFavoriteFood, addFoodToMeal } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState(null);
  const [showFoodDetail, setShowFoodDetail] = useState(false);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [foods, searchQuery, selectedCategory]);

  const handleFoodClick = (food) => {
    setSelectedFood(food);
    setShowFoodDetail(true);
  };

  const handleAddToMeal = (mealType) => {
    if (selectedFood) {
      addFoodToMeal(mealType, selectedFood, 100);
      setShowFoodDetail(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white px-5 pt-12 pb-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">食物库</h1>
        <p className="text-sm text-gray-400 mt-1">查询食物营养成分</p>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索食物..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {foodCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white shadow-gradient'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Food List */}
      <div className="px-5 py-4">
        <p className="text-sm text-gray-400 mb-3">
          共 {filteredFoods.length} 种食物
        </p>

        <div className="grid grid-cols-2 gap-3">
          {filteredFoods.map((food, index) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              onClick={() => handleFoodClick(food)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{food.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{food.category}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteFood(food.id);
                  }}
                  className="p-1"
                >
                  <Heart
                    size={18}
                    className={
                      favoriteFoods.includes(food.id)
                        ? 'text-accent-500 fill-accent-500'
                        : 'text-gray-300'
                    }
                  />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-primary-500 font-mono">
                    {food.calories}
                  </p>
                  <p className="text-[10px] text-gray-400">kcal/100g</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    蛋白质 <span className="font-semibold text-blue-500">{food.protein}g</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    脂肪 <span className="font-semibold text-yellow-500">{food.fat}g</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    碳水 <span className="font-semibold text-orange-500">{food.carbs}g</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Food Detail Modal */}
      <AnimatePresence>
        {showFoodDetail && selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowFoodDetail(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedFood.name}</h2>
                  <p className="text-sm text-gray-400 mt-1">{selectedFood.category}</p>
                </div>
                <button
                  onClick={() => toggleFavoriteFood(selectedFood.id)}
                  className="p-2"
                >
                  <Heart
                    size={24}
                    className={
                      favoriteFoods.includes(selectedFood.id)
                        ? 'text-accent-500 fill-accent-500'
                        : 'text-gray-300'
                    }
                  />
                </button>
              </div>

              {/* Nutrition Info */}
              <div className="mt-6 bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">营养成分（每100g）</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: '热量', value: selectedFood.calories, unit: 'kcal', color: 'text-primary-500' },
                    { label: '蛋白质', value: selectedFood.protein, unit: 'g', color: 'text-blue-500' },
                    { label: '脂肪', value: selectedFood.fat, unit: 'g', color: 'text-yellow-500' },
                    { label: '碳水', value: selectedFood.carbs, unit: 'g', color: 'text-orange-500' },
                    { label: '纤维', value: selectedFood.fiber, unit: 'g', color: 'text-green-500' },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className={`text-lg font-bold font-mono ${item.color}`}>
                        {item.value}
                      </p>
                      <p className="text-[10px] text-gray-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add to Meal */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-600 mb-3">添加到</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { type: 'breakfast', label: '早餐' },
                    { type: 'lunch', label: '午餐' },
                    { type: 'dinner', label: '晚餐' },
                    { type: 'snack', label: '加餐' },
                  ].map((meal) => (
                    <button
                      key={meal.type}
                      onClick={() => handleAddToMeal(meal.type)}
                      className="py-3 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      {meal.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
