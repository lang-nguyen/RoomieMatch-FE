import AddRoomForm from '../../features/landlord/components/AddRoomForm/AddRoomForm';
import sharedStyles from './LandlordPageShared.module.css';

const LandlordAddRoomPage = () => {
  return (
    <div className={sharedStyles.page}>
      <AddRoomForm />
    </div>
  );
};

export default LandlordAddRoomPage;
