import { useMemo, useState } from 'react';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../api/adminApiMock';
import { AdminIcon } from './adminIconMap';
import { formatNumber, labelFromOptions, normalizeText, paginate, toArray } from './adminFeatureUtils';
import styles from './AdminDashboard.module.css';

const roleOptions = [
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'landlord', label: 'Chủ trọ' },
  { value: 'tenant', label: 'Khách thuê' },
];

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'blocked', label: 'Bị khóa' },
];

const emptyForm = {
  username: '',
  email: '',
  role: 'tenant',
  status: 'active',
};

const adminRoles = ['admin', 'manager', 'support', 'editor', 'super_admin'];

const normalizeUserRole = (value) => {
  const role = normalizeText(value).replace(/^role[_-]?/, '');

  if (adminRoles.includes(role) || role.includes('admin')) return 'admin';
  if (role === 'owner' || role === 'landlord' || role.includes('chu tro') || role.includes('chủ trọ')) return 'landlord';
  return 'tenant';
};

const getRoleLabel = (value) => labelFromOptions(roleOptions, normalizeUserRole(value));

const withDisplayRole = (user) => ({
  ...user,
  displayRole: normalizeUserRole(user.role),
  displayRoleLabel: getRoleLabel(user.role),
});

export const UsersTab = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('admin');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(undefined);
  const [form, setForm] = useState(emptyForm);
  const { data: usersResponse = [], isLoading, refetch } = useGetUsersQuery({});
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const allUsers = useMemo(() => toArray(usersResponse).map(withDisplayRole), [usersResponse]);

  const users = useMemo(() => {
    const keyword = normalizeText(search);

    return allUsers.filter((user) => {
      const matchesRole = user.displayRole === role;
      const matchesStatus = !status || user.status === status;
      const matchesSearch =
        !keyword ||
        [user.id, user.username, user.email, user.displayRoleLabel].some((value) => normalizeText(value).includes(keyword));

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [allUsers, role, search, status]);

  const paged = paginate(users, page, 6);

  const summary = useMemo(() => {
    const admins = allUsers.filter((user) => user.displayRole === 'admin');
    const landlords = allUsers.filter((user) => user.displayRole === 'landlord');
    const tenants = allUsers.filter((user) => user.displayRole === 'tenant');

    return {
      admin: [
        { label: 'Tổng quản trị viên', value: admins.length, icon: 'shield' },
        { label: 'Quản trị viên đang hoạt động', value: admins.filter((user) => user.status === 'active').length, icon: 'activity' },
      ],
      users: [
        { label: 'Tổng người dùng', value: allUsers.length, icon: 'users' },
        { label: 'Chủ trọ', value: landlords.length, icon: 'building' },
        { label: 'Khách thuê', value: tenants.length, icon: 'users' },
        { label: 'Đang hoạt động', value: allUsers.filter((user) => user.status === 'active').length, icon: 'check' },
        { label: 'Bị khóa', value: allUsers.filter((user) => user.status === 'blocked').length, icon: 'x-circle' },
      ],
    };
  }, [allUsers]);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      email: user.email,
      role: user.displayRole,
      status: user.status,
    });
  };

  const closeModal = () => {
    setEditingUser(undefined);
    setForm(emptyForm);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      roleLabel: getRoleLabel(form.role),
      statusLabel: labelFromOptions(statusOptions, form.status),
    };

    if (editingUser) {
      await updateUser({ id: editingUser.id, ...payload });
    } else {
      await createUser(payload);
    }

    closeModal();
    refetch();
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    refetch();
  };

  return (
    <div className={styles.featureStack}>
      <section className={`${styles.featureStatsGrid} ${styles.userAdminStatsGrid}`}>
        {summary.admin.map((item) => (
          <article key={item.label} className={styles.featureStatCard}>
            <span className={styles.featureStatIcon}>
              <AdminIcon name={item.icon} size={18} />
            </span>
            <div>
              <p>{item.label}</p>
              <strong>{formatNumber(item.value)}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className={`${styles.featureStatsGrid} ${styles.userStatsGridSecondary}`}>
        {summary.users.map((item) => (
          <article key={item.label} className={styles.featureStatCard}>
            <span className={styles.featureStatIcon}>
              <AdminIcon name={item.icon} size={18} />
            </span>
            <div>
              <p>{item.label}</p>
              <strong>{formatNumber(item.value)}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.featurePanel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Danh sách người dùng</h2>
            <p>Quản lý theo 3 vai trò: Quản trị viên, Chủ trọ và Khách thuê</p>
          </div>
          <button type="button" className={`${styles.buttonSmall} ${styles.buttonPrimary}`} onClick={openCreateModal}>
            <AdminIcon name="plus" size={14} />
            Thêm người dùng
          </button>
        </div>

        <div className={`${styles.toolbar} ${styles.userToolbar}`}>
          <div className={styles.roleFilterGroup} aria-label="Lọc vai trò">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.tabButton} ${role === option.value ? styles.tabButtonActive : ''}`}
                onClick={() => {
                  setRole(option.value);
                  setPage(1);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <select
            value={status}
            aria-label="Lọc trạng thái"
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            {statusOptions.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className={`${styles.controlWithIcon} ${styles.userSearchControl}`}>
            <AdminIcon name="search" size={15} />
            <input
              type="search"
              placeholder="Tìm username hoặc email..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <span className={styles.toolbarHint}>{formatNumber(users.length)} người dùng</span>
        </div>

        <div className={styles.tableScroller}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6">Đang tải người dùng...</td>
                </tr>
              ) : (
                paged.items.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className={styles.strongCell}>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`${styles.dataBadge} ${styles.badgeInfo}`}>{user.displayRoleLabel}</span>
                    </td>
                    <td>
                      <span className={`${styles.dataBadge} ${user.status === 'blocked' ? styles.badgeDanger : styles.badgeSuccess}`}>
                        {user.statusLabel || labelFromOptions(statusOptions, user.status)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button type="button" className={styles.actionButton} title="Sửa" onClick={() => openEditModal(user)}>
                          <AdminIcon name="edit" size={14} />
                        </button>
                        <button type="button" className={styles.actionButton} title="Xóa" onClick={() => handleDelete(user.id)}>
                          <AdminIcon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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

      {editingUser !== undefined && (
        <div className={styles.modalOverlay} role="presentation" onMouseDown={closeModal}>
          <form className={styles.modalCard} onSubmit={handleSave} onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.panelHeader}>
              <div>
                <h2>{editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}</h2>
                <p>Chỉ được chọn một trong ba vai trò: Quản trị viên, Chủ trọ hoặc Khách thuê</p>
              </div>
              <button type="button" className={styles.actionButton} onClick={closeModal}>
                <AdminIcon name="close" size={15} />
              </button>
            </div>
            <div className={styles.formGrid}>
              <label>
                Tên đăng nhập
                <input value={form.username} onChange={(event) => setForm((value) => ({ ...value, username: event.target.value }))} required />
              </label>
              <label>
                Email liên hệ
                <input type="email" value={form.email} onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))} required />
              </label>
              <label>
                Vai trò
                <select value={form.role} onChange={(event) => setForm((value) => ({ ...value, role: event.target.value }))}>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Trạng thái
                <select value={form.status} onChange={(event) => setForm((value) => ({ ...value, status: event.target.value }))}>
                  {statusOptions
                    .filter((option) => option.value)
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.buttonSmall} onClick={closeModal}>
                Hủy
              </button>
              <button type="submit" className={`${styles.buttonSmall} ${styles.buttonPrimary}`} disabled={!normalizeText(form.username)}>
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
