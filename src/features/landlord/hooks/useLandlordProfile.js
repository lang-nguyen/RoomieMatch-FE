import { useState } from 'react';
import { useGetLandlordProfileQuery, useUpdateLandlordProfileMutation } from '../api/landlordApiMock';
import { getApiErrorMessage } from '../../../shared/utils/getApiErrorMessage';

export const useLandlordProfile = () => {
  const { data, isLoading, isError } = useGetLandlordProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateLandlordProfileMutation();

  const profile = data?.profile ?? null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Khởi tạo formData từ profile khi bắt đầu edit
  const startEditing = () => {
    if (profile) {
      setFormData({ ...profile });
    }
    setIsEditing(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData(null);
    setErrorMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      await updateProfile(formData).unwrap();
      setSuccessMessage('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
      setFormData(null);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err, 'Cập nhật thất bại'));
    }
  };

  return {
    profile,
    isLoading,
    isError,
    isEditing,
    formData,
    isUpdating,
    successMessage,
    errorMessage,
    startEditing,
    cancelEditing,
    handleChange,
    handleSave,
  };
};
