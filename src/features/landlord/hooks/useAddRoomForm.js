import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAddRoomMutation } from '../api/landlordApiMock';
import { setAddRoomStep, setAddRoomDraft, clearAddRoomDraft, selectAddRoomStep, selectAddRoomDraft } from '../slice';
import { getApiErrorMessage } from '../../../shared/utils/getApiErrorMessage';

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
      await addRoom(draft).unwrap();
      setSuccessMessage('Thêm phòng trọ thành công!');
      dispatch(clearAddRoomDraft());
      setTimeout(() => navigate('/landlord/rooms'), 900);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Thêm phòng thất bại'));
    }
  };

  const handleCancel = () => {
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
