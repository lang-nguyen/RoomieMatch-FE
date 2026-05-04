import { createBrowserRouter } from 'react-router-dom';
import Homepage from '../features/homepage/Homepage';

// Các component tạm thời cho các trang
const Login = () => <div>Trang Đăng nhập</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
