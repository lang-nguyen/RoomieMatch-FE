import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddRoomForm from '../../features/landlord/components/AddRoomForm/AddRoomForm';
import { clearAddRoomDraft } from '../../features/landlord/slice';
import sharedStyles from './LandlordPageShared.module.css';

const LandlordAddRoomPage = () => {
  const dispatch = useDispatch();
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) {
      dispatch(clearAddRoomDraft());
    }
  }, [dispatch, roomId]);

  return (
    <div className={sharedStyles.page}>
      <AddRoomForm />
    </div>
  );
};

export default LandlordAddRoomPage;
