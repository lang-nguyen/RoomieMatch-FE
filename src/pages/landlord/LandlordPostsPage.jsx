import { useMemo, useState } from 'react';
import {
  Eye,
  Flame,
  Grid2X2,
  List,
  MessageSquare,
  Plus,
  RefreshCcw,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useBoostLandlordPostMutation,
  useCancelPostBoostMutation,
  useDeleteLandlordPostMutation,
  useGetLandlordPostsQuery,
} from '../../features/landlord/api/landlordApi';
import LandlordMiniHeader from '../../features/landlord/components/LandlordMiniHeader';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import PostStatusBadge from '../../features/landlord/components/PostStatusBadge';
import ConfirmModal from '../../shared/components/ConfirmModal';
import styles from './LandlordPostsPage.module.css';

const STATUS_FILTERS = [
  { value: '', label: 'Tat ca', countKey: 'total' },
  { value: 'pending', label: 'Cho duyet', countKey: 'pending' },
  { value: 'approved', label: 'Da duyet', countKey: 'approved' },
  { value: 'boosted', label: 'Dang noi bat', countKey: 'boosted' },
  { value: 'rejected', label: 'Tu choi', countKey: 'rejected' },
  { value: 'closed', label: 'Da dong', countKey: 'closed' },
];

const formatCompact = (value = 0) => {
  const numeric = Number(value) || 0;
  if (numeric >= 1000) return `${(numeric / 1000).toFixed(1)}k`;
  return String(numeric);
};

const formatDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '--';
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parsed);
};

const PostThumbnail = ({ post }) => (
  <div className={styles.thumb}>
    {post.thumbnail ? <img src={post.thumbnail} alt="" /> : <List size={13} />}
  </div>
);

const PostCard = ({ post, onBoost, onCancelBoost, onView, onDelete }) => (
  <article className={styles.postCard}>
    <div className={styles.postCardThumb}>
      {post.thumbnail ? <img src={post.thumbnail} alt={post.title} /> : <List size={18} />}
    </div>
    <div className={styles.postCardBody}>
      <div className={styles.postCardHead}>
        <div>
          <strong>{post.title}</strong>
          <span>{post.room_code || post.code}</span>
        </div>
        <PostStatusBadge
          status={post.status}
          subText={post.status === 'boosted' ? `Con ${post.boostDaysLeft} ngay` : ''}
        />
      </div>
      <div className={styles.postCardStats}>
        <span><Eye size={13} /> {formatCompact(post.views)} xem</span>
        <span><Flame size={13} /> {formatCompact(post.likes)} luu</span>
        <span><MessageSquare size={13} /> {formatCompact(post.comments)} binh luan</span>
      </div>
      <div className={styles.postCardFooter}>
        <small>{formatDate(post.publishedAt || post.created_at)}</small>
        <div className={styles.actions}>
          {post.status !== 'boosted' ? (
            <button title="Day noi bat" onClick={() => onBoost(post)}><Flame size={13} /></button>
          ) : (
            <button title="Huy noi bat" className={styles.dangerIcon} onClick={() => onCancelBoost(post)}><X size={13} /></button>
          )}
          <button title="Xem" onClick={() => onView(post)}><Eye size={13} /></button>
          <button title="Xoa" onClick={() => onDelete(post)}><Trash2 size={13} /></button>
        </div>
      </div>
    </div>
  </article>
);

const LandlordPostsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOrder, setSortOrder] = useState('newest');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [boostTarget, setBoostTarget] = useState(null);
  const [cancelBoostTarget, setCancelBoostTarget] = useState(null);

  const { data, isLoading, isFetching, isError, refetch } = useGetLandlordPostsQuery({
    page,
    pageSize: 8,
    search,
    status,
  });
  const [deletePost] = useDeleteLandlordPostMutation();
  const [boostPost] = useBoostLandlordPostMutation();
  const [cancelBoost] = useCancelPostBoostMutation();

  const posts = useMemo(() => {
    const items = [...(data?.items ?? [])];
    items.sort((first, second) => {
      const firstDate = new Date(first.publishedAt || first.created_at || 0).getTime();
      const secondDate = new Date(second.publishedAt || second.created_at || 0).getTime();
      return sortOrder === 'newest' ? secondDate - firstDate : firstDate - secondDate;
    });
    return items;
  }, [data?.items, sortOrder]);
  const counts = data?.counts ?? {};
  const totalPages = data?.total_pages ?? 1;

  return (
    <div className={styles.page}>
      <LandlordMiniHeader
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      <LandlordPageHeader
        icon={List}
        title="Quan ly bai dang"
        subtitle="Quan ly trang thai, luot xem va thao tac boost tren bai dang"
        actions={(
          <>
            <button className={styles.primaryBtn} onClick={() => navigate('/landlord/rooms?mode=select-for-post')}>
              <Plus size={15} />
              Them bai dang
            </button>
            <button className={styles.lightBtn} onClick={refetch}>
              <RefreshCcw size={13} />
              Lam moi
            </button>
          </>
        )}
      />

      <div className={styles.filters}>
        {STATUS_FILTERS.map((item) => (
          <button
            type="button"
            key={item.value}
            className={`${styles.filterChip} ${status === item.value ? styles.filterActive : ''}`}
            onClick={() => {
              setStatus(item.value);
              setPage(1);
            }}
          >
            {item.label}
            <span>{counts[item.countKey] ?? 0}</span>
          </button>
        ))}
        <div className={styles.viewTools}>
          <button
            type="button"
            className={viewMode === 'grid' ? styles.squareActive : ''}
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            title="Xem dang the"
          >
            <Grid2X2 size={14} />
          </button>
          <button
            type="button"
            className={viewMode === 'list' ? styles.squareActive : ''}
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            title="Xem dang bang"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            className={sortOrder === 'oldest' ? styles.sortActive : ''}
            onClick={() => setSortOrder((value) => (value === 'newest' ? 'oldest' : 'newest'))}
          >
            <SlidersHorizontal size={14} />
            {sortOrder === 'newest' ? 'Moi nhat' : 'Cu nhat'}
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className={`${styles.tableWrap} ${isFetching ? styles.fetching : ''}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Bai viet</th>
                <th>Ngay dang</th>
                <th>Trang thai</th>
                <th>Chi so</th>
                <th>Thao tac</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className={styles.empty}>Dang tai danh sach bai dang...</td></tr>
              ) : isError ? (
                <tr><td colSpan="6" className={styles.empty}>Khong tai duoc danh sach bai dang.</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan="6" className={styles.empty}>Khong co bai dang phu hop.</td></tr>
              ) : posts.map((post) => (
                <tr key={post.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className={styles.postCell}>
                      <PostThumbnail post={post} />
                      <div>
                        <strong>{post.title}</strong>
                        <span>{post.room_code || post.code}</span>
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(post.publishedAt || post.created_at)}</td>
                  <td>
                    <PostStatusBadge
                      status={post.status}
                      subText={post.status === 'boosted' ? `Con ${post.boostDaysLeft} ngay` : ''}
                    />
                  </td>
                  <td>
                    <div className={styles.inlineStats}>
                      <span>{formatCompact(post.views)} xem</span>
                      <span>{formatCompact(post.likes)} luu</span>
                      <span>{formatCompact(post.comments)} binh luan</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {post.status !== 'boosted' ? (
                        <button type="button" title="Day noi bat" onClick={() => setBoostTarget(post)}><Flame size={13} /></button>
                      ) : (
                        <button type="button" title="Huy noi bat" className={styles.dangerIcon} onClick={() => setCancelBoostTarget(post)}><X size={13} /></button>
                      )}
                      <button type="button" title="Xem" onClick={() => navigate(`/landlord/posts/${post.id}`)}><Eye size={13} /></button>
                      <button type="button" title="Xoa" onClick={() => setDeleteTarget(post)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`${styles.cardGrid} ${isFetching ? styles.fetching : ''}`}>
          {isLoading ? (
            <div className={styles.empty}>Dang tai danh sach bai dang...</div>
          ) : isError ? (
            <div className={styles.empty}>Khong tai duoc danh sach bai dang.</div>
          ) : posts.length === 0 ? (
            <div className={styles.empty}>Khong co bai dang phu hop.</div>
          ) : posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onBoost={setBoostTarget}
              onCancelBoost={setCancelBoostTarget}
              onView={(item) => navigate(`/landlord/posts/${item.id}`)}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <span>Hien thi {posts.length} / {data?.total ?? 0} bai</span>
        <div>
          <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>‹</button>
          <button className={styles.pageActive}>{page}</button>
          <button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>›</button>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Xac nhan xoa bai dang"
        message={deleteTarget ? `Ban co chac muon xoa bai dang "${deleteTarget.title}"?` : ''}
        confirmText="Xoa bai"
        cancelText="Huy"
        onCancel={() => setDeleteTarget(null)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await deletePost({ id: deleteTarget.id }).unwrap();
          setDeleteTarget(null);
          refetch();
        }}
      />

      <ConfirmModal
        isOpen={Boolean(boostTarget)}
        title="Xac nhan day noi bat"
        message={boostTarget ? `Ban muon day noi bat bai dang "${boostTarget.title}"?` : ''}
        confirmText="Day noi bat"
        cancelText="Huy"
        onCancel={() => setBoostTarget(null)}
        onClose={() => setBoostTarget(null)}
        onConfirm={async () => {
          try {
            await boostPost({ id: boostTarget.id }).unwrap();
            setBoostTarget(null);
            refetch();
          } catch (error) {
            setBoostTarget(null);
            window.alert(error?.data?.detail || 'Khong the day noi bat bai dang. Vui long kiem tra goi dang su dung.');
          }
        }}
      />

      <ConfirmModal
        isOpen={Boolean(cancelBoostTarget)}
        title="Xac nhan huy noi bat"
        message={cancelBoostTarget ? `Ban co chac muon huy noi bat bai dang "${cancelBoostTarget.title}"?` : ''}
        confirmText="Huy noi bat"
        cancelText="Quay lai"
        onCancel={() => setCancelBoostTarget(null)}
        onClose={() => setCancelBoostTarget(null)}
        onConfirm={async () => {
          await cancelBoost({ id: cancelBoostTarget.id }).unwrap();
          setCancelBoostTarget(null);
          refetch();
        }}
      />
    </div>
  );
};

export default LandlordPostsPage;
