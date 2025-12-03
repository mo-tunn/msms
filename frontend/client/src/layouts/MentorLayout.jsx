import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, clearAuth } from '../utils/authUtils';

const MentorLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isStudentManagementMenuOpen, setIsStudentManagementMenuOpen] = useState(false);
    const [isAnalyticsMenuOpen, setIsAnalyticsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    React.useEffect(() => {
        const auth = getAuth();
        if (auth) {
            setUser(auth.user);
        }
    }, []);

    // Check if current path is under Student Management or Analytics to keep menu open
    React.useEffect(() => {
        if (
            location.pathname.includes('/mentor/ders-programi') ||
            location.pathname.includes('/mentor/sinavlar') ||
            location.pathname.includes('/mentor/toplantilar') ||
            location.pathname.includes('/mentor/bildirimler')
        ) {
            setIsStudentManagementMenuOpen(true);
        }
        if (location.pathname.includes('/mentor/analizler')) {
            setIsAnalyticsMenuOpen(true);
        }
    }, [location.pathname]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/mentor/profil');
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark">
            <div className="flex flex-row min-h-screen">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#18212a] border-r border-[#e0e6ed] dark:border-[#202932] transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } flex flex-col justify-between p-4`}
                >
                    <div className="flex flex-col">
                        <div className="flex gap-3 items-center px-3 py-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined text-xl">school</span>
                            </div>
                            <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">MSMS Mentor</h2>
                            <button onClick={toggleSidebar} className="lg:hidden ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="border-t border-[#e0e6ed] dark:border-[#202932] my-2"></div>

                        <div className="flex flex-col gap-2">
                            <NavLink
                                to="/mentor/ana-sayfa"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                                        ? 'bg-primary/10 dark:bg-primary/20'
                                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                                    } cursor-pointer`
                                }
                            >
                                <span className={`material-symbols-outlined ${({ isActive }) => isActive ? 'text-primary' : 'text-[#617589] dark:text-gray-300'}`}>dashboard</span>
                                <p className={`${({ isActive }) => isActive ? 'text-primary' : 'text-[#111418] dark:text-white'} text-sm font-medium leading-normal`}>Ana Sayfa</p>
                            </NavLink>

                            {/* Student Management Dropdown */}
                            <div>
                                <div
                                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${isStudentManagementMenuOpen ? 'bg-black/5 dark:bg-white/5' : ''}`}
                                    onClick={() => setIsStudentManagementMenuOpen(!isStudentManagementMenuOpen)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[#617589] dark:text-gray-300">manage_accounts</span>
                                        <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Öğrenci Yönetimi</p>
                                    </div>
                                    <span className={`material-symbols-outlined text-[#617589] dark:text-gray-300 text-sm transition-transform duration-200 ${isStudentManagementMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </div>

                                {isStudentManagementMenuOpen && (
                                    <div className="pl-4 mt-1 flex flex-col gap-1">
                                        <NavLink
                                            to="/mentor/ders-programi"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                                                    ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#617589] dark:text-gray-400'
                                                } cursor-pointer`
                                            }
                                        >
                                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                                            <p className="text-sm font-medium leading-normal">Ders Programları</p>
                                        </NavLink>

                                        <NavLink
                                            to="/mentor/sinavlar"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                                                    ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#617589] dark:text-gray-400'
                                                } cursor-pointer`
                                            }
                                        >
                                            <span className="material-symbols-outlined text-sm">quiz</span>
                                            <p className="text-sm font-medium leading-normal">Sınavlar</p>
                                        </NavLink>

                                        <NavLink
                                            to="/mentor/toplantilar"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                                                    ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#617589] dark:text-gray-400'
                                                } cursor-pointer`
                                            }
                                        >
                                            <span className="material-symbols-outlined text-sm">groups</span>
                                            <p className="text-sm font-medium leading-normal">Toplantılar</p>
                                        </NavLink>

                                        <NavLink
                                            to="/mentor/bildirimler"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                                                    ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#617589] dark:text-gray-400'
                                                } cursor-pointer`
                                            }
                                        >
                                            <span className="material-symbols-outlined text-sm">notifications</span>
                                            <p className="text-sm font-medium leading-normal">Bildirimler</p>
                                        </NavLink>
                                    </div>
                                )}
                            </div>

                            {/* Student Analytics Dropdown */}
                            <div>
                                <div
                                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${isAnalyticsMenuOpen ? 'bg-black/5 dark:bg-white/5' : ''}`}
                                    onClick={() => setIsAnalyticsMenuOpen(!isAnalyticsMenuOpen)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[#617589] dark:text-gray-300">analytics</span>
                                        <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Öğrenci Analizleri</p>
                                    </div>
                                    <span className={`material-symbols-outlined text-[#617589] dark:text-gray-300 text-sm transition-transform duration-200 ${isAnalyticsMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </div>

                                {isAnalyticsMenuOpen && (
                                    <div className="pl-4 mt-1 flex flex-col gap-1">
                                        <NavLink
                                            to="/mentor/analizler/genel"
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                                                    ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#617589] dark:text-gray-400'
                                                } cursor-pointer`
                                            }
                                        >
                                            <span className="material-symbols-outlined text-sm">monitoring</span>
                                            <p className="text-sm font-medium leading-normal">Başarı Analizi</p>
                                        </NavLink>


                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="flex flex-col gap-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-left">
                            <span className="material-symbols-outlined text-[#617589] dark:text-gray-300">help</span>
                            <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Yardım</p>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-left"
                        >
                            <span className="material-symbols-outlined text-[#617589] dark:text-gray-300">logout</span>
                            <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Çıkış Yap</p>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e0e6ed] dark:border-[#202932] px-10 py-3 bg-white dark:bg-[#18212a] sticky top-0 z-10">
                        <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4">
                            <span className="material-symbols-outlined">menu</span>
                        </button>

                        <div className="flex flex-1 justify-end items-center gap-4">
                            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-transparent hover:bg-[#f0f2f4] dark:hover:bg-[#202932] text-[#111418] dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0">
                                <span className="material-symbols-outlined">dark_mode</span>
                            </button>

                            <div
                                className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-[#f0f2f4] dark:hover:bg-[#202932]"
                                onClick={handleProfileClick}
                            >
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <span>{user ? `${user.first_name[0]}${user.last_name[0]}` : 'M'}</span>
                                    )}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-semibold text-[#111418] dark:text-white leading-tight">{user ? `${user.first_name} ${user.last_name}` : 'Yükleniyor...'}</p>
                                    <p className="text-xs text-[#617589] dark:text-gray-400 leading-tight">{user?.title || 'Mentor'}</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-10">
                        <Outlet />
                    </div>
                </main>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={toggleSidebar}
                    />
                )}
            </div>
        </div>
    );
};

export default MentorLayout;
