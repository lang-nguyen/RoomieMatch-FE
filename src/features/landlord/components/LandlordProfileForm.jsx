import { Edit3, Bookmark, ThumbsUp, Star, User } from 'lucide-react';
import { useLandlordProfile } from '../hooks/useLandlordProfile';
import styles from './LandlordProfileForm.module.css';

const ScoreBadge = ({ value, icon: Icon }) => (
  <div className={styles.scoreBadgeWrapper}>
    <div className={styles.scoreBadgeCircle}>
      <span className={styles.scoreValue}>{value}</span>
    </div>
    <div className={styles.scoreIcon}>
      <Icon size={18} color="#1a1a1a" strokeWidth={1.5} />
    </div>
  </div>
);

const InfoRow = ({ label, value, name, isEditing, onChange, type = 'text' }) => (
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
        placeholder={`Nhập ${label.toLowerCase()}`}
      />
    ) : (
      <span className={styles.infoValue}>{value || ''}</span>
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
  } = useLandlordProfile();

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

  return (
    <div className={styles.container}>
      {/* Header: Avatar + Name + Actions */}
      <div className={styles.topSection}>
        {/* Avatar */}
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarRing}>
            <div className={styles.avatarInner}>
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.display_name} className={styles.avatarImg} />
              ) : (
                <span className={styles.avatarLetter}>
                  {profile.nickname?.[0]?.toUpperCase() ?? 'C'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Name + Role + Scores */}
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
            <button className={styles.editNameBtn} onClick={isEditing ? undefined : startEditing}>
              <Edit3 size={14} />
            </button>

            {/* Action buttons */}
            <div className={styles.actions}>
              {isEditing ? (
                <>
                  <button className={styles.cancelBtn} onClick={cancelEditing}>
                    Hủy
                  </button>
                  <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Đang lưu...' : 'Hoàn Tất'}
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.editBtn} onClick={startEditing}>
                    Chỉnh Sửa Tất Cả
                  </button>
                  <button className={styles.doneBtn} disabled>
                    Hoàn Tất
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Role */}
          <div className={styles.roleLine}>
            {isEditing ? (
              <input
                name="role"
                className={styles.roleInput}
                value={display?.role || ''}
                onChange={handleChange}
                placeholder="Vai trò / Mô tả"
              />
            ) : (
              <span className={styles.roleText}>{profile.role}</span>
            )}
            <Edit3 size={12} color="#c1440e" />
          </div>

          {/* Score Badges */}
          <div className={styles.scores}>
            <ScoreBadge value={profile.scores?.posts ?? 100} icon={Bookmark} />
            <ScoreBadge value={profile.scores?.likes ?? 100} icon={ThumbsUp} />
            <ScoreBadge value={profile.scores?.connections ?? 100} icon={Star} />
            <ScoreBadge value={profile.scores?.verified ?? 100} icon={User} />
          </div>
        </div>
      </div>

      {successMessage && <div className={styles.successMsg}>{successMessage}</div>}
      {errorMessage && <div className={styles.errorMsg}>{errorMessage}</div>}

      {/* Info Sections */}
      <div className={styles.infoGrid}>
        {/* Left column */}
        <div className={styles.infoCol}>
          <div className={styles.sectionTitle} style={{ color: '#c1440e' }}>
            Thông Tin Cá Nhân
          </div>
          <div className={styles.infoBlock}>
            <InfoRow label="Ngày Sinh" name="dob" value={display?.dob} isEditing={isEditing} onChange={handleChange} />
            <InfoRow label="Giới Tính" name="gender" value={display?.gender} isEditing={isEditing} onChange={handleChange} />
            <InfoRow label="Tình Trạng" name="status" value={display?.status} isEditing={isEditing} onChange={handleChange} />
            <InfoRow label="Số Điện Thoại" name="phone" value={display?.phone} isEditing={isEditing} onChange={handleChange} type="tel" />
            <InfoRow label="Facebook" name="facebook" value={display?.facebook} isEditing={isEditing} onChange={handleChange} />
            <InfoRow label="Zalo" name="zalo" value={display?.zalo} isEditing={isEditing} onChange={handleChange} />
          </div>
        </div>

        {/* Right column */}
        <div className={styles.infoCol}>
          <div className={styles.infoBlock} style={{ marginTop: '28px' }}>
            <InfoRow label="Vị Trí" name="location" value={display?.location} isEditing={isEditing} onChange={handleChange} />
            <InfoRow label="Quê Quán" name="hometown" value={display?.hometown} isEditing={isEditing} onChange={handleChange} />
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                Căn Cước Công Dân <span style={{ color: '#c1440e' }}>:</span>
              </span>
              <span className={profile.cccd_verified ? styles.verified : styles.unverified}>
                {profile.cccd_verified ? 'Đã Xác Thực' : 'Chưa Xác Thực'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className={styles.bioSection}>
        <div className={styles.bioHeader}>
          <span className={styles.sectionTitle}>Giới Thiệu</span>
          <Edit3 size={14} color="#c1440e" />
        </div>
        {isEditing ? (
          <textarea
            name="bio"
            className={styles.bioTextarea}
            value={display?.bio || ''}
            onChange={handleChange}
            rows={3}
            placeholder="Giới thiệu bản thân..."
          />
        ) : (
          <p className={styles.bioText}>{profile.bio}</p>
        )}
      </div>
    </div>
  );
};

export default LandlordProfileForm;
