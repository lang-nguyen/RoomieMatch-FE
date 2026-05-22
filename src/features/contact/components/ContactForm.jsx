import { useMemo, useState } from 'react';

const ContactForm = ({ topics }) => {
  const [activeTopic, setActiveTopic] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fields, setFields] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!fields.lastName.trim()) nextErrors.lastName = true;
    if (!fields.firstName.trim()) nextErrors.firstName = true;
    if (!fields.email.trim()) nextErrors.email = true;
    if (!fields.message.trim()) nextErrors.message = true;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSuccess(false);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFields({
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        message: ''
      });
      setFileName('');
    }, 1200);
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(`${file.name} (${Math.round(file.size / 1024)} KB)`);
  };

  const topicButtons = useMemo(
    () =>
      topics.map((topic, index) => (
        <button
          key={topic}
          type="button"
          className={`contact-topic ${activeTopic === index ? 'active' : ''}`}
          onClick={() => setActiveTopic(index)}
        >
          {topic}
        </button>
      )),
    [activeTopic, topics]
  );

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-title">
        <span className="contact-form-title-icon">💬</span>
        Gửi tin nhắn
      </div>

      <div className="contact-row">
        <div className="contact-field">
          <label>Họ</label>
          <input
            name="lastName"
            value={fields.lastName}
            onChange={handleChange}
            placeholder="Nguyễn"
            className={errors.lastName ? 'contact-field-error' : ''}
          />
        </div>
        <div className="contact-field">
          <label>Tên</label>
          <input
            name="firstName"
            value={fields.firstName}
            onChange={handleChange}
            placeholder="Văn An"
            className={errors.firstName ? 'contact-field-error' : ''}
          />
        </div>
      </div>

      <div className="contact-row">
        <div className="contact-field">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="you@email.com"
            className={errors.email ? 'contact-field-error' : ''}
          />
        </div>
        <div className="contact-field">
          <label>Số điện thoại</label>
          <input
            name="phone"
            value={fields.phone}
            onChange={handleChange}
            placeholder="+84 xxx xxx xxx"
          />
        </div>
      </div>

      <div className="contact-field">
        <label>Chủ đề hỗ trợ</label>
        <div className="contact-topic-grid">{topicButtons}</div>
      </div>

      <div className="contact-field">
        <label>Nội dung</label>
        <textarea
          name="message"
          value={fields.message}
          onChange={handleChange}
          placeholder="Mô tả chi tiết vấn đề bạn cần được hỗ trợ..."
          className={errors.message ? 'contact-field-error' : ''}
        />
      </div>

      <div className="contact-divider" />

      <label className="contact-upload">
        <input type="file" accept="image/*,.pdf" onChange={handleFile} />
        <div className="contact-upload-icon">⬆</div>
        <div className="contact-upload-text">
          <strong>{fileName || 'Đính kèm ảnh hoặc tài liệu'}</strong>
          PNG, JPG, PDF · Tối đa 5MB mỗi file
        </div>
      </label>

      <button className="contact-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
        <span>→</span>
      </button>

      {success && (
        <div className="contact-success">
          ✓ Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ lại trong vòng 24 giờ.
        </div>
      )}
    </form>
  );
};

export default ContactForm;
