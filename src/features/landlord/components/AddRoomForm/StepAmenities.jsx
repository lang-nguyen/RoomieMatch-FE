import { useAddRoomForm } from '../../hooks/useAddRoomForm';
import { Upload } from 'lucide-react';
import styles from './StepForm.module.css';

const AMENITIES = [
  'Máy lạnh', 'Quạt trần', 'Máy sưởi', 'Vòi sen', 'Bồn tắm',
  'WC riêng', 'Nước nóng', 'Giường', 'Tủ quần áo', 'TV',
  'Bếp nấu', 'Tủ lạnh', 'Máy giặt', 'Wifi', 'Camera an ninh'
];

const StepAmenities = () => {
  const { draft, updateDraft, goNext, goBack } = useAddRoomForm();
  
  const selectedAmenities = draft.amenities || [];

  const handleToggle = (item) => {
    const newSelected = selectedAmenities.includes(item)
      ? selectedAmenities.filter((a) => a !== item)
      : [...selectedAmenities, item];
    updateDraft({ amenities: newSelected });
  };

  const handleNext = (e) => {
    e.preventDefault();
    goNext();
  };

  return (
    <form className={styles.formContainer} onSubmit={handleNext}>
      <h2 className={styles.sectionTitle}>Hình ảnh phòng trọ</h2>
      <div className={styles.uploadBox}>
        <Upload className={styles.uploadIcon} size={28} />
        <div className={styles.uploadText}>
          <span>Nhấn để tải ảnh lên</span> hoặc kéo thả vào đây
        </div>
        <div style={{ fontSize: 11, color: '#aaa' }}>PNG, JPG, WEBP - Tối đa 10 ảnh, mỗi ảnh &lt; 5MB</div>
      </div>

      <h2 className={styles.sectionTitle} style={{ marginTop: 16 }}>Tiện ích phòng</h2>
      <div className={styles.checkboxGrid}>
        {AMENITIES.map((item) => (
          <label key={item} className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              checked={selectedAmenities.includes(item)}
              onChange={() => handleToggle(item)}
            />
            {item}
          </label>
        ))}
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.backBtn} onClick={goBack}>Quay lại</button>
        <button type="submit" className={styles.nextBtn}>Tiếp theo</button>
      </div>
    </form>
  );
};

export default StepAmenities;
