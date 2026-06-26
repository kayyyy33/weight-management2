import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Home from '../pages/Home/Home';
import Foods from '../pages/Foods/Foods';
import CheckIn from '../pages/CheckIn/CheckIn';
import Weight from '../pages/Weight/Weight';
import Recipes from '../pages/Recipes/Recipes';
import Nearby from '../pages/Nearby/Nearby';
import Community from '../pages/Community/Community';
import Profile from '../pages/Profile/Profile';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Questionnaire from '../pages/Questionnaire/Questionnaire';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'foods', element: <Foods /> },
      { path: 'checkin', element: <CheckIn /> },
      { path: 'weight', element: <Weight /> },
      { path: 'recipes', element: <Recipes /> },
      { path: 'nearby', element: <Nearby /> },
      { path: 'community', element: <Community /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/questionnaire', element: <Questionnaire /> },
]);

export default router;
