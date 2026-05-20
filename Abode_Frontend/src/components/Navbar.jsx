import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, PlusCircle, LogOut, Bell } from 'lucide-react';

const Navbar = ({ onOpenNewRoom }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUsername = localStorage.getItem('username') || 'User';
  
  // Ref to track the notification dropdown container for click-outside detection
  const notifRef = useRef(null);

  // Notification Dropdown States
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Someone upvoted your post in #Java", unread: true },
    { id: 2, text: "Welcome to Abode community platform!", unread: true }
  ]);

  // Handle closing the notification popover when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };

    if (showNotifDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showNotifDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('authenticationToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const clearNotifications = (e) => {
    e.stopPropagation(); // Avoid triggering outside-click toggles unexpectedly
    setNotifications([]);
    setShowNotifDropdown(false);
  };

  const isActive = (path) => location.pathname === path;
  const hasUnread = notifications.some(n => n.unread);

  return (
    <header className="nav-console">
      <style>{`
        .nav-console {
          width: 100%;
          height: 60px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          box-sizing: border-box;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Inter', sans-serif;
          color: white;
        }

        /* Branding Platform */
        .nav-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .brand-icon {
          width: 32px;
          height: 32px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #3b82f6;
          font-size: 15px;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
        }
        .brand-text { font-size: 18px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.02em; }

        /* Navigation Links Console */
        .nav-links-cluster { display: flex; align-items: center; gap: 6px; margin-left: 28px; }
        @media (max-width: 768px) { .nav-links-cluster { display: none; } }
        
        .nav-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          color: #64748b;
          transition: 0.2s;
        }
        .nav-pill:hover { color: #f1f5f9; background: rgba(255, 255, 255, 0.03); }
        .nav-pill.active { color: #3b82f6; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.05); }

        /* Right User Management Controls */
        .nav-actions { display: flex; align-items: center; gap: 16px; position: relative; }
        
        .nav-utility-wrapper { position: relative; display: flex; align-items: center; }
        .nav-utility-btn {
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }
        .nav-utility-btn:hover, .nav-utility-btn.active { color: #f1f5f9; background: rgba(255, 255, 255, 0.04); }
        .nav-badge { position: absolute; top: 8px; right: 8px; width: 5px; height: 5px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 8px #3b82f6; }

        /* Cyber Glass Notification Box Dropdown Layout */
        .notif-dropdown {
          position: absolute;
          top: 48px;
          right: 210px;
          width: 280px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid #1e293b;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          padding: 6px;
          z-index: 120;
        }
        .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid #1e293b; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
        .notif-clear { background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 11px; font-weight: 700; }
        .notif-clear:hover { text-decoration: underline; }
        .notif-item { padding: 10px 12px; font-size: 12px; color: #cbd5e1; border-radius: 8px; border-bottom: 1px solid rgba(30, 41, 59, 0.3); text-align: left; }
        .notif-item:last-child { border-bottom: none; }
        .notif-empty { padding: 20px 12px; font-size: 12px; color: #475569; text-align: center; }

        .nav-create-btn {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          padding: 9px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: 0.2s;
        }
        .nav-create-btn:hover { background: #3b82f6; color: white; box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
        .nav-divider { width: 1px; height: 20px; background: #1e293b; }

        .profile-cluster { display: flex; align-items: center; gap: 10px; }
        .profile-avatar {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: white;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }
        .profile-info { display: flex; flex-direction: column; text-align: left; }
        @media (max-width: 768px) { .profile-info { display: none; } }
        
        .profile-name { font-size: 12px; font-weight: 700; color: #f1f5f9; line-height: 1.2; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .profile-status { font-size: 10px; color: #64748b; font-weight: 500; }

        .nav-logout-btn { background: none; border: none; color: #475569; cursor: pointer; padding: 8px; border-radius: 6px; display: flex; transition: 0.2s; }
        .nav-logout-btn:hover { color: #ef4444; background: rgba(239, 68, 68, 0.08); }
        
        .icon-inline { display: inline-flex; align-items: center; justify-content: center; }
      `}</style>

      {/* LEFT ARCHITECTURE: Identity & Global Tabs */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" className="nav-brand">
          <div className="brand-icon">A</div>
          <span className="brand-text">abode</span>
        </Link>

        <nav className="nav-links-cluster">
          <Link to="/" className={`nav-pill ${isActive('/') ? 'active' : ''}`}>
            <HomeIcon size={13} className="icon-inline" />
            <span>Feed</span>
          </Link>
          <Link to="/create-post" className={`nav-pill ${isActive('/create-post') ? 'active' : ''}`}>
            <PlusCircle size={13} className="icon-inline" />
            <span>Create</span>
          </Link>
        </nav>
      </div>

      {/* RIGHT ARCHITECTURE: Activated Notification Overlay & Profile Matrix */}
      <div className="nav-actions" ref={notifRef}>
        <div className="nav-utility-wrapper">
          <button 
            type="button"
            className={`nav-utility-btn ${showNotifDropdown ? 'active' : ''}`}
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            title="Notifications"
          >
            <Bell size={15} />
            {hasUnread && <span className="nav-badge" />}
          </button>
        </div>

        {/* Floating Notification Popover Dropdown */}
        {showNotifDropdown && (
          <div className="notif-dropdown">
            <div className="notif-header">
              <span>Alert Monitor</span>
              {notifications.length > 0 && (
                <button type="button" className="notif-clear" onClick={clearNotifications}>Dismiss All</button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="notif-empty">No unread alerts. System clear.</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="notif-item">{n.text}</div>
              ))
            )}
          </div>
        )}

        <button type="button" onClick={onOpenNewRoom} className="nav-create-btn">
          + Create Room
        </button>

        <div className="nav-divider" />

        <div className="profile-cluster">
          <div className="profile-avatar">
            {currentUsername.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="profile-name">{currentUsername}</span>
            <span className="profile-status">Online</span>
          </div>
          <button type="button" onClick={handleLogout} className="nav-logout-btn" title="Sign Out">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;