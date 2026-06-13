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
import LandlordLayout from '../layouts/LandlordLayout';
import LandlordHomePage from '../pages/landlord/LandlordHomePage';
import LandlordRoomsPage from '../pages/landlord/LandlordRoomsPage';
import LandlordAddRoomPage from '../pages/landlord/LandlordAddRoomPage';
import LandlordPackagesPage from '../pages/landlord/LandlordPackagesPage';
import LandlordPackageManagementPage from '../pages/landlord/LandlordPackageManagementPage';
import LandlordPackageDetailPage from '../pages/landlord/LandlordPackageDetailPage';
import LandlordPackagePaymentPage from '../pages/landlord/LandlordPackagePaymentPage';
import LandlordPostsPage from '../pages/landlord/LandlordPostsPage';
import LandlordStatsPage from '../pages/landlord/LandlordStatsPage';
import RequireAuth from '../shared/components/RequireAuth';
import { ACCOUNT_TYPES } from '../shared/constants/roles';

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
  {
    path: '/landlord',
    element: <RequireAuth allowedRoles={[ACCOUNT_TYPES.LANDLORD]} />,
    children: [
      {
        element: <LandlordLayout />,
        children: [
          { index: true, element: <LandlordHomePage /> },
          { path: 'rooms', element: <LandlordRoomsPage /> },
          { path: 'rooms/add', element: <LandlordAddRoomPage /> },
          { path: 'packages', element: <LandlordPackagesPage /> },
          { path: 'packages/:packageId/payment', element: <LandlordPackagePaymentPage /> },
          { path: 'package-management', element: <LandlordPackageManagementPage /> },
          { path: 'package-management/:invoiceId', element: <LandlordPackageDetailPage /> },
          { path: 'posts', element: <LandlordPostsPage /> },
          { path: 'stats', element: <LandlordStatsPage /> },
        ]
      }
    ]
  },
  {
    path: '/unauthorized',
    element: <div>Bạn không có quyền truy cập trang này.</div>,
  }
]);
