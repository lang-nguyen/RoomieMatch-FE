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
import styles from './Profile.module.css';

const Profile = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Hồ sơ cá nhân</h1>
      
      <div className={styles.card}>
        <div className={styles.leftSidebar}>
          <div className={styles.avatarWrapper}>
            {/* Using a placeholder avatar from unsplash or similar for now */}
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
              alt="Avatar" 
              className={styles.avatar} 
            />
          </div>
          
          <h3 className={styles.username}>nguyenvana</h3>
          
          <div className={styles.verificationBadge}>
            Đã xác minh tài khoản
            <CheckCircle2 className={styles.checkIcon} />
          </div>
          
          <p className={styles.joinDate}>Tham gia ngày: 15/01/2024</p>
          
          <button className={styles.changeAvatarBtn}>
            <Camera className={styles.btnIcon} />
            Thay đổi ảnh đại diện
          </button>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Chi tiết tài khoản</h2>
            <button className={styles.editBtn}>
              <Edit3 className={styles.btnIcon} />
              Chỉnh sửa
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <UserSquare2 className={styles.labelIcon} />
                Tên đăng nhập
              </div>
              <input type="text" className={styles.input} value="Nguyenvana" readOnly />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <Mail className={styles.labelIcon} />
                Email
              </div>
              <input type="email" className={styles.input} value="Nguyenvana@gmail.com" readOnly />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <Phone className={styles.labelIcon} />
                Số điện thoại
              </div>
              <input type="tel" className={styles.input} value="0987654321" readOnly />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <UserIcon className={styles.labelIcon} />
                Họ và tên
              </div>
              <input type="text" className={styles.input} value="Nguyễn Văn A" readOnly />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <ShieldCheck className={styles.labelIcon} />
                Vai trò
              </div>
              <div className={styles.roleTag}>Khách thuê</div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <VenusAndMars className={styles.labelIcon} />
                Giới tính
              </div>
              <input type="text" className={styles.input} value="Nam" readOnly />
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
    </div>
  );
};

export default Profile;
