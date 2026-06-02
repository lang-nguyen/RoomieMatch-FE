import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../api/authApi';
import { clearError, selectAuthError, setCredentials, setError } from '../slice';
import { getApiErrorMessage } from '../../../shared/utils/getApiErrorMessage';

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
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials(response));
      setSuccessMessage('Đăng nhập thành công. Đang chuyển trang...');
      timeoutRef.current = setTimeout(() => navigate('/'), 700);
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
