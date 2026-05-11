import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RoomCard from './components/RoomCard';
import Sidebar from './components/Sidebar';
import CustomDropdown from './components/CustomDropdown';
import { mockRooms, citiesData, faqData } from './mockData';
import './Homepage.css';

const cityOptions = [
  { value: 'Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Bình Dương', label: 'Bình Dương' }
];

const districtOptions = [
  { value: 'Thảo Điền', label: 'Thảo Điền' },
  { value: 'Cầu Giấy', label: 'Cầu Giấy' },
  { value: 'Hải Châu', label: 'Hải Châu' }
];

const typeOptions = [
  { value: 'Phòng trọ', label: 'Phòng trọ' },
  { value: 'Chung cư mini', label: 'Chung cư mini' }
];

const priceOptions = [
  { value: '3000000', label: 'Dưới 3 triệu' },
  { value: '5000000', label: 'Dưới 5 triệu' },
  { value: '10000000', label: 'Dưới 10 triệu' }
];

const amenityOptions = [
  { value: 'wifi', label: 'Có Wifi' },
  { value: 'air_con', label: 'Điều hoà' },
  { value: 'parking', label: 'Chỗ để xe' }
];

const Homepage = () => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    district: '',
    type: '',
    price: ''
  });

  const [filteredRooms, setFilteredRooms] = useState(mockRooms);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleSearch = () => {
    let result = [...mockRooms];

    if (searchParams.city) {
      result = result.filter(r => r.city.toLowerCase().includes(searchParams.city.toLowerCase()));
    }
    if (searchParams.district) {
      result = result.filter(r => r.district.toLowerCase().includes(searchParams.district.toLowerCase()));
    }
    if (searchParams.type) {
      result = result.filter(r => r.type.toLowerCase().includes(searchParams.type.toLowerCase()));
    }
    // simple price filter logic
    if (searchParams.price) {
      const limit = parseInt(searchParams.price);
      if (limit) {
        result = result.filter(r => r.price <= limit);
      }
    }

    setFilteredRooms(result);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="homepage">
      <Header />

      <section className="hero-section">
        <div className="hero-overlay"></div>
        <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Hero background" className="hero-bg" />

        <div className="hero-content">
          <h1 className="hero-title">Tìm Phòng Trọ Ưng Ý Nhanh Chóng & Dễ Dàng</h1>
          <p className="hero-subtitle">SmartRoom kết nối người thuê với phòng đang trống theo thời<br />gian thực - không tin ảo - minh bạch chi phí</p>

          <div className="search-filter-box">
            <div className="search-grid">
              <CustomDropdown
                name="city"
                value={searchParams.city}
                onChange={handleInputChange}
                options={cityOptions}
                placeholder="Tỉnh/Thành phố"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>}
              />

              <CustomDropdown
                name="district"
                value={searchParams.district}
                onChange={handleInputChange}
                options={districtOptions}
                placeholder="Quận/Huyện"
              />

              <button className="search-btn pill-btn" onClick={handleSearch}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Tìm kiếm
              </button>
            </div>

            <div className="search-grid bottom-row">
              <CustomDropdown
                name="type"
                value={searchParams.type}
                onChange={handleInputChange}
                options={typeOptions}
                placeholder="Loại phòng"
              />

              <CustomDropdown
                name="price"
                value={searchParams.price}
                onChange={handleInputChange}
                options={priceOptions}
                placeholder="Khoảng giá"
              />

              <CustomDropdown
                name="amenity"
                value=""
                onChange={() => { }}
                options={amenityOptions}
                placeholder="Tiện ích"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="content-container">
          <div className="left-column">
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">Phòng trọ mới đăng</h2>
                <a href="#" className="view-all">Xem tất cả &gt;</a>
              </div>

              <div className="rooms-grid">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map(room => (
                    <RoomCard key={room.id} room={room} />
                  ))
                ) : (
                  <p className="no-results">Không tìm thấy phòng trọ phù hợp.</p>
                )}
              </div>
            </section>

            <section className="section cities-section">
              <div className="section-header">
                <div className="title-with-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                  <h2 className="section-title">Phòng trọ theo các tỉnh thành khác</h2>
                </div>
                <a href="#" className="view-all">Xem tất cả</a>
              </div>
              <div className="cities-grid">
                {citiesData.map(city => (
                  <div key={city.id} className="city-card">
                    <img src={city.image} alt={city.name} className="city-image" />
                    <div className="city-card-overlay">
                      <h3 className="city-card-name">{city.name}</h3>
                      <p className="city-card-count">Xem ngay {city.count} phòng trống tại đây</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="section faq-section">
              <div className="faq-header">
                <div className="wavy-line left"></div>
                <div className="faq-title-container">
                  <div className="faq-icon-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                  <h2 className="faq-title">Câu hỏi thường gặp về SmartRoom</h2>
                </div>
                <div className="wavy-line right"></div>
              </div>

              <div className="faq-list">
                {faqData.map((faq) => (
                  <div key={faq.id} className={`faq-item ${openFaq === faq.id ? 'open' : ''}`} onClick={() => toggleFaq(faq.id)}>
                    <div className="faq-question-row">
                      <div className="faq-question-left">
                        <div className="faq-q-icon">
                          {faq.icon === 'verified' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          {faq.icon === 'help' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>}
                          {faq.icon === 'users' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                          {faq.icon === 'chat' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
                        </div>
                        <span className="faq-question">{faq.question}</span>
                      </div>
                      <svg className="faq-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                    {openFaq === faq.id && (
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="right-column">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;
