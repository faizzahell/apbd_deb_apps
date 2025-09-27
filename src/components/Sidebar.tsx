import React, { useState, useEffect, useContext } from 'react';
import { User, Menu, X, ChevronRight, ChevronDown, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { menuItems } from '../constants/menuItem';
import { useActiveMenu } from '../hooks/useActiveMenu';
import { AuthContext } from "../contexts/AuthContext";
import LogoutConfirmModal from "./modal/LogoutConfirmModal";
import SettingsModal from "./modal/SettingsModal";

interface SidebarProps {
  onMenuClick?: (menu: string) => void;
}

const logo = "/logo-ugm.png";

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick = () => {} }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const activeMenu = useActiveMenu();
  const navigate = useNavigate();
  const { logout, auth } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed(!isCollapsed);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleMenuClick = (menuName: string) => {
    onMenuClick(menuName);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-80';
  const buttonPosition = isCollapsed ? 'left-24' : 'left-80 ml-4';

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`
          fixed top-6 z-50 p-3 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/20
          hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105
          ${window.innerWidth >= 1024 ? buttonPosition : (isSidebarOpen ? 'left-80 ml-4' : 'left-4')}
          lg:${buttonPosition}
        `}
      >
        {(isSidebarOpen || !isCollapsed) && window.innerWidth >= 1024 ? 
          <X className="w-5 h-5 text-blue-700" /> : 
          <Menu className="w-5 h-5 text-blue-700" />
        }
      </button>

      {isSidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 ${sidebarWidth}
        bg-gradient-to-b from-blue-800 to-cyan-800 shadow-2xl
        h-screen justify-between flex flex-col
        transform transition-all duration-300 ease-in-out
        ${isSidebarOpen || window.innerWidth >= 1024 ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <>
          <div className={`border-b border-white/10 ${isCollapsed ? 'p-3' : 'p-6'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'}`}>
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Logo UGM" 
                  className={`transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-14 h-14'}`} 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-blue-800 rounded-full shadow-sm"></div>
              </div>
              
              {!isCollapsed && (
                <div className="space-y-1 min-w-0">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    PORTAL APBD
                  </h1>
                  <p className="text-xs text-white/60 font-normal">
                    DEB SV UGM
                  </p>
                </div>
              )}
            </div>
          </div>

          <nav className={`flex-1 overflow-y-auto py-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {!isCollapsed && (
              <div className="mb-6 px-3">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Menu Utama
                </h3>
              </div>
            )}
            
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.name;

                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => handleMenuClick(item.name)}
                      className={`
                        group flex items-center rounded-xl font-medium transition-all duration-200 relative
                        ${isCollapsed ? 'p-3 mx-1 justify-center' : 'px-4 py-3 space-x-3'}
                        ${isActive
                          ? 'bg-white/10 shadow-inner text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }
                      `}
                      title={isCollapsed ? item.name : undefined}
                    >
                      {isActive && !isCollapsed && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-sm" />
                      )}
                      
                      <div className={`
                        flex items-center justify-center rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-white/20 text-white shadow-lg' 
                          : 'bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white'
                        }
                        ${isCollapsed ? 'w-8 h-8' : 'w-9 h-9'}
                      `}>
                        <Icon className={`${isCollapsed ? 'w-4 h-4' : 'w-5 h-5'}`} />
                      </div>
                      
                      {!isCollapsed && (
                        <>
                          <span className={`flex-1 text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                            {item.name}
                          </span>
                          {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>

        <div className={`border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`
                w-full flex items-center rounded-xl bg-white/10 border border-white/20 
                shadow-sm hover:shadow-md hover:bg-white/15 transition-all duration-200
                ${isCollapsed ? 'p-3 justify-center' : 'p-3 space-x-3'}
              `}
            >
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-blue-800 rounded-full"></div>
              </div>
              
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-white truncate">{auth.user?.name || "Guest"}</p>
                    <p className="text-xs text-white/60 truncate">{auth.user?.role === 'student' ? 'Mahasiswa' : 'Dosen'}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {userMenuOpen && !isCollapsed && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 z-10">
                <div className="py-2">
                  <button onClick={() => setShowSettingModal(true)} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                    <Settings className="w-4 h-4" />
                    <span>Pengaturan</span>
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <LogoutConfirmModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
      {showSettingModal && <SettingsModal onClose={() => setShowSettingModal(false)} />}
    </>
  );
};

export default Sidebar;