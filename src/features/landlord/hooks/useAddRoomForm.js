import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAddRoomMutation } from '../api/landlordApi';
import { setAddRoomStep, setAddRoomDraft, clearAddRoomDraft, selectAddRoomStep, selectAddRoomDraft } from '../slice';
import { getApiErrorMessage } from '../../../shared/utils/getApiErrorMessage';
import { clearAddRoomImageFiles, getAddRoomImageFiles } from '../utils/addRoomImageFiles';

const TOTAL_STEPS = 4;

export const useAddRoomForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentStep = useSelector(selectAddRoomStep);
  const draft = useSelector(selectAddRoomDraft);

  const [addRoom, { isLoading: isSubmitting }] = useAddRoomMutation();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const updateDraft = (data) => dispatch(setAddRoomDraft(data));

  const goNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      dispatch(setAddRoomStep(currentStep + 1));
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      dispatch(setAddRoomStep(currentStep - 1));
    }
  };

  const goToStep = (step) => {
    dispatch(setAddRoomStep(step));
  };

  const handleSubmit = async () => {
    if (!draft) return;
    setError('');
    try {
      await addRoom({
        payload: buildRoomPayload(draft),
        images: getAddRoomImageFiles(),
        publish: true,
      }).unwrap();
      setSuccessMessage('Thêm phòng trọ thành công!');
      clearAddRoomImageFiles();
      dispatch(clearAddRoomDraft());
      setTimeout(() => navigate('/landlord/rooms'), 900);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Thêm phòng thất bại'));
    }
  };

  const handleCancel = () => {
    clearAddRoomImageFiles();
    dispatch(clearAddRoomDraft());
    navigate('/landlord/rooms');
  };

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    draft: draft ?? {},
    isSubmitting,
    error,
    successMessage,
    updateDraft,
    goNext,
    goBack,
    goToStep,
    handleSubmit,
    handleCancel,
  };
};

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const toIntOrDefault = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const buildRoomPayload = (draft) => {
  const street = draft.address || draft.street || '';
  const fullAddress = [street, draft.ward, draft.district, draft.city].filter(Boolean).join(', ');

  return {
    title: draft.name || draft.title || '',
    room_type: draft.room_type || null,
    area: toNumberOrNull(draft.area),
    max_people: toIntOrDefault(draft.capacity, 1),
    current_people: toIntOrDefault(draft.current_people, 0),
    bedroom_count: draft.bedroom_count === 'Studio' ? 1 : toIntOrDefault(draft.bedroom_count, 1),
    description: draft.description || null,
    city: draft.city || null,
    district: draft.district || null,
    ward: draft.ward || null,
    street,
    full_address: fullAddress || street || null,
    latitude: toNumberOrNull(draft.lat || draft.latitude),
    longitude: toNumberOrNull(draft.lng || draft.longitude),
    price: toIntOrDefault(draft.price, 0),
    deposit: toNumberOrNull(draft.deposit),
    electricity_price: toNumberOrNull(draft.electricity_price),
    water_price: toNumberOrNull(draft.water_price),
    internet_price: toNumberOrNull(draft.internet_price),
    parking_price: toNumberOrNull(draft.parking_price),
    status: draft.status || 'available',
    contact_name: draft.contact_name || null,
    contact_phone: draft.contact_phone || null,
    contact_social: draft.contact_social || null,
    amenities: draft.amenities || [],
  };
};
