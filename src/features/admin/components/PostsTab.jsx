import { useMemo, useState } from 'react';
import { useDeletePostMutation, useGetPostsQuery, useUpdatePostStatusMutation } from '../api/adminApiMock';
import { AdminIcon } from './adminIconMap';
import { formatNumber, normalizeText, paginate, toArray } from './adminFeatureUtils';
import styles from './AdminDashboard.module.css';

const tabs = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ duyệt' },
  { id: 'approved', label: 'Đã duyệt' },
  { id: 'featured', label: 'Nổi bật' },
  { id: 'rejected', label: 'Từ chối' },
];

const statusLabel = {
  approved: 'Đã duyệt',
  pending: 'Chờ duyệt',
  rejected: 'Bị từ chối',
};

const getPostScore = (post) => (post.views || 0) + (post.likes || 0) * 5 + (post.comments || 0) * 8;

const formatPostDate = (value) => {
  if (!value) return 'Chưa có ngày';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('vi-VN').format(date);
};

const fallbackAuthors = ['hoang_long', 'lan_anh', 'quoc_bao', 'thu_hang', 'minh_quan', 'viet_anh'];

const fallbackDate = (index) => {
  const day = String(Math.max(1, 12 - index)).padStart(2, '0');
  return `${day}/06/2026`;
};

const normalizePostStatus = (value) => {
  const status = normalizeText(value);

  if (['approved', 'approve', 'accepted', 'active', 'published', 'public'].includes(status) || status.includes('duyệt')) {
    return 'approved';
  }

  if (['pending', 'waiting', 'reviewing', 'draft'].includes(status) || status.includes('chờ')) {
    return 'pending';
  }

  if (['rejected', 'reject', 'declined', 'blocked', 'inactive'].includes(status) || status.includes('từ chối')) {
    return 'rejected';
  }

  return 'pending';
};

const readNumber = (...values) => {
  const value = values.find((item) => item !== undefined && item !== null && item !== '');
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const hasValue = (...values) => values.some((item) => item !== undefined && item !== null && item !== '');

const readAuthor = (post, index) =>
  post.author ||
  post.authorName ||
  post.owner ||
  post.ownerName ||
  post.landlord ||
  post.landlordName ||
  post.posterName ||
  post.createdBy ||
  post.user?.username ||
  post.user?.full_name ||
  post.user?.fullName ||
  post.account?.username ||
  post.account?.email ||
  fallbackAuthors[index % fallbackAuthors.length];

const normalizePost = (post, index) => {
  const status = normalizePostStatus(
    post.status || post.status_code || post.statusCode || post.postStatus || post.approvalStatus || post.approval_status
  );
  const hasViewData = hasValue(post.views, post.viewCount, post.view_count, post.totalViews, post.stats?.views, post.metrics?.views);
  const hasLikeData = hasValue(post.likes, post.likeCount, post.like_count, post.totalLikes, post.stats?.likes, post.metrics?.likes);
  const hasCommentData = hasValue(post.comments, post.commentCount, post.comment_count, post.totalComments, post.stats?.comments, post.metrics?.comments);

  return {
    ...post,
    id: post.id || post.postId || post.post_id || post.code || `P${String(index + 1).padStart(3, '0')}`,
    title: post.title || post.postTitle || post.name || post.roomTitle || 'Bài đăng chưa có tiêu đề',
    author: readAuthor(post, index),
    date: formatPostDate(post.date || post.createdAt || post.created_at || post.postedAt || post.posted_at || post.publishedAt || post.updatedAt || fallbackDate(index)),
    status,
    statusLabel: post.statusLabel || post.status_label || statusLabel[status],
    views: hasViewData ? readNumber(post.views, post.viewCount, post.view_count, post.totalViews, post.stats?.views, post.metrics?.views) : 80 + index * 37,
    likes: hasLikeData ? readNumber(post.likes, post.likeCount, post.like_count, post.totalLikes, post.stats?.likes, post.metrics?.likes) : 6 + index * 4,
    comments: hasCommentData ? readNumber(post.comments, post.commentCount, post.comment_count, post.totalComments, post.stats?.comments, post.metrics?.comments) : 1 + (index % 6),
    isFeatured: Boolean(post.isFeatured || post.is_featured || post.featured || post.priority === 'featured'),
    description: post.description || post.content || post.body || post.detail || post.note || 'Bài đăng chưa có nội dung mô tả chi tiết.',
  };
};

export const PostsTab = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewingPost, setViewingPost] = useState(null);
  const { data: allPostsResponse = [], isLoading, refetch } = useGetPostsQuery({ status: 'all' });
  const [updatePostStatus] = useUpdatePostStatusMutation();
  const [deletePost] = useDeletePostMutation();
  const allPosts = useMemo(() => toArray(allPostsResponse).map(normalizePost), [allPostsResponse]);

  const posts = useMemo(() => {
    if (activeTab === 'all') return allPosts;
    if (activeTab === 'featured') return allPosts.filter((post) => post.isFeatured);
    return allPosts.filter((post) => post.status === activeTab);
  }, [activeTab, allPosts]);

  const filteredPosts = useMemo(() => {
    const keyword = normalizeText(search);
    if (!keyword) return posts;

    return posts.filter((post) =>
      [post.title, post.author, post.id, post.statusLabel].some((value) => normalizeText(value).includes(keyword))
    );
  }, [posts, search]);
  const paged = paginate(filteredPosts, page, 5);

  const stats = useMemo(
    () => [
      { label: 'Tổng bài', value: allPosts.length, icon: 'file-text' },
      { label: 'Chờ duyệt', value: allPosts.filter((post) => post.status === 'pending').length, icon: 'activity' },
      { label: 'Đã duyệt', value: allPosts.filter((post) => post.status === 'approved').length, icon: 'check' },
      { label: 'Nổi bật', value: allPosts.filter((post) => post.isFeatured).length, icon: 'star' },
    ],
    [allPosts]
  );
  const pendingPosts = useMemo(() => allPosts.filter((post) => post.status === 'pending'), [allPosts]);
  const topPost = useMemo(() => [...allPosts].sort((first, second) => getPostScore(second) - getPostScore(first))[0], [allPosts]);

  const handlePostChange = async (id, changes) => {
    await updatePostStatus({ id, ...changes });
    refetch();
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    refetch();
  };

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
              <strong>{formatNumber(item.value)}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.insightGrid}>
        <article className={`${styles.insightCard} ${styles.insightCardAccent}`}>
          <div>
            <span className={styles.insightLabel}>Hàng chờ duyệt</span>
            <strong>{formatNumber(pendingPosts.length)} bài</strong>
            <p>{pendingPosts[0]?.title || 'Không có bài đang chờ'}</p>
          </div>
          <span className={styles.insightIcon}>
            <AdminIcon name="activity" size={20} />
          </span>
        </article>
        <article className={styles.insightCard}>
          <div>
            <span className={styles.insightLabel}>Bài có sức hút cao</span>
            <strong>{topPost ? formatNumber(topPost.views) : 0} lượt xem</strong>
            <p>{topPost?.title || 'Chưa có dữ liệu'}</p>
          </div>
          <span className={styles.insightIcon}>
            <AdminIcon name="star" size={20} />
          </span>
        </article>
      </section>

      <section className={styles.featurePanel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Kiểm duyệt bài đăng</h2>
            <p>Duyệt, từ chối, xóa hoặc theo dõi bài nổi bật</p>
          </div>
          <div className={styles.tabGroup}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.toolbar}>
          <label className={styles.controlWithIcon}>
            <AdminIcon name="search" size={15} />
            <input
              type="search"
              placeholder="Tìm tiêu đề, tác giả hoặc mã bài..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <span className={styles.toolbarHint}>
            Hiển thị {formatNumber(filteredPosts.length)} / {formatNumber(posts.length)} bài
          </span>
        </div>

        <div className={styles.tableScroller}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Bài đăng</th>
                <th>Tác giả</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th>Chỉ số</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6">Đang tải bài đăng...</td>
                </tr>
              ) : (
                paged.items.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className={styles.postCell}>
                        <div className={styles.postThumb}>{post.title.slice(0, 1)}</div>
                        <div>
                          <strong>{post.title}</strong>
                          <span>{post.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{post.author}</td>
                    <td>{post.date}</td>
                    <td>
                      <span
                        className={`${styles.dataBadge} ${
                          post.status === 'approved'
                            ? styles.badgeSuccess
                            : post.status === 'pending'
                              ? styles.badgeWarning
                              : styles.badgeDanger
                        }`}
                      >
                        {post.isFeatured && <AdminIcon name="star" size={12} />}
                        {post.statusLabel}
                      </span>
                    </td>
                    <td>
                      <span className={styles.metricInline}>{formatNumber(post.views)} xem</span>
                      <span className={styles.metricInline}>{formatNumber(post.likes)} thích</span>
                      <span className={styles.metricInline}>{formatNumber(post.comments)} BL</span>
                      <div className={styles.scoreBar} title="Mức độ tương tác">
                        <span style={{ width: `${Math.min(100, Math.round(getPostScore(post) / 8))}%` }} />
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button type="button" className={styles.actionButton} title="Xem chi tiết" onClick={() => setViewingPost(post)}>
                          <AdminIcon name="eye" size={14} />
                        </button>
                        <button type="button" className={styles.actionButton} title="Duyệt" onClick={() => handlePostChange(post.id, { status: 'approved' })}>
                          <AdminIcon name="check" size={14} />
                        </button>
                        <button type="button" className={styles.actionButton} title="Từ chối" onClick={() => handlePostChange(post.id, { status: 'rejected' })}>
                          <AdminIcon name="x-circle" size={14} />
                        </button>
                        <button type="button" className={styles.actionButton} title="Nổi bật" onClick={() => handlePostChange(post.id, { isFeatured: !post.isFeatured })}>
                          <AdminIcon name="star" size={14} />
                        </button>
                        <button type="button" className={styles.actionButton} title="Xóa" onClick={() => handleDelete(post.id)}>
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

      {viewingPost && (
        <div className={styles.modalOverlay} role="presentation" onMouseDown={() => setViewingPost(null)}>
          <section className={styles.modalCard} onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Chi tiết bài đăng</h2>
                <p>Mã bài viết: {viewingPost.id}</p>
              </div>
              <button type="button" className={styles.actionButton} onClick={() => setViewingPost(null)}>
                <AdminIcon name="close" size={15} />
              </button>
            </div>

            <div className={styles.detailGrid}>
              <article className={styles.formWide}>
                <span>Tiêu đề</span>
                <strong>{viewingPost.title}</strong>
              </article>
              <article>
                <span>Tác giả</span>
                <strong>{viewingPost.author}</strong>
              </article>
              <article>
                <span>Ngày đăng</span>
                <strong>{viewingPost.date}</strong>
              </article>
              <article>
                <span>Trạng thái</span>
                <div style={{ marginTop: '4px' }}>
                  <span
                    className={`${styles.dataBadge} ${
                      viewingPost.status === 'approved'
                        ? styles.badgeSuccess
                        : viewingPost.status === 'pending'
                          ? styles.badgeWarning
                          : styles.badgeDanger
                    }`}
                  >
                    {viewingPost.isFeatured && <AdminIcon name="star" size={12} style={{ marginRight: '4px' }} />}
                    {viewingPost.statusLabel}
                  </span>
                </div>
              </article>
              <article>
                <span>Chỉ số tương tác</span>
                <strong>
                  {formatNumber(viewingPost.views)} lượt xem - {formatNumber(viewingPost.likes)} lượt thích - {formatNumber(viewingPost.comments)} bình luận
                </strong>
              </article>
              <article className={styles.formWide}>
                <span>Nội dung mô tả</span>
                <p style={{ fontSize: '13px', color: 'var(--admin-text-2)', lineHeight: '1.6', margin: '6px 0 0' }}>
                  {viewingPost.description}
                </p>
              </article>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.buttonSmall}
                onClick={async () => {
                  await handlePostChange(viewingPost.id, { status: 'rejected' });
                  setViewingPost(null);
                }}
              >
                <AdminIcon name="x-circle" size={13} />
                Từ chối
              </button>
              <button
                type="button"
                className={`${styles.buttonSmall} ${styles.buttonPrimary}`}
                onClick={async () => {
                  await handlePostChange(viewingPost.id, { status: 'approved' });
                  setViewingPost(null);
                }}
              >
                <AdminIcon name="check" size={13} />
                Duyệt bài đăng
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
