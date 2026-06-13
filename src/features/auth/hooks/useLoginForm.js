import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../api/authApi';
import { clearError, selectAuthError, setCredentials, setError } from '../slice';
import { getApiErrorMessage } from '../../../shared/utils/getApiErrorMessage';
import { ROLE_DEFAULT_ROUTES } from '../../../shared/constants/roles';

const normalizeAuthResponse = (payload = {}) => {
  const data = payload.data || payload;
  const user = data.user || {};
  const accountType = user.account_type || user.accountType || data.account_type || data.accountType;

  return {
    ...data,
    access_token: data.access_token || data.accessToken || data.token,
    user: {
      ...user,
      account_type: accountType,
    },
  };
};

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);
  const timeoutRef = useRef(null);

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setSuccessMessage('');

    try {
      const response = normalizeAuthResponse(await login({ email, password }).unwrap());
      dispatch(setCredentials(response));
      setSuccessMessage('Đăng nhập thành công. Đang chuyển trang...');

      // Điều hướng theo role
      const accountType = response.user?.account_type;
      const redirectTo = ROLE_DEFAULT_ROUTES[accountType] || '/';
      timeoutRef.current = setTimeout(() => navigate(redirectTo), 700);
    } catch (err) {
      dispatch(setError(getApiErrorMessage(err, 'Đăng nhập thất bại')));
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    successMessage,
    error,
    isLoading,
    handleSubmit,
  };
};
