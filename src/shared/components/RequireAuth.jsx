import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../../features/auth/slice';

/**
 * Route guard component.
 * - Chưa đăng nhập → redirect về /login (lưu lại URL gốc trong state)
 * - Đã đăng nhập nhưng role không hợp lệ → redirect về /unauthorized
 * - Đủ điều kiện → render <Outlet />
 *
 * @param {string[]} allowedRoles - Mảng account_type được phép truy cập.
 *   Nếu để trống, chỉ cần đăng nhập là đủ.
 */
const RequireAuth = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (!isAuthenticated) {
    // Chưa đăng nhập → về login, giữ lại redirect path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.account_type)) {
    // Đã đăng nhập nhưng không đúng role
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
