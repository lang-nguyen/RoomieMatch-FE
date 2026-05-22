import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Header.css';

const navItems = [
  { id: 'home', label: 'Trang chủ', path: '/' },
  { id: 'find-room', label: 'Tìm trọ', path: '/find-room' },
  { id: 'find-mate', label: 'Tìm bạn', path: '/find-mate' },
  { id: 'contact', label: 'Liên hệ', path: '/contact' },
];

const Header = ({ initialActiveId = 'home' }) => {
  const location = useLocation();
  const linkRefs = useRef([]);

  const initialIndex = navItems.findIndex((item) => item.id === initialActiveId);

  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [visualIndex, setVisualIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [isReady, setIsReady] = useState(false);

  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
    opacity: 0,
  });

  useEffect(() => {
    const normalizedPath =
      location.pathname.length > 1 && location.pathname.endsWith('/')
        ? location.pathname.slice(0, -1)
        : location.pathname;

    const matchedIndex = navItems.findIndex((item) => item.path === normalizedPath);

    if (matchedIndex >= 0) {
      setActiveIndex(matchedIndex);
      setVisualIndex(matchedIndex);
      return;
    }

    const fallbackIndex = navItems.findIndex((item) => item.id === initialActiveId);

    if (fallbackIndex >= 0) {
      setActiveIndex(fallbackIndex);
      setVisualIndex(fallbackIndex);
    }
  }, [location.pathname, initialActiveId]);

  useLayoutEffect(() => {
    let animationFrame;

    const updateIndicator = () => {
      const targetEl = linkRefs.current[visualIndex];
      if (!targetEl) return;

      setIndicatorStyle({
        width: targetEl.offsetWidth,
        left: targetEl.offsetLeft,
        opacity: 1,
      });

      animationFrame = requestAnimationFrame(() => {
        setIsReady(true);
      });
    };

    updateIndicator();

    window.addEventListener('resize', updateIndicator);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [visualIndex]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <div className="logo-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>

          <span className="logo-text">RoomieMatch</span>
        </div>

        <nav
          className={`nav-links ${isReady ? 'ready' : ''}`}
          onMouseLeave={() => setVisualIndex(activeIndex)}
        >
          <div
            className="nav-indicator"
            style={{
              width: `${indicatorStyle.width}px`,
              left: `${indicatorStyle.left}px`,
              opacity: indicatorStyle.opacity,
            }}
          >
            <span className="indicator-curve indicator-curve-left" />
            <span className="indicator-curve indicator-curve-right" />
          </div>

          {navItems.map((item, index) => (
            <NavLink
              key={item.id}
              to={item.path}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              className={`nav-link ${visualIndex === index ? 'selected' : ''}`}
              onMouseEnter={() => setVisualIndex(index)}
              onClick={() => {
                setActiveIndex(index);
                setVisualIndex(index);
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <NavLink to="/login" className="login-link">
            Đăng nhập
          </NavLink>

          <button className="icon-btn wishlist-btn" type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <div className="user-icon-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
