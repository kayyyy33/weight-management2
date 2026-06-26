import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Clock,
  Flame,
  Heart,
  Share2,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';
import useStore from '../../store/useStore';

const categories = [
  { id: 'all', name: '全部' },
  { id: '减脂餐', name: '减脂餐' },
  { id: '健身餐', name: '健身餐' },
  { id: '轻食', name: '轻食' },
  { id: '早餐', name: '早餐' },
  { id: '素食', name: '素食' },
];

export default function Recipes() {
  const { recipes, favoriteRecipes, toggleFavoriteRecipe } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeDetail(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white px-5 pt-12 pb-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">健康菜谱</h1>
        <p className="text-sm text-gray-400 mt-1">精选减脂健身食谱</p>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索菜谱..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Categories */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Recipe List */}
      <div className="px-5 py-4 pb-8">
        <p className="text-sm text-gray-400 mb-3">共 {filteredRecipes.length} 道菜谱</p>

        <div className="space-y-4">
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer"
              onClick={() => handleRecipeClick(recipe)}
            >
              <div className="relative h-44">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteRecipe(recipe.id);
                  }}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Heart
                    size={18}
                    className={
                      favoriteRecipes.includes(recipe.id)
                        ? 'text-accent-500 fill-accent-500'
                        : 'text-gray-400'
                    }
                  />
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-lg">{recipe.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/80 text-xs flex items-center gap-1">
                      <Clock size={12} />
                      {recipe.time}
                    </span>
                    <span className="text-white/80 text-xs flex items-center gap-1">
                      <Flame size={12} />
                      {recipe.calories}kcal
                    </span>
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-white text-xs">
                      {recipe.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex gap-2 flex-wrap">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {showRecipeDetail && selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowRecipeDetail(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-56">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setShowRecipeDetail(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <X size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={() => toggleFavoriteRecipe(selectedRecipe.id)}
                  className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Heart
                    size={20}
                    className={
                      favoriteRecipes.includes(selectedRecipe.id)
                        ? 'text-accent-500 fill-accent-500'
                        : 'text-gray-400'
                    }
                  />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-white text-2xl font-bold">{selectedRecipe.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-white/80 text-sm flex items-center gap-1">
                      <Clock size={14} />
                      {selectedRecipe.time}
                    </span>
                    <span className="text-white/80 text-sm flex items-center gap-1">
                      <Flame size={14} />
                      {selectedRecipe.calories}kcal
                    </span>
                    <span className="text-white/80 text-sm">
                      {selectedRecipe.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Nutrition */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                  <h3 className="font-semibold text-gray-800 mb-3">营养成分</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: '热量', value: selectedRecipe.calories, unit: 'kcal', color: 'text-primary-500' },
                      { label: '蛋白质', value: selectedRecipe.protein, unit: 'g', color: 'text-blue-500' },
                      { label: '脂肪', value: selectedRecipe.fat, unit: 'g', color: 'text-yellow-500' },
                      { label: '碳水', value: selectedRecipe.carbs, unit: 'g', color: 'text-orange-500' },
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

                {/* Tags */}
                <div className="flex gap-2 flex-wrap mb-5">
                  {selectedRecipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-primary-50 text-primary-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Ingredients */}
                <div className="mb-5">
                  <h3 className="font-semibold text-gray-800 mb-3">食材</h3>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        <span className="text-gray-600">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">步骤</h3>
                  <div className="space-y-4">
                    {selectedRecipe.steps.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check size={14} className="text-white" />
                        </div>
                        <p className="text-gray-600 pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
