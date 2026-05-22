import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import Homepage from '../features/homepage/Homepage';
import RoomPage from '../features/room/RoomPage';
import RoomDetailPage from '../features/room/RoomDetailPage';
import FindMatePage from '../pages/FindMatePage';
import ContactPage from '../pages/ContactPage';

export const router = createBrowserRouter([
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
