import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { foods, recipes, merchants, achievements } from '../data/mockData';

// 获取所有用户
const getUsers = () => {
  const stored = localStorage.getItem('wm-users');
  return stored ? JSON.parse(stored) : [];
};

// 保存用户列表
const saveUsers = (users) => {
  localStorage.setItem('wm-users', JSON.stringify(users));
};

// 简单的密码哈希（实际应用应使用更安全的方式）
const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

// 获取当前用户数据存储key
const getUserDataKey = (userId) => `wm-user-data-${userId}`;

// 获取用户数据
const getUserData = (userId) => {
  const stored = localStorage.getItem(getUserDataKey(userId));
  return stored ? JSON.parse(stored) : null;
};

// 保存用户数据
const saveUserData = (userId, data) => {
  localStorage.setItem(getUserDataKey(userId), JSON.stringify(data));
};

// 获取初始用户数据
const getInitialUserData = () => ({
  checkInRecords: [],
  todayCalories: 0,
  todayProtein: 0,
  todayFat: 0,
  todayCarbs: 0,
  weightRecords: [],
  targetWeight: 68,
  userAchievements: achievements.map(a => ({ ...a, unlocked: false, progress: 0 })),
  favoriteFoods: [],
  favoriteRecipes: [],
  communityPosts: [],
  followedUsers: [],
  tastePreferences: [],
  dietaryRestrictions: [],
  fitnessGoal: 'lose_weight',
});

const useStore = create(
  persist(
    (set, get) => ({
      // 当前登录用户
      user: null,
      isLoggedIn: false,
      questionnaireCompleted: false,

      // 用户偏好
      tastePreferences: [],
      dietaryRestrictions: [],
      fitnessGoal: 'lose_weight',

      // 打卡记录
      checkInRecords: [],
      todayCalories: 0,
      todayProtein: 0,
      todayFat: 0,
      todayCarbs: 0,

      // 体重记录
      weightRecords: [],
      targetWeight: 68,

      // 成就
      userAchievements: achievements.map(a => ({ ...a, unlocked: false, progress: 0 })),

      // 收藏
      favoriteFoods: [],
      favoriteRecipes: [],

      // 社区
      communityPosts: [],
      followedUsers: [],

      // 静态数据
      foods: foods,
      recipes: recipes,
      merchants: merchants,

      // 注册用户
      register: (userData) => {
        const users = getUsers();
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
          return { success: false, error: '该邮箱已被注册' };
        }

        const newUser = {
          id: Date.now().toString(),
          email: userData.email,
          password: hashPassword(userData.password),
          nickname: userData.nickname || userData.email.split('@')[0],
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        saveUsers(users);

        // 初始化用户数据
        saveUserData(newUser.id, getInitialUserData());

        return { success: true, user: { id: newUser.id, email: newUser.email, nickname: newUser.nickname } };
      },

      // 登录
      login: (email, password) => {
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === hashPassword(password));

        if (!user) {
          return { success: false, error: '邮箱或密码错误' };
        }

        // 加载用户数据
        const userData = getUserData(user.id) || getInitialUserData();

        set({
          user: { id: user.id, email: user.email, nickname: user.nickname },
          isLoggedIn: true,
          questionnaireCompleted: userData.questionnaireCompleted || false,
          tastePreferences: userData.tastePreferences || [],
          dietaryRestrictions: userData.dietaryRestrictions || [],
          fitnessGoal: userData.fitnessGoal || 'lose_weight',
          checkInRecords: userData.checkInRecords || [],
          todayCalories: userData.todayCalories || 0,
          todayProtein: userData.todayProtein || 0,
          todayFat: userData.todayFat || 0,
          todayCarbs: userData.todayCarbs || 0,
          weightRecords: userData.weightRecords || [],
          targetWeight: userData.targetWeight || 68,
          userAchievements: userData.userAchievements || achievements.map(a => ({ ...a, unlocked: false, progress: 0 })),
          favoriteFoods: userData.favoriteFoods || [],
          favoriteRecipes: userData.favoriteRecipes || [],
          communityPosts: userData.communityPosts || [],
          followedUsers: userData.followedUsers || [],
        });

        return { success: true };
      },

      // 保存当前用户数据到localStorage
      saveCurrentUserData: () => {
        const state = get();
        if (state.user && state.isLoggedIn) {
          const userData = {
            questionnaireCompleted: state.questionnaireCompleted,
            tastePreferences: state.tastePreferences,
            dietaryRestrictions: state.dietaryRestrictions,
            fitnessGoal: state.fitnessGoal,
            checkInRecords: state.checkInRecords,
            todayCalories: state.todayCalories,
            todayProtein: state.todayProtein,
            todayFat: state.todayFat,
            todayCarbs: state.todayCarbs,
            weightRecords: state.weightRecords,
            targetWeight: state.targetWeight,
            userAchievements: state.userAchievements,
            favoriteFoods: state.favoriteFoods,
            favoriteRecipes: state.favoriteRecipes,
            communityPosts: state.communityPosts,
            followedUsers: state.followedUsers,
          };
          saveUserData(state.user.id, userData);
        }
      },

      // 登出
      logout: () => {
        // 先保存当前用户数据
        get().saveCurrentUserData();
        set({
          user: null,
          isLoggedIn: false,
          questionnaireCompleted: false,
          tastePreferences: [],
          dietaryRestrictions: [],
          fitnessGoal: 'lose_weight',
          checkInRecords: [],
          todayCalories: 0,
          todayProtein: 0,
          todayFat: 0,
          todayCarbs: 0,
          weightRecords: [],
          targetWeight: 68,
          userAchievements: achievements.map(a => ({ ...a, unlocked: false, progress: 0 })),
          favoriteFoods: [],
          favoriteRecipes: [],
          communityPosts: [],
          followedUsers: [],
        });
      },

      completeQuestionnaire: (preferences) => {
        set({
          questionnaireCompleted: true,
          tastePreferences: preferences.taste,
          dietaryRestrictions: preferences.restrictions,
          fitnessGoal: preferences.goal,
        });
        get().saveCurrentUserData();
      },

      // 添加食物到某餐
      addFoodToMeal: (mealType, food, amount) => {
        const today = new Date().toISOString().split('T')[0];
        const records = get().checkInRecords;
        const todayRecord = records.find(r => r.date === today);

        const foodAmount = (food.calories * amount) / 100;
        const proteinAmount = (food.protein * amount) / 100;
        const fatAmount = (food.fat * amount) / 100;
        const carbsAmount = (food.carbs * amount) / 100;

        let newRecords;
        let newTodayCalories, newTodayProtein, newTodayFat, newTodayCarbs;

        if (todayRecord) {
          const updatedMeals = [...todayRecord.meals[mealType], { ...food, amount }];
          newRecords = records.map(r =>
            r.date === today
              ? { ...r, meals: { ...r.meals, [mealType]: updatedMeals } }
              : r
          );
          newTodayCalories = get().todayCalories + foodAmount;
          newTodayProtein = get().todayProtein + proteinAmount;
          newTodayFat = get().todayFat + fatAmount;
          newTodayCarbs = get().todayCarbs + carbsAmount;
        } else {
          newRecords = [
            ...records,
            {
              id: Date.now().toString(),
              date: today,
              meals: {
                breakfast: mealType === 'breakfast' ? [{ ...food, amount }] : [],
                lunch: mealType === 'lunch' ? [{ ...food, amount }] : [],
                dinner: mealType === 'dinner' ? [{ ...food, amount }] : [],
                snack: mealType === 'snack' ? [{ ...food, amount }] : [],
              },
            },
          ];
          newTodayCalories = get().todayCalories + foodAmount;
          newTodayProtein = get().todayProtein + proteinAmount;
          newTodayFat = get().todayFat + fatAmount;
          newTodayCarbs = get().todayCarbs + carbsAmount;
        }

        set({
          checkInRecords: newRecords,
          todayCalories: newTodayCalories,
          todayProtein: newTodayProtein,
          todayFat: newTodayFat,
          todayCarbs: newTodayCarbs,
        });
        get().saveCurrentUserData();
      },

      // 记录体重
      addWeightRecord: (weight, note) => {
        const today = new Date().toISOString().split('T')[0];
        const records = get().weightRecords;
        const existingIndex = records.findIndex(r => r.date === today);

        let newRecords;
        if (existingIndex >= 0) {
          newRecords = records.map((r, i) =>
            i === existingIndex ? { ...r, weight, note } : r
          );
        } else {
          newRecords = [
            ...records,
            { id: Date.now().toString(), date: today, weight, note },
          ];
        }

        set({ weightRecords: newRecords });
        get().saveCurrentUserData();
      },

      // 切换收藏食物
      toggleFavoriteFood: (foodId) => {
        const favorites = get().favoriteFoods;
        const newFavorites = favorites.includes(foodId)
          ? favorites.filter(id => id !== foodId)
          : [...favorites, foodId];
        set({ favoriteFoods: newFavorites });
        get().saveCurrentUserData();
      },

      // 切换收藏菜谱
      toggleFavoriteRecipe: (recipeId) => {
        const favorites = get().favoriteRecipes;
        const newFavorites = favorites.includes(recipeId)
          ? favorites.filter(id => id !== recipeId)
          : [...favorites, recipeId];
        set({ favoriteRecipes: newFavorites });
        get().saveCurrentUserData();
      },

      // 解锁成就
      unlockAchievement: (achievementId) => {
        set({
          userAchievements: get().userAchievements.map(a =>
            a.id === achievementId ? { ...a, unlocked: true } : a
          ),
        });
        get().saveCurrentUserData();
      },

      // 更新成就进度
      updateAchievementProgress: (achievementId, progress) => {
        set({
          userAchievements: get().userAchievements.map(a =>
            a.id === achievementId ? { ...a, progress } : a
          ),
        });
        get().saveCurrentUserData();
      },

      // 计算连续打卡天数
      getConsecutiveDays: () => {
        const records = get().checkInRecords.sort((a, b) =>
          new Date(b.date) - new Date(a.date)
        );
        if (records.length === 0) return 0;

        let consecutive = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const record of records) {
          const recordDate = new Date(record.date);
          recordDate.setHours(0, 0, 0, 0);

          const diffDays = Math.floor(
            (currentDate - recordDate) / (1000 * 60 * 60 * 24)
          );

          if (diffDays <= 1) {
            consecutive++;
            currentDate = recordDate;
          } else {
            break;
          }
        }

        return consecutive;
      },

      // 获取今日打卡记录
      getTodayMeals: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = get().checkInRecords.find(r => r.date === today);
        return todayRecord?.meals || { breakfast: [], lunch: [], dinner: [], snack: [] };
      },

      // 获取当前体重
      getCurrentWeight: () => {
        const records = get().weightRecords.sort((a, b) =>
          new Date(b.date) - new Date(a.date)
        );
        return records[0]?.weight || 0;
      },

      // 获取已减重量
      getWeightLost: () => {
        const records = get().weightRecords.sort((a, b) =>
          new Date(a.date) - new Date(b.date)
        );
        if (records.length < 2) return 0;
        const initialWeight = records[0].weight;
        const currentWeight = records[records.length - 1].weight;
        return initialWeight - currentWeight;
      },

      // 创建社区动态
      createPost: (content, imageUrl = '') => {
        const state = get();
        if (!state.user) {
          return { success: false, error: '请先登录' };
        }

        const newPost = {
          id: Date.now().toString(),
          userId: state.user.id,
          userName: state.user.nickname,
          userAvatar: state.user.avatar || '',
          content: content,
          imageUrl: imageUrl,
          createdAt: new Date().toISOString(),
          likes: 0,
          comments: 0,
        };

        set({
          communityPosts: [newPost, ...state.communityPosts],
        });
        get().saveCurrentUserData();
        return { success: true };
      },

      // 删除动态
      deletePost: (postId) => {
        const state = get();
        set({
          communityPosts: state.communityPosts.filter(p => p.id !== postId),
        });
        get().saveCurrentUserData();
      },

      // 点赞动态
      likePost: (postId) => {
        const state = get();
        set({
          communityPosts: state.communityPosts.map(p =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p
          ),
        });
        get().saveCurrentUserData();
      },
    }),
    {
      name: 'weight-management-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useStore;
