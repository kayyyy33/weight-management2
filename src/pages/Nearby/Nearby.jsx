import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  Navigation,
  Star,
  Clock,
  ExternalLink,
  Filter,
  X,
  Heart,
  Flame,
  Loader,
  AlertCircle,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { merchantCategories } from '../../data/mockData';

export default function Nearby() {
  const { merchants } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [showMerchantDetail, setShowMerchantDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // 定位相关状态
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(true);

  // 获取用户位置
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
          setIsLocating(false);
        },
        (error) => {
          console.error('定位失败:', error);
          setLocationError(getLocationErrorMessage(error.code));
          setIsLocating(false);
          // 使用默认位置（北京）
          setUserLocation({ latitude: 39.9042, longitude: 116.4074 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    } else {
      setLocationError('您的浏览器不支持定位功能');
      setIsLocating(false);
      setUserLocation({ latitude: 39.9042, longitude: 116.4074 });
    }
  }, []);

  const getLocationErrorMessage = (code) => {
    switch (code) {
      case 1:
        return '定位权限被拒绝，请开启定位权限';
      case 2:
        return '无法获取您的位置信息';
      case 3:
        return '定位超时，请重试';
      default:
        return '定位失败';
    }
  };

  // 刷新位置
  const refreshLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
          setIsLocating(false);
        },
        (error) => {
          setLocationError(getLocationErrorMessage(error.code));
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  // 计算距离
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // 返回米
  };

  // 根据位置计算商家距离
  const merchantsWithDistance = useMemo(() => {
    if (!userLocation) return merchants.map(m => ({ ...m, distance: m.distance }));

    return merchants.map(m => {
      // 模拟商家位置（实际应从API获取）
      const merchantLat = userLocation.latitude + (Math.random() - 0.5) * 0.05;
      const merchantLon = userLocation.longitude + (Math.random() - 0.5) * 0.05;
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        merchantLat,
        merchantLon
      );
      return { ...m, distance: Math.round(distance) };
    });
  }, [merchants, userLocation]);

  const filteredMerchants = useMemo(() => {
    let result = [...merchantsWithDistance];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const categoryMap = {
        light: '轻食',
        salad: '沙拉',
        hotpot: '小火锅',
        porridge: '粥店',
        japanese: '日料',
        western: '西餐',
        vegetarian: '素食',
        bento: '便当',
      };
      result = result.filter(
        (m) => m.category === categoryMap[selectedCategory]
      );
    }

    // Sort
    if (sortBy === 'distance') {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'calories') {
      result.sort((a, b) => a.avgCalories - b.avgCalories);
    }

    return result;
  }, [merchantsWithDistance, searchQuery, selectedCategory, sortBy]);

  const handleMerchantClick = (merchant) => {
    setSelectedMerchant(merchant);
    setShowMerchantDetail(true);
  };

  const formatDistance = (meters) => {
    if (!meters || meters < 0) return '--';
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-500 to-primary-400 text-white px-5 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">附近美食</h1>
            <p className="text-primary-100 text-sm mt-1 flex items-center gap-1">
              <MapPin size={14} />
              {isLocating ? (
                <span className="flex items-center gap-1">
                  <Loader size={12} className="animate-spin" />
                  定位中...
                </span>
              ) : locationError ? (
                <span className="text-accent-300">{locationError}</span>
              ) : (
                '已获取您的位置'
              )}
            </p>
          </div>
          <button
            onClick={refreshLocation}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            disabled={isLocating}
          >
            <Navigation size={20} className={isLocating ? 'animate-pulse' : ''} />
          </button>
        </div>

        {/* Location Error Alert */}
        {locationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-white/20 backdrop-blur-sm rounded-xl flex items-center gap-2"
          >
            <AlertCircle size={16} />
            <span className="text-sm text-white/90">{locationError}</span>
          </motion.div>
        )}

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-200" size={20} />
          <input
            type="text"
            placeholder="搜索餐厅或菜系..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-primary-200 focus:ring-2 focus:ring-white/50 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-200"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Filters Bar */}
      <div className="px-5 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'distance', label: '距离' },
            { id: 'rating', label: '评分' },
            { id: 'calories', label: '热量' },
          ].map((sort) => (
            <button
              key={sort.id}
              onClick={() => setSortBy(sort.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                sortBy === sort.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600"
        >
          <Filter size={14} />
          筛选
        </button>
      </div>

      {/* Category Pills */}
      <div className="px-5 py-3 bg-white">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {merchantCategories.map((cat) => (
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
      </div>

      {/* Merchant List */}
      <div className="px-5 py-4 pb-8">
        <p className="text-sm text-gray-400 mb-3">
          找到 {filteredMerchants.length} 家餐厅
        </p>

        <div className="space-y-4">
          {filteredMerchants.map((merchant, index) => (
            <motion.div
              key={merchant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer"
              onClick={() => handleMerchantClick(merchant)}
            >
              <div className="flex">
                <div className="w-28 h-28 flex-shrink-0">
                  <img
                    src={merchant.image}
                    alt={merchant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {merchant.name}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-medium">
                          {merchant.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {merchant.category} · {formatDistance(merchant.distance)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {merchant.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Flame size={12} className="text-accent-500" />
                      <span>{merchant.caloriesRange}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {merchant.priceRange}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-3xl p-6 max-h-[60vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold text-gray-800 mb-4">筛选餐厅</h3>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-600 mb-3">菜系分类</p>
                <div className="flex flex-wrap gap-2">
                  {merchantCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setShowFilters(false);
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
                >
                  重置
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-medium"
                >
                  确认
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Merchant Detail Modal */}
      <AnimatePresence>
        {showMerchantDetail && selectedMerchant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowMerchantDetail(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48">
                <img
                  src={selectedMerchant.image}
                  alt={selectedMerchant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setShowMerchantDetail(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <X size={20} className="text-gray-600" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-white text-xl font-bold">
                    {selectedMerchant.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/80 text-sm flex items-center gap-1">
                      <Star size={14} fill="currentColor" className="text-yellow-400" />
                      {selectedMerchant.rating}
                    </span>
                    <span className="text-white/80 text-sm">
                      {selectedMerchant.category}
                    </span>
                    <span className="text-white/80 text-sm flex items-center gap-1">
                      <MapPin size={14} />
                      {formatDistance(selectedMerchant.distance)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {selectedMerchant.openingHours}
                  </span>
                  <span>{selectedMerchant.priceRange}</span>
                </div>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap mb-5">
                  {selectedMerchant.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-50 text-primary-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Nutrition */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                  <h3 className="font-semibold text-gray-800 mb-3">平均营养成分</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: '热量', value: selectedMerchant.avgCalories, unit: 'kcal', color: 'text-primary-500' },
                      { label: '蛋白质', value: selectedMerchant.avgProtein, unit: 'g', color: 'text-blue-500' },
                      { label: '脂肪', value: selectedMerchant.avgFat, unit: 'g', color: 'text-yellow-500' },
                      { label: '碳水', value: selectedMerchant.avgCarbs, unit: 'g', color: 'text-orange-500' },
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

                {/* Taste Profile */}
                <div className="mb-5">
                  <h3 className="font-semibold text-gray-800 mb-3">口味特点</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedMerchant.tasteProfile.map((taste) => (
                      <span
                        key={taste}
                        className="px-3 py-1.5 bg-accent-50 text-accent-600 text-sm rounded-full"
                      >
                        {taste}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delivery Platforms */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">外卖平台</h3>
                  <div className="flex gap-3">
                    {selectedMerchant.deliveryPlatforms.map((platform) => (
                      <button
                        key={platform}
                        className="flex-1 py-3 bg-gray-50 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <ExternalLink size={16} />
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-medium text-gray-800 mb-1">商家地址</p>
                  <p className="text-sm text-gray-500">{selectedMerchant.address}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
