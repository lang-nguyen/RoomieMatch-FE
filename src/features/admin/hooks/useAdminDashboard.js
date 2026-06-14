import { useMemo, useState } from 'react';
import { ADMIN_NAV_SECTIONS } from '../models/adminModels';
import { adminDashboardMockData } from '../api/adminMockData';
import { useGetAdminDashboardQuery } from '../api/adminApiMock';

export const useAdminDashboard = () => {
  const [activeNavId, setActiveNavId] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState(adminDashboardMockData.performance.years[0]);
  const [regionSearch, setRegionSearch] = useState('');
  const [readNotificationIds, setReadNotificationIds] = useState([]);
  const { data = adminDashboardMockData, isLoading, isError, refetch } = useGetAdminDashboardQuery();

  const regions = useMemo(() => {
    const keyword = regionSearch.trim().toLowerCase();
    if (!keyword) return data.regions;

    return data.regions.filter((region) => region.name.toLowerCase().includes(keyword));
  }, [data.regions, regionSearch]);

  const notifications = useMemo(
    () =>
      data.notifications.map((notification) => ({
        ...notification,
        unread: notification.unread && !readNotificationIds.includes(notification.id),
      })),
    [data.notifications, readNotificationIds]
  );

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const markAllNotificationsRead = () => {
    setReadNotificationIds(data.notifications.map((notification) => notification.id));
  };

  return {
    navSections: ADMIN_NAV_SECTIONS,
    activeNavId,
    setActiveNavId,
    selectedYear,
    setSelectedYear,
    regionSearch,
    setRegionSearch,
    dashboard: data,
    regions,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    isLoading,
    isError,
    refetch,
  };
};
