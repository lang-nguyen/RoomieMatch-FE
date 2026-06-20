import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useMemo, useState } from 'react';
import { getApiErrorMessage } from '../../../shared/utils/getApiErrorMessage';
import {
  useCreateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetAdminUserStatsQuery,
  useGetAdminUsersQuery,
  useGetUserMetaQuery,
  useLazyGetAdminUserByIdQuery,
  useUpdateAdminUserMutation,
  useUpdateAdminUserStatusMutation,
} from '../api/adminApi';
import { AdminIcon } from './adminIconMap';
import { formatNumber, labelFromOptions, normalizeText } from './adminFeatureUtils';
import styles from './AdminDashboard.module.css';

const PAGE_SIZE = 6;
const EMPTY_OPTIONS = [];

const buildEmptyForm = (role = '') => ({
  username: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  role,
  status: 'active',
});

const withAllStatuses = (statuses = []) => [{ value: '', label: 'Tất cả trạng thái' }, ...statuses];

const normalizeUser = (user = {}, roleOptions = [], statusOptions = []) => ({
  ...user,
  id: user.id,
  username: user.username || '',
  email: user.email || '',
  phone: user.phone || '',
  role: user.role || '',
  displayRole: user.role || '',
  displayRoleLabel: user.role_label || labelFromOptions(roleOptions, user.role),
  status: user.status || '',
  statusLabel: user.status_label || labelFromOptions(statusOptions, user.status),
  updatedAt: user.updated_at || null,
});

export const UsersTab = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(undefined);
  const [isPasswordEditOpen, setIsPasswordEditOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [form, setForm] = useState(buildEmptyForm());

  const { data: meta, isLoading: isMetaLoading } = useGetUserMetaQuery();
  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } = useGetAdminUserStatsQuery();

  const roleOptions = meta?.roles ?? EMPTY_OPTIONS;
  const statusOptions = useMemo(() => withAllStatuses(meta?.statuses ?? EMPTY_OPTIONS), [meta?.statuses]);
  const editableStatusOptions = statusOptions.filter((option) => option.value);
  const activeRole = role || roleOptions[0]?.value || '';

  const queryParams = activeRole
    ? {
        role: activeRole,
        status: status || undefined,
        q: debouncedSearch || undefined,
        page,
        page_size: PAGE_SIZE,
      }
    : skipToken;

  const {
    data: usersResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: refetchUsers,
  } = useGetAdminUsersQuery(queryParams);
  const [fetchUserById, { isFetching: isFetchingDetail }] = useLazyGetAdminUserByIdQuery();
  const [createUser, { isLoading: isCreating }] = useCreateAdminUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation();
  const [updateUserStatus, { isLoading: isChangingStatus }] = useUpdateAdminUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation();

  const users = useMemo(
    () => (usersResponse?.items ?? []).map((user) => normalizeUser(user, roleOptions, statusOptions)),
    [roleOptions, statusOptions, usersResponse?.items]
  );

  const summary = useMemo(
    () => ({
      admin: [
        { label: 'Tổng quản trị viên', value: stats?.total_admins ?? 0, icon: 'shield' },
        { label: 'Quản trị viên đang hoạt động', value: stats?.active_admins ?? 0, icon: 'activity' },
      ],
      users: [
        { label: 'Tổng người dùng', value: stats?.total_users ?? 0, icon: 'users' },
        { label: 'Chủ trọ', value: stats?.landlords ?? 0, icon: 'building' },
        { label: 'Khách thuê', value: stats?.tenants ?? 0, icon: 'users' },
        { label: 'Đang hoạt động', value: stats?.active_users ?? 0, icon: 'check' },
        { label: 'Bị khóa', value: stats?.blocked_users ?? 0, icon: 'x-circle' },
      ],
    }),
    [stats]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const refreshUsersAndStats = () => {
    refetchUsers();
    refetchStats();
  };

  const showSuccess = (message) => setToast({ type: 'success', message });
  const showError = (message) => setToast({ type: 'error', message });

  const openCreateModal = () => {
    setEditingUser(null);
    setIsPasswordEditOpen(true);
    setFormError('');
    setForm(buildEmptyForm(activeRole || roleOptions[0]?.value || ''));
  };

  const openEditModal = async (user) => {
    setEditingUser(user);
    setIsPasswordEditOpen(false);
    setFormError('');
    setForm({
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      password: '',
      passwordConfirm: '',
      role: user.displayRole,
      status: user.status,
      expected_updated_at: user.updatedAt,
    });

    try {
      const detail = normalizeUser(await fetchUserById(user.id).unwrap(), roleOptions, statusOptions);
      setEditingUser(detail);
      setForm({
        username: detail.username,
        email: detail.email,
        phone: detail.phone || '',
        password: '',
        passwordConfirm: '',
        role: detail.displayRole,
        status: detail.status,
        expected_updated_at: detail.updatedAt,
      });
    } catch (err) {
      closeModal();
      showError(getApiErrorMessage(err, 'Không tải được chi tiết người dùng'));
    }
  };

  const closeModal = () => {
    setEditingUser(undefined);
    setIsPasswordEditOpen(false);
    setFormError('');
    setForm(buildEmptyForm(activeRole));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const shouldUpdatePassword = !editingUser || isPasswordEditOpen;

    if (shouldUpdatePassword && !form.password) {
      setFormError('Vui lòng nhập mật khẩu.');
      return;
    }

    if (shouldUpdatePassword && form.password !== form.passwordConfirm) {
      setFormError('Mật khẩu xác nhận không khớp.');
      return;
    }

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      status: form.status,
      ...(shouldUpdatePassword ? { password: form.password } : {}),
      ...(editingUser?.updatedAt ? { expected_updated_at: editingUser.updatedAt } : {}),
    };

    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id, ...payload }).unwrap();
        showSuccess('Cập nhật người dùng thành công.');
      } else {
        await createUser(payload).unwrap();
        showSuccess('Thêm người dùng thành công.');
      }
      closeModal();
      refreshUsersAndStats();
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Lưu người dùng thất bại'));
    }
  };

  const requestDelete = (user) => {
    setConfirmation({ type: 'delete', user });
  };

  const requestStatusChange = (user) => {
    const nextStatus = user.status === 'blocked' ? 'active' : 'blocked';
    setConfirmation({ type: 'status', user, nextStatus });
  };

  const handleConfirmAction = async () => {
    if (!confirmation) return;

    try {
      if (confirmation.type === 'delete') {
        await deleteUser(confirmation.user.id).unwrap();
        showSuccess('Xóa người dùng thành công.');
      } else {
        await updateUserStatus({
          id: confirmation.user.id,
          status: confirmation.nextStatus,
          expected_updated_at: confirmation.user.updatedAt,
        }).unwrap();
        showSuccess(confirmation.nextStatus === 'active' ? 'Mở khóa người dùng thành công.' : 'Khóa người dùng thành công.');
      }
      setConfirmation(null);
      refreshUsersAndStats();
    } catch (err) {
      showError(getApiErrorMessage(err, 'Thao tác thất bại'));
    }
  };

  const shouldShowPasswordFields = !editingUser || isPasswordEditOpen;
  const isPasswordInvalid = shouldShowPasswordFields && (!form.password || form.password !== form.passwordConfirm);
  const isFormBusy = isCreating || isUpdating || isFetchingDetail;
  const isSaveDisabled = !normalizeText(form.username) || !form.email.trim() || !form.role || isPasswordInvalid || isFormBusy;
  const totalUsers = usersResponse?.total ?? 0;
  const totalPages = usersResponse?.total_pages ?? 1;
  const currentPage = usersResponse?.page ?? page;
  const hasUsers = users.length > 0;

  return (
    <div className={styles.featureStack}>
      {toast && <div className={`${styles.toastMessage} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}>{toast.message}</div>}

      <section className={`${styles.featureStatsGrid} ${styles.userAdminStatsGrid}`}>
        {summary.admin.map((item) => (
          <article key={item.label} className={styles.featureStatCard}>
            <span className={styles.featureStatIcon}>
              <AdminIcon name={item.icon} size={18} />
            </span>
            <div>
              <p>{item.label}</p>
              <strong>{isStatsLoading ? '...' : formatNumber(item.value)}</strong>
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
              <strong>{isStatsLoading ? '...' : formatNumber(item.value)}</strong>
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
          <button
            type="button"
            className={`${styles.buttonSmall} ${styles.buttonPrimary}`}
            onClick={openCreateModal}
            disabled={isMetaLoading || !roleOptions.length}
          >
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
                className={`${styles.tabButton} ${activeRole === option.value ? styles.tabButtonActive : ''}`}
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

          <span className={styles.toolbarHint}>{isFetching ? 'Đang tải...' : `${formatNumber(totalUsers)} người dùng`}</span>
        </div>

        {isError && (
          <div className={styles.emptyState}>
            {getApiErrorMessage(error, 'Không tải được danh sách người dùng')}{' '}
            <button type="button" className={styles.linkButton} onClick={refetchUsers}>
              Thử lại
            </button>
          </div>
        )}

        {!isError && (
          <div className={styles.tableScroller}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isMetaLoading ? (
                  <tr>
                    <td colSpan="7">Đang tải người dùng...</td>
                  </tr>
                ) : hasUsers ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td className={styles.strongCell}>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || <span className={styles.subText}>Chưa cập nhật</span>}</td>
                      <td>
                        <span className={`${styles.dataBadge} ${styles.badgeInfo}`}>{user.displayRoleLabel}</span>
                      </td>
                      <td>
                        <span className={`${styles.dataBadge} ${user.status === 'blocked' ? styles.badgeDanger : styles.badgeSuccess}`}>
                          {user.statusLabel}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button type="button" className={styles.actionButton} title="Sửa" onClick={() => openEditModal(user)}>
                            <AdminIcon name="edit" size={14} />
                          </button>
                          <button
                            type="button"
                            className={styles.actionButton}
                            title={user.status === 'blocked' ? 'Mở khóa' : 'Khóa'}
                            onClick={() => requestStatusChange(user)}
                          >
                            <AdminIcon name={user.status === 'blocked' ? 'unlock' : 'lock'} size={14} />
                          </button>
                          <button type="button" className={styles.actionButton} title="Xóa" onClick={() => requestDelete(user)}>
                            <AdminIcon name="trash" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">Không có người dùng phù hợp.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.paginationWrap}>
          <span>
            Trang {currentPage}/{totalPages} · {formatNumber(totalUsers)} người dùng
          </span>
          <div>
            <button type="button" disabled={currentPage === 1 || isFetching} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              Trước
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || isFetching}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
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
                <input
                  value={form.username}
                  onChange={(event) => setForm((value) => ({ ...value, username: event.target.value }))}
                  disabled={isFormBusy}
                  required
                />
              </label>
              <label>
                Email liên hệ
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
                  disabled={isFormBusy}
                  required
                />
              </label>
              <label>
                Số điện thoại
                <input
                  value={form.phone}
                  onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))}
                  disabled={isFormBusy}
                />
              </label>
              <label>
                Vai trò
                <select value={form.role} onChange={(event) => setForm((value) => ({ ...value, role: event.target.value }))} disabled={isFormBusy}>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              {editingUser && (
                <div className={styles.formWide}>
                  <button
                    type="button"
                    className={styles.passwordToggleButton}
                    disabled={isFormBusy}
                    onClick={() => {
                      setIsPasswordEditOpen((value) => !value);
                      setFormError('');
                      setForm((value) => ({ ...value, password: '', passwordConfirm: '' }));
                    }}
                  >
                    <AdminIcon name="key" size={14} />
                    {isPasswordEditOpen ? 'Hủy chỉnh sửa mật khẩu' : 'Chỉnh sửa mật khẩu'}
                  </button>
                </div>
              )}
              {shouldShowPasswordFields && (
                <div className={`${styles.passwordFields} ${styles.formWide}`}>
                  <label>
                    Mật khẩu
                    <input
                      type="password"
                      value={form.password}
                      onChange={(event) => {
                        setFormError('');
                        setForm((value) => ({ ...value, password: event.target.value }));
                      }}
                      disabled={isFormBusy}
                      required={shouldShowPasswordFields}
                    />
                  </label>
                  <label>
                    Xác nhận mật khẩu
                    <input
                      type="password"
                      value={form.passwordConfirm}
                      onChange={(event) => {
                        setFormError('');
                        setForm((value) => ({ ...value, passwordConfirm: event.target.value }));
                      }}
                      disabled={isFormBusy}
                      required={shouldShowPasswordFields}
                    />
                  </label>
                </div>
              )}
              <label>
                Trạng thái
                <select value={form.status} onChange={(event) => setForm((value) => ({ ...value, status: event.target.value }))} disabled={isFormBusy}>
                  {editableStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {formError && <p className={styles.formError}>{formError}</p>}
            <div className={styles.modalActions}>
              <button type="button" className={styles.buttonSmall} onClick={closeModal} disabled={isFormBusy}>
                Hủy
              </button>
              <button type="submit" className={`${styles.buttonSmall} ${styles.buttonPrimary}`} disabled={isSaveDisabled}>
                {isFormBusy ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmation && (
        <div className={styles.modalOverlay} role="presentation" onMouseDown={() => setConfirmation(null)}>
          <section className={styles.confirmCard} onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.panelHeader}>
              <div>
                <h2>{confirmation.type === 'delete' ? 'Xóa người dùng' : confirmation.nextStatus === 'active' ? 'Mở khóa người dùng' : 'Khóa người dùng'}</h2>
                <p>
                  {confirmation.user.username} · {confirmation.user.email}
                </p>
              </div>
              <button type="button" className={styles.actionButton} onClick={() => setConfirmation(null)}>
                <AdminIcon name="close" size={15} />
              </button>
            </div>
            <p className={styles.confirmText}>
              {confirmation.type === 'delete'
                ? 'Tài khoản sẽ được xóa mềm khỏi danh sách quản trị, dữ liệu liên quan vẫn được giữ lại an toàn.'
                : confirmation.nextStatus === 'active'
                  ? 'Tài khoản này sẽ được phép đăng nhập và sử dụng hệ thống trở lại.'
                  : 'Tài khoản này sẽ không thể đăng nhập cho đến khi được mở khóa.'}
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.buttonSmall} onClick={() => setConfirmation(null)} disabled={isDeleting || isChangingStatus}>
                Hủy
              </button>
              <button
                type="button"
                className={`${styles.buttonSmall} ${confirmation.type === 'delete' || confirmation.nextStatus === 'blocked' ? styles.buttonDanger : styles.buttonPrimary}`}
                onClick={handleConfirmAction}
                disabled={isDeleting || isChangingStatus}
              >
                {isDeleting || isChangingStatus ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
