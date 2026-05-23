import { useMemo, useState } from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import RoomHero from './components/RoomHero';
import RoomRecommended from './components/RoomRecommended';
import RoomSearch from './components/RoomSearch';
import RoomList from './components/RoomList';
import { useGetPostsQuery } from '../homepage/api/postsApi';
import { useGetDistrictsByProvinceNameQuery, useGetProvincesQuery } from '../../shared/api/provincesApi';
import {
  cityOptions as fallbackCityOptions,
  districtOptions as fallbackDistrictOptions,
  typeOptions,
  sortOptions,
  roomStats,
  defaultSearchParams
} from './mockData/roomMockData';
import '../homepage/Homepage.css';
import './RoomPage.css';

const PAGE_SIZE = 10;

const formatRelativeTime = (createdAt) => {
  if (!createdAt) return 'Vừa đăng';

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return 'Vừa đăng';

  const diffInSeconds = Math.floor((Date.now() - createdDate.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Vừa đăng';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
};

const mapPostToRoom = (post) => ({
  id: post.post_id || post.room_id,
  title: post.title,
  price: Number(post.price) || 0,
  area: Number(post.area) || 0,
  bedrooms: Number(post.bedroom_count) || 0,
  type: post.room_type || 'Phòng trọ',
  city: post.city || '',
  district: post.district || '',
  ward: post.ward || '',
  verified: Boolean(post.is_vip),
  timeAgo: formatRelativeTime(post.created_at),
  image: post.thumbnail || post.image || post.cover_image,
  status: post.status,
});

const RoomPage = () => {
  const [searchParams, setSearchParams] = useState(defaultSearchParams);

  const [appliedFilters, setAppliedFilters] = useState(searchParams);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: provinceOptions = [] } = useGetProvincesQuery();
  const { data: districtOptions = [] } = useGetDistrictsByProvinceNameQuery(searchParams.city, {
    skip: !searchParams.city,
  });

  const queryParams = useMemo(() => ({
    page: currentPage,
    page_size: PAGE_SIZE,
    sort_by: appliedFilters.sort || 'newest',
    ...(appliedFilters.city ? { city: appliedFilters.city } : {}),
    ...(appliedFilters.district ? { district: appliedFilters.district } : {}),
    room_type: appliedFilters.type || undefined,
    keyword: appliedFilters.keyword || undefined,
  }), [appliedFilters.city, appliedFilters.district, appliedFilters.keyword, appliedFilters.sort, appliedFilters.type, currentPage]);

  const { data, isLoading } = useGetPostsQuery(queryParams);

  const rooms = useMemo(() => (data?.items || []).map(mapPostToRoom), [data]);
  const totalRooms = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 0;
  const recommendedRooms = useMemo(() => rooms.slice(0, 3), [rooms]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'city' ? { district: '' } : {}),
    }));
  };

  const handleSearch = () => {
    setAppliedFilters(searchParams);
    setCurrentPage(1);
  };

  const searchTags = useMemo(() => {
    const tags = [];
    if (appliedFilters.keyword) tags.push(`"${appliedFilters.keyword}"`);
    if (appliedFilters.city) tags.push(appliedFilters.city);
    if (appliedFilters.district) tags.push(appliedFilters.district);
    if (appliedFilters.type) tags.push(appliedFilters.type);
    return tags;
  }, [appliedFilters]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="room-page">
      <Header initialActiveId="find-room" />

      <RoomHero
        location=""
        title="Khám phá"
        emphasis="không gian"
        subtitle="Hơn 2.500 phòng trọ, căn hộ và KTX đang chờ bạn khám phá."
        stats={roomStats}
      />

      <RoomRecommended rooms={recommendedRooms} />

      <RoomSearch
        searchParams={searchParams}
        cityOptions={provinceOptions.length > 0 ? provinceOptions : fallbackCityOptions}
        districtOptions={districtOptions.length > 0 ? districtOptions : fallbackDistrictOptions}
        typeOptions={typeOptions}
        sortOptions={sortOptions}
        onChange={handleInputChange}
        onSearch={handleSearch}
        tags={searchTags}
      />

      <RoomList
        rooms={rooms}
        totalRooms={totalRooms}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        isLoading={isLoading}
      />

      <Footer />
    </div>
  );
};

export default RoomPage;
