import { useEffect, useMemo, useState } from 'react';
import { Upload } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAddRoomForm } from '../../hooks/useAddRoomForm';
import { useDeleteLandlordRoomImageMutation } from '../../api/landlordApi';
import ConfirmModal from '../../../../shared/components/ConfirmModal';
import { getAddRoomImageFiles, setAddRoomImageFiles } from '../../utils/addRoomImageFiles';
import styles from './StepForm.module.css';

const AMENITIES = [
  'May lanh',
  'Quat tran',
  'May suoi',
  'Voi sen',
  'Bon tam',
  'WC rieng',
  'Nuoc nong',
  'Giuong',
  'Tu quan ao',
  'TV',
  'Bep nau',
  'Tu lanh',
  'May giat',
  'Wifi',
  'Camera an ninh',
];

const StepAmenities = () => {
  const { draft, updateDraft, goNext, goBack } = useAddRoomForm();
  const { roomId } = useParams();
  const [deleteRoomImage, deleteImageState] = useDeleteLandlordRoomImageMutation();
  const [imageError, setImageError] = useState('');
  const [pendingRemoval, setPendingRemoval] = useState(null);

  const selectedAmenities = useMemo(() => draft.amenities || [], [draft.amenities]);
  const selectedImageMeta = useMemo(() => draft.image_files_meta || [], [draft.image_files_meta]);
  const selectedImages = getAddRoomImageFiles();
  const existingImages = draft.existing_images || [];
  const previews = useMemo(
    () => selectedImages.map((file) => ({ file, url: URL.createObjectURL(file) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedImageMeta],
  );

  useEffect(() => () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  const handleToggle = (item) => {
    const newSelected = selectedAmenities.includes(item)
      ? selectedAmenities.filter((a) => a !== item)
      : [...selectedAmenities, item];
    updateDraft({ amenities: newSelected });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = [];
    const invalid = [];

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        invalid.push(`${file.name}: khong phai file anh`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        invalid.push(`${file.name}: vuot qua 5MB`);
        return;
      }
      validFiles.push(file);
    });

    const nextImages = [...selectedImages, ...validFiles].slice(0, 10);
    setAddRoomImageFiles(nextImages);
    updateDraft({
      image_files_meta: nextImages.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    });
    setImageError(invalid.join('. '));
    event.target.value = '';
  };

  const removeLocalImage = (index) => {
    const nextImages = selectedImages.filter((_, itemIndex) => itemIndex !== index);
    setAddRoomImageFiles(nextImages);
    updateDraft({
      image_files_meta: nextImages.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    });
  };

  const removeExistingImage = async (image) => {
    await deleteRoomImage({ roomId, imageId: image.id }).unwrap();
    updateDraft({ existing_images: existingImages.filter((item) => item.id !== image.id) });
  };

  const handleNext = (e) => {
    e.preventDefault();
    goNext();
  };

  return (
    <form className={styles.formContainer} onSubmit={handleNext}>
      <h2 className={styles.sectionTitle}>Hinh anh phong tro</h2>
      <label className={styles.uploadBox}>
        <Upload className={styles.uploadIcon} size={28} />
        <div className={styles.uploadText}>
          <span>Chon anh phong</span> de tai len Cloudinary khi luu
        </div>
        <div style={{ fontSize: 11, color: '#aaa' }}>PNG, JPG, WEBP - Toi da 10 anh, moi anh &lt; 5MB</div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className={styles.fileInput}
          onChange={handleImageChange}
        />
      </label>

      {imageError ? <div className={styles.errorText}>{imageError}</div> : null}

      {previews.length > 0 ? (
        <div className={styles.previewGrid}>
          {previews.map((preview, index) => (
            <div key={`${preview.file.name}-${preview.file.size}-${index}`} className={styles.previewItem}>
              <img src={preview.url} alt={preview.file.name} />
              <button type="button" onClick={() => setPendingRemoval({ type: 'local', index })}>Xoa</button>
            </div>
          ))}
        </div>
      ) : null}

      {existingImages.length > 0 && (
        <div className={styles.previewGrid}>
          {existingImages.map((image) => (
            <div key={image.id} className={styles.previewItem}>
              <img src={image.image_url} alt="Anh phong hien co" />
              <button
                type="button"
                disabled={deleteImageState.isLoading}
                onClick={() => setPendingRemoval({ type: 'existing', image })}
              >
                Xoa
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className={styles.sectionTitle} style={{ marginTop: 16 }}>Tien ich phong</h2>
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
        <button type="button" className={styles.backBtn} onClick={goBack}>Quay lai</button>
        <button type="submit" className={styles.nextBtn}>Tiep theo</button>
      </div>

      <ConfirmModal
        isOpen={Boolean(pendingRemoval)}
        title="Xac nhan xoa anh phong"
        message="Ban co chac muon xoa anh nay khoi phong tro?"
        confirmText="Xoa anh"
        cancelText="Huy"
        onCancel={() => setPendingRemoval(null)}
        onClose={() => setPendingRemoval(null)}
        onConfirm={async () => {
          if (pendingRemoval?.type === 'local') {
            removeLocalImage(pendingRemoval.index);
          }
          if (pendingRemoval?.type === 'existing') {
            await removeExistingImage(pendingRemoval.image);
          }
          setPendingRemoval(null);
        }}
      />
    </form>
  );
};

export default StepAmenities;
