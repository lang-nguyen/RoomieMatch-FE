import { useMemo, useState } from 'react';
import {
  Edit3,
  Eye,
  Flame,
  Grid2X2,
  List,
  Plus,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import {
  useBoostLandlordPostMutation,
  useCancelPostBoostMutation,
  useCreateLandlordPostMutation,
  useDeleteLandlordPostMutation,
  useGetLandlordPostsQuery,
} from '../../features/landlord/api/landlordApiMock';
import LandlordMiniHeader from '../../features/landlord/components/LandlordMiniHeader';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import PostFormModal from '../../features/landlord/components/PostFormModal';
import PostStatusBadge from '../../features/landlord/components/PostStatusBadge';
import styles from './LandlordPostsPage.module.css';

const STATUS_FILTERS = [
  { value: '', label: 'Tất cả', countKey: 'total' },
  { value: 'pending', label: 'Chờ duyệt', countKey: 'pending' },
  { value: 'approved', label: 'Đã duyệt', countKey: 'approved' },
  { value: 'boosted', label: 'Đang đẩy nổi bật', countKey: 'boosted' },
  { value: 'rejected', label: 'Từ chối', countKey: 'rejected' },
];

const formatCompact = (value) => {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 1 : 1)}k`;
  return String(value);
};

const formatDate = (date) =>
  new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

const MetricCard = ({ tone, icon, value, label, sub }) => (
  <div className={`${styles.metricCard} ${styles[tone] || ''}`}>
    <span className={styles.metricIcon}>{icon}</span>
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
      {sub ? <em>{sub}</em> : null}
    </div>
  </div>
);

const BoostTrend = ({ data }) => {
  const max = Math.max(...data.map((item) => item.views), 1);

  return (
    <div className={styles.trendCard}>
      <div className={styles.trendHead}>
        <strong>Tăng trưởng lượt xem & like (7 ngày)</strong>
        <div>
          <span className={styles.legendViews}>Lượt xem</span>
          <span className={styles.legendLikes}>Like</span>
        </div>
      </div>
      <div className={styles.trendBars}>
        {data.map((item) => (
          <div key={item.label} className={styles.trendCol}>
            <span className={styles.viewLine} style={{ width: `${Math.max(18, (item.views / max) * 100)}%` }} />
            <span className={styles.likeLine} style={{ width: `${Math.max(14, (item.likes / max) * 100)}%` }} />
            <small>{item.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

const BoostedList = ({ posts, onBoost, onCancel }) => (
  <div className={styles.boostList}>
    {posts.length === 0 ? (
      <div className={styles.empty}>Chưa có bài viết nào đang đẩy nổi bật.</div>
    ) : posts.map((post, index) => {
      const percent = post.boostTotalDays > 0
        ? ((post.boostTotalDays - post.boostDaysLeft) / post.boostTotalDays) * 100
        : 0;

      return (
        <article key={post.id} className={styles.boostItem}>
          <div className={styles.rank}>{index + 1}</div>
          <div className={styles.boostBody}>
            <h3>{post.title}</h3>
            <div className={styles.postMeta}>
              <span>{post.author}</span>
              <span>{formatCompact(post.views)} lượt xem</span>
              <span>♥ {post.likes}</span>
              <span>💬 {post.comments}</span>
            </div>
            <div className={styles.tags}>
              {post.badges.map((badge) => <span key={badge}>{badge}</span>)}
            </div>
            <div className={styles.progressRow}>
              <span>Thời gian còn lại</span>
              <strong>{post.boostDaysLeft} / {post.boostTotalDays} ngày</strong>
            </div>
            <div className={styles.progressTrack}>
              <span style={{ width: `${Math.max(8, 100 - percent)}%` }} />
            </div>
          </div>
          <div className={styles.boostActions}>
            <button onClick={() => onBoost(post.id)}>
              <RefreshCcw size={12} />
              Gia hạn
            </button>
            <button className={styles.ghostDanger} onClick={() => onCancel(post.id)}>
              <X size={12} />
              Yêu cầu hủy nổi bật
            </button>
          </div>
        </article>
      );
    })}
  </div>
);

const LandlordPostsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const boostedOnly = activeTab === 'boosted';
  const { data, isLoading, isFetching, refetch } = useGetLandlordPostsQuery({
    page,
    pageSize: 8,
    search,
    status: boostedOnly ? '' : status,
    boostedOnly,
  });
  const [createPost, createState] = useCreateLandlordPostMutation();
  const [deletePost] = useDeleteLandlordPostMutation();
  const [boostPost] = useBoostLandlordPostMutation();
  const [cancelBoost] = useCancelPostBoostMutation();

  const posts = useMemo(() => data?.items ?? [], [data?.items]);
  const counts = data?.counts ?? {};
  const boostedCount = counts.boosted ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const metrics = useMemo(() => {
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalDays = posts.reduce((sum, post) => sum + post.boostDaysLeft, 0);
    return { totalViews, totalLikes, totalDays };
  }, [posts]);

  const handleCreate = async (payload) => {
    await createPost(payload).unwrap();
    setModalOpen(false);
    refetch();
  };

  const handleDelete = async (id) => {
    await deletePost({ id }).unwrap();
    refetch();
  };

  const handleBoost = async (id) => {
    await boostPost({ id, days: 7 }).unwrap();
    refetch();
  };

  const handleCancel = async (id) => {
    await cancelBoost({ id }).unwrap();
    refetch();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStatus('');
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <LandlordMiniHeader
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        boostedCount={boostedCount}
      />

      {boostedOnly ? (
        <>
          <LandlordPageHeader
            icon={Flame}
            title="Bài viết đang đẩy nổi bật"
            subtitle="Theo dõi tăng trưởng, vị trí hiển thị và quản lý thời gian boost"
          />
          <div className={styles.metricGridBoost}>
            <MetricCard tone="hot" icon="3" value={boostedCount} label="Bài đang đẩy nổi bật" />
            <MetricCard value={formatCompact(metrics.totalViews)} label="Tổng lượt xem" />
            <MetricCard value={formatCompact(metrics.totalLikes)} label="Tổng lượt thích" />
            <MetricCard value={metrics.totalDays} label="Tổng ngày còn lại" />
          </div>
          <BoostTrend data={data?.engagement ?? []} />
          {isLoading ? <div className={styles.empty}>Đang tải bài nổi bật...</div> : (
            <BoostedList posts={posts} onBoost={handleBoost} onCancel={handleCancel} />
          )}
        </>
      ) : (
        <>
          <LandlordPageHeader
            icon={List}
            title="Quản lý bài đăng"
            subtitle="Duyệt, quản lý trạng thái và đẩy nổi bật bài viết"
            actions={(
              <>
              <button className={styles.primaryBtn} onClick={() => setModalOpen(true)}>
                <Plus size={15} />
                Thêm bài đăng
              </button>
              <button className={styles.lightBtn} onClick={refetch}>
                <RefreshCcw size={13} />
                Làm mới
              </button>
              </>
            )}
          />

          <div className={styles.metricGrid}>
            <MetricCard icon="▣" value={counts.total ?? 0} label="Tổng bài viết" sub="+2 hôm nay" />
            <MetricCard icon="●" value={counts.pending ?? 0} label="Chờ duyệt" sub="3 mới" />
            <MetricCard tone="green" icon="●" value={counts.approved ?? 0} label="Đã duyệt" sub="12% tuần" />
            <MetricCard tone="hot" icon="♨" value={counts.boosted ?? 0} label="Đang đẩy nổi bật" sub="2 đang chạy" />
            <MetricCard tone="red" icon="⊘" value={counts.rejected ?? 0} label="Từ chối" sub="1 tuần qua" />
          </div>

          <div className={styles.filters}>
            {STATUS_FILTERS.map((item) => (
              <button
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
            <button className={styles.filterChip}>Tất cả thời gian</button>
            <div className={styles.viewTools}>
              <button className={styles.squareActive}><Grid2X2 size={14} /></button>
              <button><List size={14} /></button>
              <button><SlidersHorizontal size={14} /> Mới nhất</button>
            </div>
          </div>

          <div className={`${styles.tableWrap} ${isFetching ? styles.fetching : ''}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Bài viết</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                  <th>Chỉ số</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="6" className={styles.empty}>Đang tải danh sách bài đăng...</td></tr>
                ) : posts.length === 0 ? (
                  <tr><td colSpan="6" className={styles.empty}>Không có bài đăng phù hợp.</td></tr>
                ) : posts.map((post) => (
                  <tr key={post.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div className={styles.postCell}>
                        <div className={styles.thumb}><Search size={13} /></div>
                        <div>
                          <strong>{post.title}</strong>
                          <span>#{post.code}</span>
                        </div>
                      </div>
                    </td>
                    <td>{formatDate(post.publishedAt)}</td>
                    <td>
                      <PostStatusBadge
                        status={post.status}
                        subText={post.status === 'boosted' ? `Còn ${post.boostDaysLeft} ngày` : ''}
                      />
                    </td>
                    <td>
                      <div className={styles.inlineStats}>
                        <span>⌾ {formatCompact(post.views)}</span>
                        <span>♥ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button title="Sửa"><Edit3 size={13} /></button>
                        {post.status !== 'boosted' ? (
                          <button title="Đẩy nổi bật" onClick={() => handleBoost(post.id)}><Flame size={13} /></button>
                        ) : (
                          <button title="Hủy nổi bật" className={styles.dangerIcon} onClick={() => handleCancel(post.id)}><X size={13} /></button>
                        )}
                        <button title="Xem"><Eye size={13} /></button>
                        <button title="Xóa" onClick={() => handleDelete(post.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <span>Hiển thị {posts.length} / {data?.total ?? 0} bài</span>
            <div>
              <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>‹</button>
              <button className={styles.pageActive}>{page}</button>
              <button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>›</button>
            </div>
          </div>
        </>
      )}

      <PostFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isSaving={createState.isLoading}
      />
    </div>
  );
};

export default LandlordPostsPage;
