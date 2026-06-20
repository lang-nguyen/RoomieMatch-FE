import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginForm } from '../hooks/useLoginForm';
import { useGoogleLoginMutation } from '../api/authApi';
import { setCredentials, setError, clearError } from '../slice';
import { getApiErrorMessage } from '../../../shared/utils/getApiErrorMessage';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import styles from './Auth.module.css';

export const LoginForm = () => {
  const { email, setEmail, password, setPassword, successMessage, error, isLoading, handleSubmit } = useLoginForm();
  
  const [googleLoginMutate, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [pendingToken, setPendingToken] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    dispatch(clearError());
    try {
      const response = await googleLoginMutate({ id_token: token }).unwrap();
      dispatch(setCredentials(response));
      navigate('/');
    } catch (err) {
      if (err.status === 400 && err.data?.detail?.includes('Account type is required')) {
        setPendingToken(token);
        setIsRoleModalOpen(true);
      } else {
        dispatch(setError(getApiErrorMessage(err, 'Đăng nhập Google thất bại')));
      }
    }
  };

  const handleGoogleError = () => {
    dispatch(setError('Lỗi kết nối với Google'));
  };

  const handleRoleSelection = async (role) => {
    if (!pendingToken) return;
    setIsRoleModalOpen(false);
    try {
      const response = await googleLoginMutate({ id_token: pendingToken, account_type: role }).unwrap();
      dispatch(setCredentials(response));
      navigate('/');
    } catch (err) {
      dispatch(setError(getApiErrorMessage(err, 'Tạo tài khoản Google thất bại')));
    }
    setPendingToken(null);
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.tabs}>
        <Link to="/login" className={`${styles.tab} ${styles.activeTab}`}>Đăng nhập</Link>
        <Link to="/register" className={styles.tab}>Tạo tài khoản mới</Link>
      </div>

      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input 
            type="email" 
            placeholder="Email" 
            className={styles.input} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            className={styles.input} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className={styles.primaryButton} disabled={isLoading || isGoogleLoading}>
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        
        <Link to="/forgot-password" className={styles.forgotPassword}>
          Bạn quên mật khẩu?
        </Link>
      </form>

      <div className={styles.divider}>Hoặc</div>

      <div className={styles.googleButtonWrapper} style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <GoogleLogin 
          onSuccess={handleGoogleSuccess} 
          onError={handleGoogleError} 
          useOneTap
        />
      </div>

      <ConfirmModal 
        isOpen={isRoleModalOpen}
        title="Chọn vai trò của bạn"
        message="Chào mừng bạn mới! Bạn muốn tìm phòng (Người thuê) hay cho thuê phòng (Chủ nhà)?"
        confirmText="Chủ nhà"
        cancelText="Người thuê"
        onConfirm={() => handleRoleSelection('landlord')}
        onCancel={() => handleRoleSelection('tenant')}
        onClose={() => setIsRoleModalOpen(false)}
        type="confirm"
      />
    </div>
  );
};
