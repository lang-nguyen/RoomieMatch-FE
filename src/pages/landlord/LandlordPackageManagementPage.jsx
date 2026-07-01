import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useGetLandlordPackageHistoryQuery } from '../../features/landlord/api/landlordApi';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import styles from './LandlordPackageManagementPage.module.css';

const formatMoney = (value) => `${value.toLocaleString('vi-VN')} VND`;
const formatDate = (value) => new Intl.DateTimeFormat('vi-VN').format(new Date(value));
const getStatusLabel = (status) => {
  if (status === 'active') return 'Dang kich hoat';
  if (status === 'pending') return 'Dang cho xac nhan';
  if (status === 'failed') return 'Thanh toan that bai';
  if (status === 'cancelled') return 'Da huy';
  return status;
};

const LandlordPackageManagementPage = () => {
  const { data, isLoading } = useGetLandlordPackageHistoryQuery();
  const history = data?.items ?? [];

  return (
    <div className={styles.page}>
      <LandlordPageHeader
        icon={Package}
        title="Quan ly goi"
        subtitle="Theo doi lich su mua, thoi han va trang thai cac goi dang su dung"
      />

      <section className={styles.section}>
        <h2>Lich su mua</h2>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Goi</th>
                <th>Gia</th>
                <th>Ngay mua</th>
                <th>Ngay den han</th>
                <th>Trang thai</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className={styles.empty}>Dang tai lich su mua...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="6" className={styles.empty}>Chua co lich su mua goi.</td></tr>
              ) : history.map((item) => (
                <tr key={item.id}>
                  <td className={styles.packageName}>{item.packageName}</td>
                  <td>{formatMoney(item.price)}</td>
                  <td className={styles.date}>{formatDate(item.purchaseDate)}</td>
                  <td>{formatDate(item.expiredDate)}</td>
                  <td>{getStatusLabel(item.status)}</td>
                  <td>
                    <Link className={styles.detailLink} to={`/landlord/package-management/${item.id}`}>
                      Chi tiet
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default LandlordPackageManagementPage;
