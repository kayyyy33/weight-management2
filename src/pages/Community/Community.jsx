import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageCircle,
  ThumbsUp,
  Award,
  Flame,
  TrendingUp,
  Plus,
  X,
  Image,
  Send,
  Trash2,
  LogIn,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

const categories = [
  { id: 'all', name: '全部' },
  { id: '打卡', name: '打卡' },
  { id: '减脂', name: '减脂' },
  { id: '饮食', name: '饮食' },
  { id: '运动', name: '运动' },
];

export default function Community() {
  const navigate = useNavigate();
  const {
    user,
    isLoggedIn,
    communityPosts,
    userAchievements,
    getConsecutiveDays,
    getWeightLost,
    createPost,
    deletePost,
    likePost,
  } = useStore();

  const [activeTab, setActiveTab] = useState('posts');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const consecutiveDays = getConsecutiveDays();
  const weightLost = getWeightLost();
  const unlockedCount = userAchievements.filter((a) => a.unlocked).length;

  // 过滤用户的真实动态
  const userPosts = selectedCategory === 'all'
    ? communityPosts
    : communityPosts.filter(p => {
        const cat = categories.find(c => c.id === selectedCategory)?.name;
        return p.content.includes(`#${cat}`);
      });

  const stats = [
    { label: '连续打卡', value: `${consecutiveDays}天`, icon: Flame, color: 'text-accent-500' },
    { label: '已减体重', value: `${weightLost.toFixed(1)}kg`, icon: TrendingUp, color: 'text-primary-500' },
    { label: '成就解锁', value: `${unlockedCount}/${userAchievements.length}`, icon: Award, color: 'text-yellow-500' },
  ];

  const handleCreatePost = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!postContent.trim()) return;

    setIsPosting(true);
    setTimeout(() => {
      createPost(postContent);
      setPostContent('');
      setShowCreateModal(false);
      setIsPosting(false);
    }, 500);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">社区</h1>
        <p className="text-sm text-gray-400 mt-1">分享您的健康生活</p>
      </header>

      {/* Stats */}
      {isLoggedIn && (
        <div className="px-5 py-4">
          <div className="bg-gradient-to-r from-primary-500 to-primary-400 rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl mx-auto mb-2 flex items-center justify-center">
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <p className="text-white text-lg font-bold">{stat.value}</p>
                  <p className="text-white/70 text-xs">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-5">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { id: 'posts', label: '动态', icon: MessageCircle },
            { id: 'achievements', label: '成就', icon: Award },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills (for posts) */}
      {activeTab === 'posts' && (
        <div className="px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
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
      )}

      {/* Content */}
      <div className="px-5 py-4">
        {activeTab === 'posts' && (
          <>
            {userPosts.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">还没有动态，快来发布第一条吧！</p>
                {!isLoggedIn ? (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-medium"
                  >
                    <LogIn size={18} />
                    登录后发布
                  </Link>
                ) : null}
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-4 shadow-card"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold">
                          {post.userName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{post.userName}</p>
                        <p className="text-xs text-gray-400">{formatTime(post.createdAt)}</p>
                      </div>
                      {post.userId === user?.id && (
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 whitespace-pre-wrap">
                      {post.content}
                    </p>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt=""
                        className="w-full rounded-xl mb-3 max-h-64 object-cover"
                      />
                    )}
                    <div className="flex items-center gap-4 text-gray-400 text-sm border-t border-gray-50 pt-3">
                      <button
                        onClick={() => likePost(post.id)}
                        className="flex items-center gap-1 hover:text-accent-500"
                      >
                        <ThumbsUp size={16} />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary-500">
                        <MessageCircle size={16} />
                        {post.comments}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-3">
            {userAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-4 shadow-card flex items-center gap-4 ${
                  achievement.unlocked ? '' : 'opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-accent-400 to-accent-500'
                      : 'bg-gray-100'
                  }`}
                >
                  <Award
                    size={24}
                    className={achievement.unlocked ? 'text-white' : 'text-gray-300'}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">
                      {achievement.name}
                    </h3>
                    {achievement.unlocked && (
                      <span className="px-2 py-0.5 bg-accent-50 text-accent-500 text-xs rounded-full">
                        已解锁
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          if (!isLoggedIn) {
            navigate('/login');
          } else {
            setShowCreateModal(true);
          }
        }}
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full shadow-gradient flex items-center justify-center hover:shadow-lg transition-all"
      >
        <Plus size={24} className="text-white" />
      </button>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full rounded-t-3xl max-h-[70vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100">
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">发布动态</h2>
                  <button onClick={() => setShowCreateModal(false)}>
                    <X className="text-gray-400" size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="分享您的健康生活...&#10;&#10;可添加话题标签，如：#打卡 #减脂 #饮食 #运动"
                  className="w-full h-40 p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 resize-none outline-none"
                />

                {/* Category quick tags */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {['#打卡', '#减脂', '#饮食', '#运动'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setPostContent(prev => prev + tag + ' ')}
                      className="px-3 py-1.5 bg-primary-50 text-primary-600 text-sm rounded-full"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleCreatePost}
                  disabled={!postContent.trim() || isPosting}
                  className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-semibold shadow-gradient hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPosting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={20} />
                      发布
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
