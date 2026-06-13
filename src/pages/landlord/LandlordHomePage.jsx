import LandlordProfileForm from '../../features/landlord/components/LandlordProfileForm';
import styles from './LandlordPageShared.module.css';

const LandlordHomePage = () => {
  return (
    <div className={styles.page}>
      <LandlordProfileForm />
    </div>
  );
};

export default LandlordHomePage;
