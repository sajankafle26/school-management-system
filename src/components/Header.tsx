'use client';

import React, { useState } from 'react';
import type { User, AcademicYear } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  academicYears: AcademicYear[];
  selectedAcademicYear: string;
  setSelectedAcademicYear: (year: string) => void;
  isViewingWebsite: boolean;
  setIsViewingWebsite: (viewing: boolean) => void;
  onToggleSidebar: () => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar, currentPage }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="app-header navbar navbar-expand" style={{
      backgroundColor: '#fff',
      borderBottom: '1px solid #dee2e6',
      height: '57px',
      padding: 0,
    }}>
      <div className="container-fluid d-flex align-items-center px-3" style={{ height: '100%' }}>
        {/* Left side */}
        <div className="d-flex align-items-center" style={{ gap: '0.25rem' }}>
          <button
            onClick={onToggleSidebar}
            className="nav-link d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              background: 'none',
              color: '#212529',
              cursor: 'pointer',
              borderRadius: '0.25rem',
            }}
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
          <a href="#" className="nav-link d-none d-md-flex align-items-center gap-1 px-2 py-1" style={{ color: '#212529', textDecoration: 'none', fontSize: '0.875rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></svg>
              Live Preview
          </a>
        </div>

        {/* Right side */}
        <div className="d-flex align-items-center ms-auto" style={{ gap: '0.25rem' }}>
          {/* Messages */}
          <div className="nav-item dropdown" style={{ position: 'relative' }}>
            <button
              className="nav-link d-flex align-items-center justify-content-center position-relative"
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                background: 'none',
                color: '#212529',
                cursor: 'pointer',
                borderRadius: '0.25rem',
              }}
              aria-label="Messages"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
              </svg>
              <span className="position-absolute top-0 end-0 badge rounded-pill" style={{ fontSize: '0.6rem', padding: '2px 5px', backgroundColor: '#dc3545', color: '#fff', transform: 'translate(25%, -25%)' }}>3</span>
            </button>
          </div>

          {/* Notifications */}
          <div className="nav-item dropdown" style={{ position: 'relative' }}>
            <button
              className="nav-link d-flex align-items-center justify-content-center position-relative"
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                background: 'none',
                color: '#212529',
                cursor: 'pointer',
                borderRadius: '0.25rem',
              }}
              aria-label="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
              </svg>
              <span className="position-absolute top-0 end-0 badge rounded-pill" style={{ fontSize: '0.6rem', padding: '2px 5px', backgroundColor: '#ffc107', color: '#212529', transform: 'translate(25%, -25%)' }}>15</span>
            </button>
          </div>

          {/* Fullscreen toggle */}
          <div className="nav-item">
            <button
              className="nav-link d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                background: 'none',
                color: '#212529',
                cursor: 'pointer',
                borderRadius: '0.25rem',
              }}
              aria-label="Toggle fullscreen"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
              </svg>
            </button>
          </div>

          {/* User dropdown */}
          <div className="nav-item dropdown user-menu" style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="d-flex align-items-center gap-2 nav-link"
              style={{
                border: 'none',
                background: 'none',
                color: '#212529',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '0.25rem',
              }}
            >
              <div className="d-flex align-items-center justify-content-center rounded-circle overflow-hidden flex-shrink-0" style={{ width: '33px', height: '33px', backgroundColor: '#007bff' }}>
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>{user.name.charAt(0)}</span>
                )}
              </div>
              <span className="d-none d-md-inline" style={{ fontSize: '0.875rem' }}>{user.name}</span>
            </button>

            {showUserMenu && (
              <>
                <div
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1030 }}
                  onClick={() => setShowUserMenu(false)}
                />
                <div
                  className="dropdown-menu dropdown-menu-end show"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 1040,
                    minWidth: '280px',
                    padding: 0,
                    border: '1px solid rgba(0,0,0,0.15)',
                    borderRadius: '0.375rem',
                    boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.175)',
                    backgroundColor: '#fff',
                  }}
                >
                  {/* User header */}
                  <div className="d-flex flex-column align-items-center py-4" style={{ backgroundColor: '#007bff', color: '#fff' }}>
                    <div className="d-flex align-items-center justify-content-center rounded-circle overflow-hidden mb-2" style={{ width: '90px', height: '90px', border: '3px solid rgba(255,255,255,0.5)' }}>
                      <div className="d-flex align-items-center justify-content-center w-100 h-100" style={{ backgroundColor: '#0056b3' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 700 }}>{user.name.charAt(0)}</span>
                      </div>
                    </div>
                    <p className="mb-0 fw-semibold" style={{ fontSize: '1rem' }}>{user.name}</p>
                    <small style={{ fontSize: '0.8rem', opacity: 0.85 }}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</small>
                  </div>

                  {/* Menu body */}
                  <div className="py-2 px-3 border-bottom" style={{ borderColor: '#dee2e6' }}>
                    <div className="row text-center">
                      <div className="col-4">
                        <a href="#" className="d-block py-2" style={{ color: '#212529', textDecoration: 'none', fontSize: '0.875rem' }}>Followers</a>
                      </div>
                      <div className="col-4">
                        <a href="#" className="d-block py-2" style={{ color: '#212529', textDecoration: 'none', fontSize: '0.875rem' }}>Sales</a>
                      </div>
                      <div className="col-4">
                        <a href="#" className="d-block py-2" style={{ color: '#212529', textDecoration: 'none', fontSize: '0.875rem' }}>Friends</a>
                      </div>
                    </div>
                  </div>

                  {/* Menu footer */}
                  <div className="py-3 px-3 d-flex justify-content-between">
                    <button className="btn btn-sm px-3 py-1" style={{ border: '1px solid #6c757d', color: '#6c757d', backgroundColor: 'transparent' }}>Profile</button>
                    <button onClick={onLogout} className="btn btn-sm px-3 py-1" style={{ border: '1px solid #dc3545', color: '#dc3545', backgroundColor: 'transparent' }}>Sign out</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;