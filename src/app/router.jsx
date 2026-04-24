import { createBrowserRouter } from 'react-router-dom';

// Các component tạm thời cho các trang
const Home = () => <div>Trang chủ - RoomieMatch</div>;
const Login = () => <div>Trang Đăng nhập</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
