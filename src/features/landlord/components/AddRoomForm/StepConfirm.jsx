import { useAddRoomForm } from '../../hooks/useAddRoomForm';
import styles from './StepForm.module.css';

const StepConfirm = () => {
  const { draft, isSubmitting, error, successMessage, goBack, handleSubmit } = useAddRoomForm();

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.sectionTitle}>Xác nhận thông tin</h2>
      
      <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, fontSize: 14 }}>
        <p><strong>Tên phòng:</strong> {draft.name}</p>
        <p><strong>Loại phòng:</strong> {draft.room_type}</p>
        <p><strong>Diện tích:</strong> {draft.area} m²</p>
        <p><strong>Địa chỉ:</strong> {draft.address}, {draft.district}, {draft.city}</p>
        <p><strong>Giá thuê:</strong> {Number(draft.price || 0).toLocaleString()} VNĐ/tháng</p>
        <p><strong>Tiện ích:</strong> {(draft.amenities || []).join(', ') || 'Không có'}</p>
      </div>

      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {successMessage && <div style={{ color: 'green', marginTop: 12 }}>{successMessage}</div>}

      <div className={styles.footer}>
        <button type="button" className={styles.backBtn} onClick={goBack} disabled={isSubmitting}>Quay lại</button>
        <button type="button" className={styles.submitBtn} onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu và Đăng bài'}
        </button>
      </div>
    </div>
  );
};

export default StepConfirm;
