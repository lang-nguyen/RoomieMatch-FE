import { useMemo, useState } from 'react';
import {
  useCreatePackageMutation,
  useDeletePackageMutation,
  useGetPackagesQuery,
  useUpdatePackageMutation,
  useUpdatePackageStatusMutation,
} from '../api/adminApi';
import { AdminIcon } from './adminIconMap';
import { formatCurrency, formatNumber, labelFromOptions, normalizeText } from './adminFeatureUtils';
import styles from './AdminDashboard.module.css';

const packageTabs = [
  { id: 'all', label: 'Tất cả' },
  { id: 'owner', label: 'Chủ trọ' },
  { id: 'tenant', label: 'Khách thuê' },
  { id: 'suspended', label: 'Tạm ngưng' },
];

const targetOptions = [
  { value: 'owner', label: 'Chủ trọ' },
  { value: 'tenant', label: 'Khách thuê' },
];

const statusOptions = [
  { value: 'active', label: 'Đang bán' },
  { value: 'suspended', label: 'Tạm ngưng' },
];

const emptyPackage = {
  name: '',
  icon: 'package',
  targetCustomer: 'owner',
  pricePerMonth: 99000,
  duration: '30 ngày',
  features: 'Hiển thị ưu tiên\nHỗ trợ duyệt nhanh',
  status: 'active',
};

const getPackageRevenue = (item) => item.totalPurchased * item.pricePerMonth;

export const PackagesTab = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [editingPackage, setEditingPackage] = useState(undefined);
  const [form, setForm] = useState(emptyPackage);
  const { data: responseData, isLoading, refetch } = useGetPackagesQuery();
  const allPackages = responseData?.items || responseData || [];
  const [createPackage] = useCreatePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const [updatePackageStatus] = useUpdatePackageStatusMutation();
  const [deletePackage] = useDeletePackageMutation();

  const filteredPackages = useMemo(() => {
    let result = allPackages;
    
    if (activeTab !== 'all') {
      result = result.filter(p => p.status === activeTab || p.targetCustomer === activeTab);
    }

    const keyword = normalizeText(search);
    if (!keyword) return result;

    return result.filter((item) =>
      [item.name, item.id, item.targetCustomerLabel, item.statusLabel].some((value) => normalizeText(value).includes(keyword))
    );
  }, [allPackages, search, activeTab]);

  const summary = useMemo(
    () => [
      { label: 'Tổng gói', value: allPackages.length, icon: 'package' },
      { label: 'Đang bán', value: allPackages.filter((item) => item.status === 'active').length, icon: 'check' },
      { label: 'Lượt mua', value: allPackages.reduce((sum, item) => sum + item.totalPurchased, 0), icon: 'shopping-cart' },
      { label: 'Doanh thu ước tính', value: allPackages.reduce((sum, item) => sum + getPackageRevenue(item), 0), icon: 'dollar-sign', currency: true },
    ],
    [allPackages]
  );
  const bestSeller = useMemo(
    () => [...allPackages].sort((first, second) => second.totalPurchased - first.totalPurchased)[0],
    [allPackages]
  );
  const maxPurchased = Math.max(...allPackages.map((item) => item.totalPurchased), 1);

  const openCreate = () => {
    setEditingPackage(null);
    setForm(emptyPackage);
  };

  const openEdit = (item) => {
    setEditingPackage(item);
    setForm({
      name: item.name,
      icon: item.icon,
      targetCustomer: item.targetCustomer,
      pricePerMonth: item.pricePerMonth,
      duration: item.duration,
      features: item.features.join('\n'),
      status: item.status,
    });
  };

  const closeModal = () => {
    setEditingPackage(undefined);
    setForm(emptyPackage);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const durationNum = form.duration.replace(/\D/g, '') || 30;
    
    // Generate a simple slug from name to satisfy BE validation
    const makeSlug = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    
    const payload = {
      name: form.name,
      icon: form.icon,
      targetCustomer: form.targetCustomer,
      price_cents: Number(form.pricePerMonth),
      period: `${durationNum}_days`,
      features_list: form.features
        .split('\n')
        .map((feature) => feature.trim())
        .filter(Boolean),
      active: form.status === 'active',
    };

    try {
      if (editingPackage) {
        const id = parseInt(editingPackage.id.replace(/\D/g, ''), 10);
        await updatePackage({ id, ...payload });
      } else {
        payload.slug = makeSlug(form.name) + '-' + Date.now();
        await createPackage(payload);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save package", error);
      alert("Có lỗi xảy ra khi lưu gói dịch vụ.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa gói này?")) return;
    try {
      const numericId = parseInt(id.replace(/\D/g, ''), 10);
      await deletePackage(numericId).unwrap();
    } catch (error) {
      if (error.status === 400) {
        alert(error.data?.detail || "Không thể xóa gói đã có người mua. Vui lòng Tạm ngưng thay vì xóa.");
      } else {
        alert("Có lỗi xảy ra khi xóa gói.");
      }
    }
  };

  const handleToggleStatus = async (item) => {
    const numericId = parseInt(item.id.replace(/\D/g, ''), 10);
    const isActive = item.status === 'active';
    await updatePackageStatus({
      id: numericId,
      active: !isActive
    });
  };

  return (
    <div className={styles.featureStack}>
      <section className={styles.featureStatsGrid}>
        {summary.map((item) => (
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
            <span className={styles.insightLabel}>Gói bán chạy</span>
            <strong>{bestSeller?.name || 'Chưa có dữ liệu'}</strong>
            <p>{bestSeller ? `${formatNumber(bestSeller.totalPurchased)} lượt mua` : 'Thêm gói để bắt đầu kinh doanh'}</p>
          </div>
          <span className={styles.insightIcon}>
            <AdminIcon name="shopping-cart" size={20} />
          </span>
        </article>
        <article className={styles.insightCard}>
          <div>
            <span className={styles.insightLabel}>Tỷ trọng khách hàng</span>
            <strong>{formatNumber(allPackages.filter((item) => item.targetCustomer === 'owner').length)} gói chủ trọ</strong>
            <p>{formatNumber(allPackages.filter((item) => item.targetCustomer === 'tenant').length)} gói dành cho khách thuê</p>
          </div>
          <span className={styles.insightIcon}>
            <AdminIcon name="users" size={20} />
          </span>
        </article>
      </section>

      <section className={styles.featurePanel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Gói dịch vụ</h2>
            <p>Thiết lập gói cho chủ trọ và khách thuê</p>
          </div>
          <button type="button" className={`${styles.buttonSmall} ${styles.buttonPrimary}`} onClick={openCreate}>
            <AdminIcon name="plus" size={14} />
            Thêm gói
          </button>
        </div>

        <div className={styles.tabGroup}>
          {packageTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.toolbar}>
          <label className={styles.controlWithIcon}>
            <AdminIcon name="search" size={15} />
            <input
              type="search"
              placeholder="Tìm tên gói, mã gói hoặc nhóm khách..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <span className={styles.toolbarHint}>{formatNumber(filteredPackages.length)} gói phù hợp</span>
        </div>

        <div className={styles.packageGrid}>
          {isLoading ? (
            <div className={styles.loadingState}>Đang tải gói dịch vụ...</div>
          ) : (
            filteredPackages.map((item) => (
              <article key={item.id} className={`${styles.packageCard} ${item.status === 'suspended' ? styles.packageCardMuted : ''}`}>
                <div className={styles.packageCardTop}>
                  <span className={styles.packageIcon}>
                    <AdminIcon name={item.icon} size={19} />
                  </span>
                  <span className={`${styles.dataBadge} ${item.targetCustomer === 'owner' ? styles.badgeInfo : styles.badgeSuccess}`}>
                    {item.targetCustomerLabel}
                  </span>
                </div>
                <h3>{item.name}</h3>
                <div className={styles.packagePrice}>
                  {formatCurrency(item.pricePerMonth)}
                  <span>/{item.duration}</span>
                </div>
                <div className={styles.packageMeter}>
                  <span style={{ width: `${Math.max(8, Math.round((item.totalPurchased / maxPurchased) * 100))}%` }} />
                </div>
                <ul>
                  {item.features.map((feature) => {
                    const featureTranslations = {
                      matching: 'Kết nối phòng',
                      chatbot: 'Hỗ trợ Chatbot AI',
                      priority_match: 'Ưu tiên ghép phòng',
                      vip_listing: 'Đăng tin nổi bật',
                    };
                    const displayFeature = featureTranslations[feature] || feature;
                    return (
                      <li key={feature}>
                        <AdminIcon name="check" size={14} />
                        {displayFeature}
                      </li>
                    );
                  })}
                </ul>
                <div className={styles.packageFooter}>
                  <div>
                    <span>{formatNumber(item.totalPurchased)}</span>
                    lượt mua
                  </div>
                  <div>
                    <span>{formatCurrency(getPackageRevenue(item))}</span>
                    doanh thu
                  </div>
                  <span className={`${styles.dataBadge} ${item.status === 'active' ? styles.badgeSuccess : styles.badgeDanger}`}>
                    {item.statusLabel}
                  </span>
                </div>
                <div className={styles.cardActionBar}>
                  <button type="button" className={styles.buttonSmall} onClick={() => openEdit(item)}>
                    <AdminIcon name="edit" size={13} />
                    Sửa
                  </button>
                  <button type="button" className={styles.buttonSmall} onClick={() => handleToggleStatus(item)}>
                    <AdminIcon name={item.status === 'active' ? 'x-circle' : 'check'} size={13} />
                    {item.status === 'active' ? 'Tạm ngưng' : 'Bật bán'}
                  </button>
                  <button type="button" className={styles.buttonSmall} onClick={() => handleDelete(item.id)}>
                    <AdminIcon name="trash" size={13} />
                    Xóa
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {editingPackage !== undefined && (
        <div className={styles.modalOverlay} role="presentation" onMouseDown={closeModal}>
          <form className={styles.modalCard} onSubmit={handleSave} onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.panelHeader}>
              <div>
                <h2>{editingPackage ? 'Sửa gói dịch vụ' : 'Thêm gói dịch vụ'}</h2>
                <p>Mỗi dòng tính năng sẽ hiển thị thành một bullet trong card</p>
              </div>
              <button type="button" className={styles.actionButton} onClick={closeModal}>
                <AdminIcon name="close" size={15} />
              </button>
            </div>
            <div className={styles.formGrid}>
              <label>
                Tên gói
                <input value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} required />
              </label>
              <label>
                Icon
                <select value={form.icon} onChange={(event) => setForm((value) => ({ ...value, icon: event.target.value }))}>
                  {['package', 'file-text', 'activity', 'users', 'shield'].map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Khách hàng
                <select value={form.targetCustomer} onChange={(event) => setForm((value) => ({ ...value, targetCustomer: event.target.value }))}>
                  {targetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Giá / tháng
                <input
                  type="number"
                  min="0"
                  value={form.pricePerMonth}
                  onChange={(event) => setForm((value) => ({ ...value, pricePerMonth: event.target.value }))}
                />
              </label>
              <label>
                Thời hạn
                <input value={form.duration} onChange={(event) => setForm((value) => ({ ...value, duration: event.target.value }))} />
              </label>
              <label>
                Trạng thái
                <select value={form.status} onChange={(event) => setForm((value) => ({ ...value, status: event.target.value }))}>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.formWide}>
                Tính năng
                <textarea rows="4" value={form.features} onChange={(event) => setForm((value) => ({ ...value, features: event.target.value }))} />
              </label>
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.buttonSmall} onClick={closeModal}>
                Hủy
              </button>
              <button type="submit" className={`${styles.buttonSmall} ${styles.buttonPrimary}`}>
                Lưu gói
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

