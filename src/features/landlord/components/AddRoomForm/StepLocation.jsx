import { useAddRoomForm } from '../../hooks/useAddRoomForm';
import { useGetProvincesQuery, useGetDistrictsByProvinceNameQuery } from '../../../../shared/api/provincesApi';
import styles from './StepForm.module.css';

const StepLocation = () => {
  const { draft, updateDraft, goNext, goBack } = useAddRoomForm();

  const { data: provinceOptions = [] } = useGetProvincesQuery();
  const { data: districtOptions = [] } = useGetDistrictsByProvinceNameQuery(draft.city, {
    skip: !draft.city,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateDraft({ 
      [name]: value,
      // Reset district if city changes
      ...(name === 'city' ? { district: '' } : {}) 
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    goNext();
  };

  return (
    <form className={styles.formContainer} onSubmit={handleNext}>
      <h2 className={styles.sectionTitle}>Địa chỉ phòng trọ</h2>
      
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tỉnh / Thành phố <span className={styles.required}>*</span></label>
          <select 
            required
            name="city"
            value={draft.city || ''}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Chọn tỉnh / thành phố</option>
            {provinceOptions.map(p => (
              <option key={p.value} value={p.label}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Quận / Huyện <span className={styles.required}>*</span></label>
          <select 
            required
            name="district"
            value={draft.district || ''}
            onChange={handleChange}
            className={styles.select}
            disabled={!draft.city}
          >
            <option value="">Chọn quận / huyện</option>
            {districtOptions.map(d => (
              <option key={d.value} value={d.label}>{d.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Địa chỉ chi tiết (Số nhà, Tên đường) <span className={styles.required}>*</span></label>
        <input 
          required
          name="address"
          value={draft.address || ''}
          onChange={handleChange}
          placeholder="VD: 123/4A Lê Lợi" 
          className={styles.input} 
        />
      </div>

      <h2 className={styles.sectionTitle} style={{ marginTop: 16 }}>Giá tiền</h2>
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Giá thuê / tháng (VNĐ) <span className={styles.required}>*</span></label>
          <input 
            required
            type="number"
            name="price"
            value={draft.price || ''}
            onChange={handleChange}
            placeholder="VD: 2500000" 
            className={styles.input} 
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tiền đặt cọc (VNĐ)</label>
          <input 
            type="number"
            name="deposit"
            value={draft.deposit || ''}
            onChange={handleChange}
            placeholder="VD: 2500000" 
            className={styles.input} 
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.backBtn} onClick={goBack}>Quay lại</button>
        <button type="submit" className={styles.nextBtn}>Tiếp theo</button>
      </div>
    </form>
  );
};

export default StepLocation;
