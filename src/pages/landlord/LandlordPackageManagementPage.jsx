import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useGetLandlordPackageHistoryQuery } from '../../features/landlord/api/landlordApi';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import styles from './LandlordPackageManagementPage.module.css';

const formatMoney = (value) => `${value.toLocaleString('vi-VN')} VND`;
const formatDate = (value) => new Intl.DateTimeFormat('vi-VN').format(new Date(value));

const LandlordPackageManagementPage = () => {
  const { data, isLoading } = useGetLandlordPackageHistoryQuery();
  const history = data?.items ?? [];

  return (
    <div className={styles.page}>
      <LandlordPageHeader
        icon={Package}
        title="Quản lý gói"
        subtitle="Theo dõi lịch sử mua, thời hạn và trạng thái các gói đang sử dụng"
      />

      <section className={styles.section}>
        <h2>Lịch sử mua</h2>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Gói</th>
                <th>Giá</th>
                <th>Ngày mua</th>
                <th>Ngày đến hạn</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className={styles.empty}>Đang tải lịch sử mua...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="6" className={styles.empty}>Chưa có lịch sử mua gói.</td></tr>
              ) : history.map((item) => (
                <tr key={item.id}>
                  <td className={styles.packageName}>{item.packageName}</td>
                  <td>{formatMoney(item.price)}</td>
                  <td className={styles.date}>{formatDate(item.purchaseDate)}</td>
                  <td>{formatDate(item.expiredDate)}</td>
                  <td>{item.status === 'active' ? 'Đang kích hoạt' : item.status}</td>
                  <td>
                    <Link className={styles.detailLink} to={`/landlord/package-management/${item.id}`}>
                      Chi tiết
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
