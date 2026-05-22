import { useEffect, useMemo, useState } from 'react';
import Header from '../homepage/components/Header';
import Footer from '../homepage/components/Footer';
import RoomHero from './components/RoomHero';
import RoomRecommended from './components/RoomRecommended';
import RoomSearch from './components/RoomSearch';
import RoomList from './components/RoomList';
import { fetchRooms } from './api/roomApi';
import {
  cityOptions,
  districtOptions,
  typeOptions,
  sortOptions,
  roomStats,
  defaultSearchParams
} from './mockData/roomMockData';
import '../homepage/Homepage.css';
import './RoomPage.css';

const PAGE_SIZE = 6;

const RoomPage = () => {
  const [searchParams, setSearchParams] = useState(defaultSearchParams);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState(searchParams);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchRooms()
      .then((data) => {
        if (isMounted) {
          setRooms(data.items || []);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    if (appliedFilters.keyword) {
      const keyword = appliedFilters.keyword.toLowerCase();
      result = result.filter((room) =>
        [room.title, room.city, room.district, room.ward].some((field) =>
          (field || '').toLowerCase().includes(keyword)
        )
      );
    }

    if (appliedFilters.city) {
      result = result.filter((room) =>
        (room.city || '').toLowerCase().includes(appliedFilters.city.toLowerCase())
      );
    }

    if (appliedFilters.district) {
      result = result.filter((room) =>
        [room.district, room.ward].some((field) =>
          (field || '').toLowerCase().includes(appliedFilters.district.toLowerCase())
        )
      );
    }

    if (appliedFilters.type) {
      result = result.filter((room) =>
        (room.type || '').toLowerCase().includes(appliedFilters.type.toLowerCase())
      );
    }

    if (appliedFilters.sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    }

    if (appliedFilters.sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [appliedFilters, rooms]);

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / PAGE_SIZE));
  const pagedRooms = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRooms.slice(start, start + PAGE_SIZE);
  }, [filteredRooms, currentPage]);

  const recommendedRooms = useMemo(() => rooms.slice(0, 3), [rooms]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
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
      <Header initialActiveId="find-mate" />

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
        cityOptions={cityOptions}
        districtOptions={districtOptions}
        typeOptions={typeOptions}
        sortOptions={sortOptions}
        onChange={handleInputChange}
        onSearch={handleSearch}
        tags={searchTags}
      />

      <RoomList
        rooms={pagedRooms}
        totalRooms={filteredRooms.length}
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
