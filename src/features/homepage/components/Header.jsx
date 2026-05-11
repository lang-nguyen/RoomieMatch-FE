import { useState, useEffect, useRef } from 'react';
import '../Homepage.css';

const navItems = [
  { id: 'home', label: 'Trang chủ' },
  { id: 'find-room', label: 'Tìm trọ' },
  { id: 'find-mate', label: 'Tìm bạn' },
  { id: 'contact', label: 'Liên hệ' },
];

const Header = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    // Determine which item to highlight
    const targetIndex = hoverIndex !== null ? hoverIndex : activeIndex;
    const navContainer = navRef.current;

    if (navContainer) {
      const navLinks = navContainer.querySelectorAll('.nav-link');
      if (navLinks[targetIndex]) {
        const targetEl = navLinks[targetIndex];
        // calculate left and width relative to the nav container
        setIndicatorStyle({
          left: targetEl.offsetLeft + 'px',
          width: targetEl.offsetWidth + 'px'
        });
      }
    }
  }, [activeIndex, hoverIndex]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <span className="logo-text">RoomieMatch</span>
        </div>

        <nav className="nav-links" ref={navRef}>
          {/* Background Indicator that slides */}
          <div className="nav-indicator" style={indicatorStyle}>
            <div className="indicator-curve-left"></div>
            <div className="indicator-curve-right"></div>
          </div>

          {navItems.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${(hoverIndex !== null ? hoverIndex === index : activeIndex === index) ? 'active' : ''}`}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(index);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a href="login" className="nav-link login-link">Đăng nhập</a>
          <button className="icon-btn wishlist-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <div className="user-icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
