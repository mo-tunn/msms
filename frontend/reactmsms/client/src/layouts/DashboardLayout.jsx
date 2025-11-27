import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
    const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
    const location = useLocation();

    // Check if current path is under AI suggestions to keep menu open
    React.useEffect(() => {
        if (location.pathname.includes('/app/yapay-zeka')) {
            setIsAiMenuOpen(true);
        }
    }, [location.pathname]);

    const [isAnalysisMenuOpen, setIsAnalysisMenuOpen] = useState(false);
    const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);

    // Check if current path is under Analysis to keep menu open
    React.useEffect(() => {
        if (location.pathname.includes('/app/analizler') || location.pathname.includes('/app/sinavlarim')) {
            setIsAnalysisMenuOpen(true);
        }
    }, [location.pathname]);

    // Check if current path is under Help (Messages) to keep menu open
    React.useEffect(() => {
        if (location.pathname.includes('/app/mesajlar')) {
            setIsHelpMenuOpen(true);
        }
    }, [location.pathname]);

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark">
            <div className="flex flex-row min-h-screen">
                <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#18212a] border-r border-[#e0e6ed] dark:border-[#202932]">
                    <div className="flex h-full flex-col justify-between p-4">
                        <div className="flex flex-col">
                            <div className="flex gap-3 items-center px-3 py-2 mb-4">
                                <div className="size-8 text-primary">
                                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
                                    </svg>
                                </div>
                                <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">MSMS</h2>
                            </div>
                            <div className="border-t border-[#e0e6ed] dark:border-[#202932] my-2"></div>
                            <div className="flex flex-col gap-2">
                                <NavLink to="/app/ana-sayfa" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-black/5 dark:hover:bg-white/5'} cursor-pointer`}>
                                    <span className={`material-symbols-outlined ${({ isActive }) => isActive ? 'text-primary' : 'text-[#617589] dark:text-gray-300'}`}>home</span>
                                    <p className={`${({ isActive }) => isActive ? 'text-primary' : 'text-[#111418] dark:text-white'} text-sm font-medium leading-normal`}>Ana Sayfa</p>
                                </NavLink>
                                <NavLink to="/app/ders-programi" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-black/5 dark:hover:bg-white/5'} cursor-pointer`}>
                                    <span className="material-symbols-outlined text-[#617589] dark:text-gray-300">calendar_month</span>
                                    <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Ders Programı</p>
                                </NavLink>


                                <div>
                                    <div
                                        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${isAiMenuOpen ? 'bg-black/5 dark:bg-white/5' : ''}`}
                                        onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#617589] dark:text-gray-300">auto_awesome</span>
                                            <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Yapay Zeka Önerileri</p>
                                        </div>
                                        <span className={`material-symbols-outlined text-[#617589] dark:text-gray-300 text-sm transition-transform duration-200 ${isAiMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                    </div>

                                    {isAiMenuOpen && (
                                        <div className="pl-4 mt-1 flex flex-col gap-1">
                                            <NavLink to="/app/yapay-zeka/kitap-analizi" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#617589] dark:text-gray-400'} cursor-pointer`}>
                                                <span className="material-symbols-outlined text-sm">menu_book</span>
                                                <p className="text-sm font-medium leading-normal">Bu kitabı okusam mı?</p>
                                            </NavLink>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div
                                        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${isAnalysisMenuOpen ? 'bg-black/5 dark:bg-white/5' : ''}`}
                                        onClick={() => setIsAnalysisMenuOpen(!isAnalysisMenuOpen)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#617589] dark:text-gray-300">bar_chart</span>
                                            <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Analizler</p>
                                        </div>
                                        <span className={`material-symbols-outlined text-[#617589] dark:text-gray-300 text-sm transition-transform duration-200 ${isAnalysisMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                    </div>

                                    {isAnalysisMenuOpen && (
                                        <div className="pl-4 mt-1 flex flex-col gap-1">
                                            <NavLink to="/app/sinavlarim" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#617589] dark:text-gray-400'} cursor-pointer`}>
                                                <span className="material-symbols-outlined text-sm">quiz</span>
                                                <p className="text-sm font-medium leading-normal">Sınavlarım</p>
                                            </NavLink>
                                            <NavLink to="/app/analizler" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#617589] dark:text-gray-400'} cursor-pointer`}>
                                                <span className="material-symbols-outlined text-sm">monitoring</span>
                                                <p className="text-sm font-medium leading-normal">Disiplin</p>
                                            </NavLink>
                                        </div>
                                    )}
                                </div>
                                <NavLink to="/app/toplantilar" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-black/5 dark:hover:bg-white/5'} cursor-pointer`}>
                                    <span className="material-symbols-outlined text-[#617589] dark:text-gray-300">groups</span>
                                    <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Toplantılar</p>
                                </NavLink>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div>
                                {isHelpMenuOpen && (
                                    <div className="pl-4 mb-1 flex flex-col gap-1">
                                        <NavLink to="/app/mesajlar" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#617589] dark:text-gray-400'} cursor-pointer`}>
                                            <span className="material-symbols-outlined text-sm">mail</span>
                                            <p className="text-sm font-medium leading-normal">Mesajlar</p>
                                        </NavLink>
                                        <NavLink to="/app/nasil-kullanirim" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#617589] dark:text-gray-400'} cursor-pointer`}>
                                            <span className="material-symbols-outlined text-sm">info</span>
                                            <p className="text-sm font-medium leading-normal">Paneli nasıl kullanırım?</p>
                                        </NavLink>
                                    </div>
                                )}
                                <div
                                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer ${isHelpMenuOpen ? 'bg-black/5 dark:bg-white/5' : ''}`}
                                    onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[#617589] dark:text-gray-300">help</span>
                                        <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Yardım</p>
                                    </div>
                                    <span className={`material-symbols-outlined text-[#617589] dark:text-gray-300 text-sm transition-transform duration-200 ${isHelpMenuOpen ? 'rotate-180' : ''}`}>expand_less</span>
                                </div>
                            </div>
                            <NavLink to="/login" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                                <span className="material-symbols-outlined text-[#617589] dark:text-gray-300">logout</span>
                                <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal">Çıkış Yap</p>
                            </NavLink>
                        </div>
                    </div>
                </aside>
                <main className="flex-1 flex flex-col">
                    <header className="flex items-center justify-end whitespace-nowrap border-b border-solid border-[#e0e6ed] dark:border-[#202932] px-10 py-3 bg-white dark:bg-[#18212a] sticky top-0 z-10">
                        <div className="flex flex-1 justify-end items-center gap-4">
                            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-transparent hover:bg-[#f0f2f4] dark:hover:bg-[#202932] text-[#111418] dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0">
                                <span className="material-symbols-outlined">dark_mode</span>
                            </button>
                            <NavLink
                                to="/app/bildirimler"
                                className={({ isActive }) =>
                                    `flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-transparent hover:bg-[#f0f2f4] dark:hover:bg-[#202932] text-[#111418] dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 ${isActive ? 'bg-[#f0f2f4] dark:bg-[#202932] text-primary dark:text-primary' : ''}`
                                }
                            >
                                <span className="material-symbols-outlined">notifications</span>
                            </NavLink>
                            <NavLink to="/app/profilim" className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-[#f0f2f4] dark:hover:bg-[#202932]">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC3lpE8euLT9EZ_uezBe9Hp6u6sDgxqEWC4xfc6-ZI2nUi83cQbRp98EZxJmc59JKvnHW8vGspHcq-MuQRSbGqbRhTYIFa183Wa9ThN1Y8mxxdhAdVDPq-o_a5N_F_TI6Y-7xmSHr2Z_szYORgA7GNnujolQlJcZEZ5WgwVELGO_nnpqduTR0sYjmzuqYMsuIzjTwXOHAIWeHzHEJ8lyDAR9Q6lns3a5QKh68wPnBa_dqDD_6zlYiNyUVNi1NYcbe6qFAYiIIpP3s2W")' }}></div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-[#111418] dark:text-white leading-tight">Emre Yılmaz</p>
                                    <p className="text-xs text-[#617589] dark:text-gray-400 leading-tight">Öğrenci</p>
                                </div>
                            </NavLink>
                        </div>
                    </header>
                    <div className="p-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
