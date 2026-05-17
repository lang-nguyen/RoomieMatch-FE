import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import Homepage from '../features/homepage/Homepage'; 
import UserLayout from '../layouts/UserLayout';
import ProfilePage from '../pages/ProfilePage';
import SavedRoomsPage from '../pages/SavedRoomsPage'; 
import RentalHistoryPage from '../pages/RentalHistoryPage';
import PackageHistoryPage from '../pages/PackageHistoryPage';
import PackageManagementPage from '../pages/PackageManagementPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    path: '/user',
    element: <UserLayout />,
    children: [
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'saved-rooms',
        element: <SavedRoomsPage />,
      },
      {
        path: 'rental-history',
        element: <RentalHistoryPage />,
      },
      {
        path: 'package-history',
        element: <PackageHistoryPage />,
      },
      {
        path: 'package-management',
        element: <PackageManagementPage />,
      },
    ],
  },
]);
