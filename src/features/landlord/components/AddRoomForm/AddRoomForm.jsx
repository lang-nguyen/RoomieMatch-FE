import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAddRoomForm } from '../../hooks/useAddRoomForm';
import StepBasicInfo from './StepBasicInfo';
import StepAmenities from './StepAmenities';
import StepLocation from './StepLocation';
import StepConfirm from './StepConfirm';
import styles from './AddRoomForm.module.css';

const STEPS = [
  { id: 0, label: 'Thông tin cơ bản' },
  { id: 1, label: 'Hình ảnh & Tiện ích' },
  { id: 2, label: 'Vị trí & Lân cận' },
  { id: 3, label: 'Xác nhận' },
];

const AddRoomForm = () => {
  const navigate = useNavigate();
  const { currentStep, goToStep } = useAddRoomForm();

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepBasicInfo />;
      case 1: return <StepAmenities />;
      case 2: return <StepLocation />;
      case 3: return <StepConfirm />;
      default: return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Thêm Trợ Mới</h1>
          <p className={styles.subtitle}>Điền đầy đủ thông tin để tạo hồ sơ phòng trọ</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.backBtn} onClick={() => navigate('/landlord/rooms')}>
            <ChevronLeft size={16} /> Quay lại
          </button>
          <button className={styles.saveBtn}>Lưu phòng trọ</button>
        </div>
      </div>

      {/* Stepper */}
      <div className={styles.stepper}>
        {STEPS.map((step, idx) => (
          <div key={step.id} className={styles.stepWrapper}>
            <button
              className={`${styles.stepIndicator} ${currentStep === step.id ? styles.stepActive : ''} ${currentStep > step.id ? styles.stepCompleted : ''}`}
              onClick={() => currentStep > step.id && goToStep(step.id)}
              disabled={currentStep < step.id}
            >
              <div className={styles.stepCircle}>
                {currentStep > step.id ? '✓' : step.id + 1}
              </div>
              <span className={styles.stepLabel}>{step.label}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className={`${styles.stepLine} ${currentStep > step.id ? styles.stepLineActive : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className={styles.content}>
        {renderStep()}
      </div>
    </div>
  );
};

export default AddRoomForm;
