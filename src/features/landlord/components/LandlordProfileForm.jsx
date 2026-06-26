import { Bookmark, Edit3, Eye, Star, Users, Camera } from 'lucide-react';
import { useRef } from 'react';
import { useLandlordProfile } from '../hooks/useLandlordProfile';
import styles from './LandlordProfileForm.module.css';

const formatGender = (value) => {
  if (value === 'male') return 'Nam';
  if (value === 'female') return 'Nữ';
  if (value === 'other') return 'Khác';
  return '';
};

const formatStatus = (value) => {
  if (value === 'active') return 'Đang hoạt động';
  if (value === 'blocked') return 'Bị khóa';
  return value || '';
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
};

const ScoreBadge = ({ value, label, icon: Icon }) => (
  <div className={styles.scoreBadgeWrapper}>
    <div className={styles.scoreBadgeTop}>
      <div className={styles.scoreBadgeCircle}>
        <span className={styles.scoreValue}>{value}</span>
      </div>
      <div className={styles.scoreIcon}>
        <Icon size={24} color="#111111" strokeWidth={2.2} />
      </div>
    </div>
    <span className={styles.scoreBadgeLabel}>{label}</span>
  </div>
);

const InfoRow = ({ label, value, name, isEditing, onChange, type = 'text', placeholder, displayValue }) => (
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>
      {label} <span style={{ color: '#c1440e' }}>:</span>
    </span>
    {isEditing ? (
      <input
        type={type}
        name={name}
        className={styles.infoInput}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
      />
    ) : (
      <span className={styles.infoValue}>{displayValue || value || 'Chưa cập nhật'}</span>
    )}
  </div>
);

const LandlordProfileForm = () => {
  const {
    profile,
    isLoading,
    isError,
    isEditing,
    formData,
    isUpdating,
    successMessage,
    errorMessage,
    startEditing,
    cancelEditing,
    handleChange,
    handleSave,
    handleAvatarUpload,
    isUploadingAvatar,
  } = useLandlordProfile();

  const fileInputRef = useRef(null);

  const onAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleAvatarUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <p>Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className={styles.errorState}>
        <p>Đã có lỗi xảy ra khi tải hồ sơ. Vui lòng thử lại.</p>
      </div>
    );
  }

  const display = isEditing ? formData : profile;
  const avatarLetter = (profile.display_name || profile.nickname || 'C').trim().charAt(0).toUpperCase();

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.avatarWrapper} onClick={onAvatarClick} style={{ cursor: 'pointer', position: 'relative' }}>
          <div className={`${styles.avatarRing} ${isUploadingAvatar ? styles.uploading : ''}`}>
            <div className={styles.avatarInner}>
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.display_name} className={styles.avatarImg} style={{ opacity: isUploadingAvatar ? 0.5 : 1 }} />
              ) : (
                <span className={styles.avatarLetter}>{avatarLetter}</span>
              )}
              <div className={styles.avatarOverlay} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                <Camera size={24} color="#fff" />
              </div>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        <div className={styles.nameSection}>
          <div className={styles.nameLine}>
            <h1 className={styles.displayName}>
              {isEditing ? (
                <input
                  name="display_name"
                  className={styles.nameInput}
                  value={display?.display_name || ''}
                  onChange={handleChange}
                />
              ) : (
                profile.display_name
              )}
            </h1>
            {!isEditing && (
              <button className={styles.editNameBtn} type="button" onClick={startEditing}>
                <Edit3 size={14} />
              </button>
            )}

            <div className={styles.actions}>
              {isEditing ? (
                <>
                  <button className={styles.cancelBtn} type="button" onClick={cancelEditing}>
                    Hủy
                  </button>
                  <button className={styles.saveBtn} type="button" onClick={handleSave} disabled={isUpdating}>
                    {isUpdating ? 'Đang lưu...' : 'Hoàn tất'}
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.editBtn} type="button" onClick={startEditing}>
                    Chỉnh sửa tất cả
                  </button>
                  <button className={styles.doneBtn} type="button" disabled>
                    Hoàn tất
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.roleLine}>
            <span className={styles.roleText}>{formatStatus(profile.role) || profile.role || 'Chủ trọ'}</span>
          </div>

          <div className={styles.scores}>
            <ScoreBadge value={profile.scores?.saved ?? 0} label="Lượt lưu" icon={Bookmark} />
            <ScoreBadge value={profile.scores?.reviews ?? 0} label="Đánh giá" icon={Star} />
            <ScoreBadge value={profile.scores?.tenants ?? 0} label="Người thuê" icon={Users} />
            <ScoreBadge value={profile.scores?.views ?? 0} label="Lượt xem" icon={Eye} />
          </div>
        </div>
      </div>

      {successMessage && <div className={styles.successMsg}>{successMessage}</div>}
      {errorMessage && <div className={styles.errorMsg}>{errorMessage}</div>}

      <div className={styles.infoGrid}>
        <div className={styles.infoCol}>
          <div className={styles.sectionTitle}>Thông tin cá nhân</div>
          <div className={styles.infoBlock}>
            <InfoRow
              label="Ngày sinh"
              name="dob"
              value={display?.dob}
              displayValue={formatDate(display?.dob)}
              isEditing={isEditing}
              onChange={handleChange}
              type="date"
            />
            <InfoRow
              label="Giới tính"
              name="gender"
              value={display?.gender}
              displayValue={formatGender(display?.gender)}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoRow
              label="Tình trạng"
              name="status"
              value={display?.status}
              displayValue={formatStatus(display?.status)}
              isEditing={false}
            />
            <InfoRow
              label="Số điện thoại"
              name="phone"
              value={display?.phone}
              isEditing={isEditing}
              onChange={handleChange}
              type="tel"
            />
            <InfoRow
              label="Facebook"
              name="facebook"
              value={display?.facebook}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.infoCol}>
          <div className={styles.sectionTitle}>Thông tin bổ sung</div>
          <div className={styles.infoBlock}>
            <InfoRow
              label="Vị trí"
              name="location"
              value={display?.location}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoRow
              label="Quê quán"
              name="hometown"
              value={display?.hometown}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                Căn cước công dân <span style={{ color: '#c1440e' }}>:</span>
              </span>
              <span className={profile.cccd_verified ? styles.verified : styles.unverified}>
                {profile.cccd_verified ? 'Đã xác thực' : 'Chưa xác thực'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bioSection}>
        <div className={styles.bioHeader}>
          <span className={styles.sectionTitle}>Giới thiệu</span>
          {!isEditing && <Edit3 size={14} color="#c1440e" />}
        </div>
        {isEditing ? (
          <textarea
            name="bio"
            className={styles.bioTextarea}
            value={display?.bio || ''}
            onChange={handleChange}
            rows={4}
            placeholder="Giới thiệu bản thân..."
          />
        ) : (
          <p className={styles.bioText}>{profile.bio || 'Chưa có phần giới thiệu.'}</p>
        )}
      </div>
    </div>
  );
};

export default LandlordProfileForm;
