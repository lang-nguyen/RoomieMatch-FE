import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
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
import RoomPage from '../features/room/RoomPage';
import RoomDetailPage from '../features/room/RoomDetailPage';
import FindMatePage from '../pages/FindMatePage';
import ContactPage from '../pages/ContactPage';
import VnpayReturnPage from '../pages/VnpayReturnPage';
import ProtectedRoute from '../shared/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Homepage />,
      },
      {
        path: '/find-room',
        element: <RoomPage />,
      },
      {
        path: '/rooms/:roomId',
        element: <RoomDetailPage />,
      },
      {
        path: '/find-mate',
        element: <FindMatePage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
      {
        path: '/user/payment/vnpay-return',
        element: <VnpayReturnPage />,
      },
      {
        path: '/user',
        element: (
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        ),
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
    ],
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
]);
