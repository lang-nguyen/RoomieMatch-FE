import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './PostFormModal.module.css';

const PostFormModal = ({ open, onClose, onSubmit, isSaving = false }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Hảo');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (title.trim().length < 8) {
      setError('Tiêu đề cần ít nhất 8 ký tự.');
      return;
    }

    setError('');
    await onSubmit?.({ title: title.trim(), author: author.trim() || 'Hảo' });
    setTitle('');
    setAuthor('Hảo');
  };

  return (
    <div className={styles.backdrop} role="presentation">
      <form className={styles.modal} onSubmit={handleSubmit}>
        <div className={styles.head}>
          <div>
            <h2>Thêm bài đăng</h2>
            <p>Tạo bài mới và đưa vào trạng thái chờ duyệt.</p>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Đóng">
            <X size={17} />
          </button>
        </div>

        <label className={styles.field}>
          <span>Tiêu đề</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ví dụ: Phòng trọ gần Đại học Quốc Gia giá tốt"
          />
        </label>

        <label className={styles.field}>
          <span>Tác giả</span>
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Tên người đăng"
          />
        </label>

        {error ? <div className={styles.error}>{error}</div> : null}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className={styles.submit} disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Tạo bài'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostFormModal;
