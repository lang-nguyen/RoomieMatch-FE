import { Outlet } from 'react-router-dom';
import Header from '../shared/components/Header';

const RootLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default RootLayout;
