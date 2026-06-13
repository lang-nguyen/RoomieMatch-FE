import { useState } from 'react';
import { X, Shield, PlusCircle, Image as ImageIcon } from 'lucide-react';
import styles from './VerificationModal.module.css';

const VerificationModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'manual'

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.headerIcons}>
              <button 
                className={styles.iconToggleBtn} 
                onClick={() => setActiveTab('upload')}
                title="Tải ảnh lên"
              >
                <Shield size={18} color={activeTab === 'upload' ? '#c1440e' : '#333'} />
              </button>
              <button 
                className={styles.iconToggleBtn} 
                onClick={() => setActiveTab('manual')}
                title="Nhập thủ công"
              >
                <PlusCircle size={18} color={activeTab === 'manual' ? '#c1440e' : '#333'} />
              </button>
            </div>
            <div className={styles.headerText}>
              <span className={styles.label}>Căn Cước Công Dân :</span>
              <span className={styles.statusUnverified}>Chưa Xác Thực</span>
            </div>
          </div>

          {activeTab === 'upload' ? (
            <div className={styles.uploadArea}>
              <div className={styles.uploadPlaceholder}>
                <ImageIcon size={48} color="#ffb899" />
              </div>
              <div className={styles.uploadHint}>Thêm Ảnh Căn Cước Của Bạn</div>
            </div>
          ) : (
            <div className={styles.formArea}>
              <input type="text" placeholder="Họ Và Tên" className={styles.inputField} />
              <input type="text" placeholder="Số CCCD" className={styles.inputField} />
              <input type="text" placeholder="Ngày Cấp" className={styles.inputField} />
              <input type="text" placeholder="Đơn Vị Cấp" className={styles.inputField} />
            </div>
          )}

          <button className={styles.submitBtn}>Gửi</button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
