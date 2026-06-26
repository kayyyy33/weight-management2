import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  UtensilsCrossed,
  CheckSquare,
  Scale,
  BookOpen,
  MapPin,
  Users,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/foods', icon: UtensilsCrossed, label: '食物库' },
  { path: '/checkin', icon: CheckSquare, label: '打卡' },
  { path: '/weight', icon: Scale, label: '体重' },
  { path: '/recipes', icon: BookOpen, label: '菜谱' },
  { path: '/nearby', icon: MapPin, label: '附近' },
  { path: '/community', icon: Users, label: '社区' },
  { path: '/profile', icon: User, label: '我的' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="pb-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-50">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <item.icon
                  size={22}
                  strokeWidth={2}
                  className=""
                />
              </motion.div>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
