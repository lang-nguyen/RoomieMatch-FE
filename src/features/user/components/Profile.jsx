import {
  Camera,
  CheckCircle2,
  Edit3,
  UserSquare2,
  Mail,
  Phone,
  User as UserIcon,
  ShieldCheck,
  VenusAndMars,
  Lock,
  EyeOff
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../api/userApi';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import styles from './Profile.module.css';

const Profile = () => {
  const { data, isLoading, isError } = useGetUserProfileQuery();
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  
  const profile = data?.profile;
  const account = data?.account;

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'alert', message: '', title: 'Thông báo' });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    full_name: '',
    gender: ''
  });

  useEffect(() => {
    if (profile && account) {
      setFormData({
        username: account.username || '',
        email: account.email || '',
        phone: profile.phone || '',
        full_name: profile.full_name || '',
        gender: profile.gender || ''
      });
    }
  }, [profile, account, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = () => {
    setShowConfirmModal(true);
  };

  const confirmUpdate = async () => {
    setShowConfirmModal(false);
    try {
      await updateUserProfile(formData).unwrap();
      setIsEditing(false);
      setAlertModal({ isOpen: true, type: 'confirm', message: 'Cập nhật thành công!', title: 'Thành công' });
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      setAlertModal({ isOpen: true, type: 'alert', message: 'Cập nhật thất bại. Vui lòng thử lại.', title: 'Lỗi' });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };


  if (isLoading) {
    return <div className={styles.container}>Đang tải hồ sơ cá nhân...</div>;
  }

  if (isError || !profile) {
    return <div className={styles.container}>Đã có lỗi xảy ra khi tải hồ sơ.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Hồ sơ cá nhân</h1>

      <div className={styles.card}>
        <div className={styles.leftSidebar}>
          <div className={styles.avatarWrapper}>
            <img
              src={profile.avatar_url || profile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"}
              alt="Avatar"
              className={styles.avatar}
            />
          </div>

          <h3 className={styles.username}>{profile.full_name || account.username || 'N/A'}</h3>

          {account.email_verified && (
            <div className={styles.verificationBadge}>
              Đã xác minh tài khoản
              <CheckCircle2 className={styles.checkIcon} />
            </div>
          )}

          <button className={styles.changeAvatarBtn}>
            <Camera className={styles.btnIcon} />
            Thay đổi ảnh đại diện
          </button>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Chi tiết tài khoản</h2>
            {!isEditing ? (
              <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                <Edit3 className={styles.btnIcon} />
                Chỉnh sửa
              </button>
            ) : (
              <div className={styles.actionButtons}>
                <button className={styles.cancelBtn} onClick={handleCancel}>
                  Hủy
                </button>
                <button 
                  className={styles.updateBtn} 
                  onClick={handleUpdate} 
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            )}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <UserSquare2 className={styles.labelIcon} />
                Tên đăng nhập
              </div>
              <input 
                type="text" 
                name="username"
                className={styles.input} 
                value={isEditing ? formData.username : (account.username || '')} 
                onChange={handleChange}
                readOnly={!isEditing} 
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <Mail className={styles.labelIcon} />
                Email
              </div>
              <input 
                type="email" 
                name="email"
                className={styles.input} 
                value={isEditing ? formData.email : (account.email || '')} 
                onChange={handleChange}
                readOnly={!isEditing} 
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <Phone className={styles.labelIcon} />
                Số điện thoại
              </div>
              <input 
                type="tel" 
                name="phone"
                className={styles.input} 
                value={isEditing ? formData.phone : (profile.phone || '')} 
                onChange={handleChange}
                readOnly={!isEditing} 
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <UserIcon className={styles.labelIcon} />
                Họ và tên
              </div>
              <input 
                type="text" 
                name="full_name"
                className={styles.input} 
                value={isEditing ? formData.full_name : (profile.full_name || '')} 
                onChange={handleChange}
                readOnly={!isEditing} 
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <ShieldCheck className={styles.labelIcon} />
                Vai trò
              </div>
              <div className={styles.roleTag}>{account.account_type === 'landlord' ? 'Chủ nhà' : 'Người thuê'}</div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <VenusAndMars className={styles.labelIcon} />
                Giới tính
              </div>
              {isEditing ? (
                <select 
                  name="gender" 
                  className={styles.input} 
                  value={formData.gender} 
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db' }}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              ) : (
                <input 
                  type="text" 
                  className={styles.input} 
                  value={profile.gender || ''} 
                  readOnly 
                />
              )}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <Lock className={styles.labelIcon} />
                Mật khẩu
              </div>
              <div className={styles.passwordGroup}>
                <input type="password" className={styles.input} value="****************" readOnly />
                <EyeOff className={styles.eyeIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xác nhận cập nhật"
        message="Bạn có chắc chắn muốn cập nhật thông tin không?"
        confirmText="Cập nhật"
        cancelText="Hủy"
        onConfirm={confirmUpdate}
        onCancel={() => setShowConfirmModal(false)}
      />

      <ConfirmModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        confirmText="Đóng"
        type={alertModal.type}
        onConfirm={() => setAlertModal({ ...alertModal, isOpen: false })}
        onCancel={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </div>
  );
};

export default Profile;
