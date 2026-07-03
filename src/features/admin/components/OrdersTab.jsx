import { useMemo, useState } from 'react';
import { useDeleteOrderMutation, useGetOrdersQuery, useUpdateOrderStatusMutation } from '../api/adminApi';
import { AdminIcon } from './adminIconMap';
import { formatCurrency, formatNumber, normalizeText, paginate } from './adminFeatureUtils';
import styles from './AdminDashboard.module.css';

const orderTabs = [
  { id: '', label: 'Tất cả' },
  { id: 'success', label: 'Thành công' },
  { id: 'pending', label: 'Chờ thanh toán' },
  { id: 'failed', label: 'Thất bại' },
];

const statusText = {
  success: 'Thành công',
  pending: 'Chờ thanh toán',
  failed: 'Thất bại',
};

const flowSteps = ['pending', 'success'];

export const OrdersTab = () => {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: orders = [], isLoading, refetch } = useGetOrdersQuery({ status });
  const { data: allOrders = [] } = useGetOrdersQuery({});
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeletingOrder }] = useDeleteOrderMutation();

  const filteredOrders = useMemo(() => {
    let result = orders;
    const keyword = normalizeText(search);
    if (keyword) {
      result = result.filter((order) =>
        [order.id, order.username, order.email, order.packageName].some((value) => normalizeText(value).includes(keyword))
      );
    }
    if (searchDate) {
      const [year, month, day] = searchDate.split('-');
      const formattedSearchDate = `${day}/${month}/${year}`;
      result = result.filter(order => order.date === formattedSearchDate);
    }
    return result;
  }, [orders, search, searchDate]);
  const paged = paginate(filteredOrders, page, 6);

  const stats = useMemo(
    () => [
      { label: 'Tổng đơn', value: allOrders.length, icon: 'shopping-cart' },
      { label: 'Doanh thu', value: allOrders.filter((order) => order.status === 'success').reduce((sum, order) => sum + order.price, 0), icon: 'dollar-sign', currency: true },
      { label: 'Chờ thanh toán', value: allOrders.filter((order) => order.status === 'pending').length, icon: 'activity' },
      { label: 'Thất bại', value: allOrders.filter((order) => order.status === 'failed').length, icon: 'x-circle' },
    ],
    [allOrders]
  );
  const pendingValue = useMemo(
    () => allOrders.filter((order) => order.status === 'pending').reduce((sum, order) => sum + order.price, 0),
    [allOrders]
  );

  const handleStatus = async (id, nextStatus) => {
    try {
      const response = await updateOrderStatus({ id, status: nextStatus }).unwrap();
      setSelectedOrder((current) =>
        current?.id === id
          ? { ...current, status: nextStatus, statusLabel: response?.statusLabel || statusText[nextStatus] }
          : current
      );
      refetch();
    } catch (error) {
      console.error('Failed to update order status', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;

    try {
      await deleteOrder(id).unwrap();
      setSelectedOrder((current) => (current?.id === id ? null : current));
      refetch();
    } catch (error) {
      console.error('Failed to delete order', error);
      alert('Có lỗi xảy ra khi xóa đơn hàng.');
    }
  };

  const isMutatingOrder = isUpdatingStatus || isDeletingOrder;

  return (
    <div className={styles.featureStack}>
      <section className={styles.featureStatsGrid}>
        {stats.map((item) => (
          <article key={item.label} className={styles.featureStatCard}>
            <span className={styles.featureStatIcon}>
              <AdminIcon name={item.icon} size={18} />
            </span>
            <div>
              <p>{item.label}</p>
              <strong>{item.currency ? formatCurrency(item.value) : formatNumber(item.value)}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.insightGrid}>
        <article className={`${styles.insightCard} ${styles.insightCardAccent}`}>
          <div>
            <span className={styles.insightLabel}>Doanh thu chờ ghi nhận</span>
            <strong>{formatCurrency(pendingValue)}</strong>
            <p>Các giao dịch pending có thể chuyển thành doanh thu sau xác nhận</p>
          </div>
          <span className={styles.insightIcon}>
            <AdminIcon name="circle-dollar-sign" size={20} />
          </span>
        </article>
        <article className={styles.insightCard}>
          <div>
            <span className={styles.insightLabel}>Tỷ lệ thành công</span>
            <strong>
              {allOrders.length ? Math.round((allOrders.filter((order) => order.status === 'success').length / allOrders.length) * 100) : 0}%
            </strong>
            <p>{formatNumber(allOrders.filter((order) => order.status === 'success').length)} giao dịch đã thanh toán</p>
          </div>
          <span className={styles.insightIcon}>
            <AdminIcon name="check" size={20} />
          </span>
        </article>
      </section>

      <section className={styles.featurePanel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Giao dịch gói dịch vụ</h2>
            <p>Theo dõi thanh toán, doanh thu và trạng thái đơn hàng</p>
          </div>
          <div className={styles.tabGroup}>
            {orderTabs.map((tab) => (
              <button
                key={tab.id || 'all'}
                type="button"
                className={`${styles.tabButton} ${status === tab.id ? styles.tabButtonActive : ''}`}
                onClick={() => {
                  setStatus(tab.id);
                  setPage(1);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.toolbar}>
          <label className={`${styles.controlWithIcon} ${styles.orderSearchControl}`}>
            <AdminIcon name="search" size={15} />
            <input
              type="search"
              placeholder="Tìm mã đơn, người dùng, email hoặc tên gói..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <label className={styles.controlWithIcon}>
            <input
              type="date"
              value={searchDate}
              onChange={(event) => {
                setSearchDate(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <span className={styles.toolbarHint}>{formatNumber(filteredOrders.length)} giao dịch phù hợp</span>
        </div>

        <div className={styles.tableScroller}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Gói</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7">Đang tải đơn hàng...</td>
                </tr>
              ) : paged.items.length ? (
                paged.items.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <strong>{order.username}</strong>
                      <span className={styles.subText}>{order.email}</span>
                    </td>
                    <td>
                      <strong>{order.packageName}</strong>
                      <span className={styles.subText}>{formatCurrency(order.price)}</span>
                    </td>
                    <td>
                      <div className={`${styles.flowSteps} ${order.status === 'failed' ? styles.flowStepsFailed : ''}`}>
                        {flowSteps.map((step) => (
                          <span
                            key={step}
                            className={`${styles.flowStep} ${
                              order.status === 'success' || order.status === step ? styles.flowStepActive : ''
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.dataBadge} ${
                          order.status === 'success' ? styles.badgeSuccess : order.status === 'pending' ? styles.badgeWarning : styles.badgeDanger
                        }`}
                      >
                        {order.statusLabel || statusText[order.status]}
                      </span>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button type="button" className={styles.actionButton} title="Xem chi tiết" onClick={() => setSelectedOrder(order)}>
                          <AdminIcon name="eye" size={14} />
                        </button>
                        <button type="button" className={styles.actionButton} title="Thành công" disabled={isMutatingOrder || order.status === 'success'} onClick={() => handleStatus(order.id, 'success')}>
                          <AdminIcon name="check" size={14} />
                        </button>
                        <button type="button" className={styles.actionButton} title="Thất bại" disabled={isMutatingOrder || order.status === 'failed'} onClick={() => handleStatus(order.id, 'failed')}>
                          <AdminIcon name="x-circle" size={14} />
                        </button>
                        <button type="button" className={styles.actionButton} title="Xóa" disabled={isMutatingOrder} onClick={() => handleDelete(order.id)}>
                          <AdminIcon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Không có đơn hàng phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationWrap}>
          <span>
            Trang {paged.page}/{paged.totalPages}
          </span>
          <div>
            <button type="button" disabled={paged.page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              Trước
            </button>
            <button
              type="button"
              disabled={paged.page === paged.totalPages}
              onClick={() => setPage((value) => Math.min(paged.totalPages, value + 1))}
            >
              Sau
            </button>
          </div>
        </div>
      </section>

      {selectedOrder && (
        <div className={styles.modalOverlay} role="presentation" onMouseDown={() => setSelectedOrder(null)}>
          <section className={styles.modalCard} onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Chi tiết đơn hàng</h2>
                <p>{selectedOrder.id} - {selectedOrder.username}</p>
              </div>
              <button type="button" className={styles.actionButton} onClick={() => setSelectedOrder(null)}>
                <AdminIcon name="close" size={15} />
              </button>
            </div>

            <div className={styles.detailGrid}>
              <article>
                <span>Mã đơn</span>
                <strong>{selectedOrder.id}</strong>
              </article>
              <article>
                <span>Trạng thái</span>
                <strong>{selectedOrder.statusLabel || statusText[selectedOrder.status]}</strong>
              </article>
              <article>
                <span>Khách hàng</span>
                <strong>{selectedOrder.username}</strong>
              </article>
              <article>
                <span>Email</span>
                <strong>{selectedOrder.email}</strong>
              </article>
              <article>
                <span>Gói dịch vụ</span>
                <strong>{selectedOrder.packageName}</strong>
              </article>
              <article>
                <span>Số tiền</span>
                <strong>{formatCurrency(selectedOrder.price)}</strong>
              </article>
              <article>
                <span>Ngày giao dịch</span>
                <strong>{selectedOrder.date}</strong>
              </article>
              <article>
                <span>Thanh toán</span>
                <strong>{selectedOrder.status === 'success' ? 'Đã ghi nhận' : selectedOrder.status === 'pending' ? 'Chờ xác nhận' : 'Không thành công'}</strong>
              </article>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.buttonSmall}
                disabled={isMutatingOrder || selectedOrder.status === 'failed'}
                onClick={() => handleStatus(selectedOrder.id, 'failed')}
              >
                <AdminIcon name="x-circle" size={13} />
                Đánh dấu thất bại
              </button>
              <button
                type="button"
                className={`${styles.buttonSmall} ${styles.buttonPrimary}`}
                disabled={isMutatingOrder || selectedOrder.status === 'success'}
                onClick={() => handleStatus(selectedOrder.id, 'success')}
              >
                <AdminIcon name="check" size={13} />
                Xác nhận thành công
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
