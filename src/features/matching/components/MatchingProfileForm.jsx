import { useMemo, useState } from 'react';
import { Camera, CheckCircle2 } from 'lucide-react';
import { emptyProfileForm } from '../models/matchingModels';

const requiredFields = ['avatar', 'intro', 'habits', 'area', 'budget'];

const MatchingProfileForm = ({ initialData, onSubmit }) => {
  const [formValues, setFormValues] = useState(() => initialData || emptyProfileForm);
  const [touched, setTouched] = useState({});

  const errors = useMemo(() => {
    return requiredFields.reduce((result, field) => {
      if (!String(formValues[field] || '').trim()) {
        result[field] = 'Vui lòng nhập đầy đủ thông tin';
      } else if (field === 'budget') {
        const budgetRegex = /^\d+-\d+$/;
        if (!budgetRegex.test(formValues.budget.trim())) {
          result[field] = 'Ngân sách phải nhập đúng định dạng min-max (VD: 1000000-5000000)';
        }
      }

      return result;
    }, {});
  }, [formValues]);

  const updateField = (field, value) => {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const markTouched = (field) => {
    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    updateField('avatar', URL.createObjectURL(file));
    markTouched('avatar');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(requiredFields.reduce((result, field) => ({ ...result, [field]: true }), {}));

    if (Object.keys(errors).length > 0) return;

    const payload = {
      account_id: 0,
      image: formValues.avatar,
      introduce: formValues.intro,
      habit: formValues.habits.split(',').map((h) => h.trim()).filter(Boolean),
      location: formValues.area,
      budget: formValues.budget.trim(),
      is_matching: true,
    };

    onSubmit(payload);
  };

  const getFieldClassName = (field) =>
    touched[field] && errors[field] ? 'matching-field is-invalid' : 'matching-field';

  return (
    <form className="matching-profile-form matching-panel-pop" onSubmit={handleSubmit}>
      <h2>Hồ sơ tìm bạn</h2>

      <label className={`matching-upload ${touched.avatar && errors.avatar ? 'is-invalid' : ''}`}>
        {formValues.avatar ? (
          <img src={formValues.avatar} alt="Ảnh hồ sơ cá nhân" />
        ) : (
          <>
            <Camera size={58} strokeWidth={2.4} />
            <strong>Tải ảnh hồ sơ cá nhân</strong>
          </>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>

      <label className={getFieldClassName('intro')}>
        <span className="matching-field-legend">Giới thiệu</span>
        <textarea
          name="intro"
          value={formValues.intro}
          placeholder="Nhập thông tin giới thiệu cơ bản về bản thân"
          onBlur={() => markTouched('intro')}
          onChange={(event) => updateField('intro', event.target.value)}
        />
      </label>

      <label className={getFieldClassName('habits')}>
        <span className="matching-field-legend">Thói quen</span>
        <input
          name="habits"
          value={formValues.habits}
          placeholder="Nhập thói quen của bản thân"
          onBlur={() => markTouched('habits')}
          onChange={(event) => updateField('habits', event.target.value)}
        />
      </label>

      <label className={getFieldClassName('area')}>
        <span className="matching-field-legend">Khu vực</span>
        <input
          name="area"
          value={formValues.area}
          placeholder="Nhập khu vực bạn muốn tìm"
          onBlur={() => markTouched('area')}
          onChange={(event) => updateField('area', event.target.value)}
        />
      </label>

      <label className={getFieldClassName('budget')}>
        <span className="matching-field-legend">Ngân sách</span>
        <input
          name="budget"
          value={formValues.budget}
          placeholder="Nhập ngân sách dạng min-max (VD: 1000000-5000000)"
          onBlur={() => markTouched('budget')}
          onChange={(event) => updateField('budget', event.target.value)}
        />
      </label>

      {Object.keys(touched).length > 0 && Object.keys(errors).length > 0 && (
        <div className="matching-form-error">
          <p>Vui lòng kiểm tra lại thông tin:</p>
          <ul>
            {Object.entries(errors)
              .filter(([field]) => touched[field])
              .map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
          </ul>
        </div>
      )}

      <button className="matching-confirm-button" type="submit">
        <CheckCircle2 size={22} />
        Xác nhận
      </button>
    </form>
  );
};

export default MatchingProfileForm;
