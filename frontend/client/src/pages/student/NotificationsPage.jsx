import React from 'react';

const NotificationsPage = () => {
    return (
        <>
            <div className="flex flex-wrap justify-between items-center gap-3 pb-4">
                <h1 className="text-[#111418] dark:text-gray-100 text-3xl font-black tracking-tight">Bildirimler</h1>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-3">
                <div className="w-full sm:w-auto">
                    <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-200/50 dark:bg-gray-800/50 p-1">
                        <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-3 sm:px-4 has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:bg-gray-900 text-[#617589] dark:text-gray-400 text-sm font-medium leading-normal transition-colors duration-200">
                            <span className="truncate">Tümü</span>
                            <input defaultChecked className="invisible w-0" name="notification_filter" type="radio" value="Tümü" />
                        </label>
                        <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-3 sm:px-4 has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:bg-gray-900 text-[#617589] dark:text-gray-400 text-sm font-medium leading-normal transition-colors duration-200">
                            <span className="truncate">Akademik</span>
                            <input className="invisible w-0" name="notification_filter" type="radio" value="Akademik" />
                        </label>
                        <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-3 sm:px-4 has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:bg-gray-900 text-[#617589] dark:text-gray-400 text-sm font-medium leading-normal transition-colors duration-200">
                            <span className="truncate">Duyurular</span>
                            <input className="invisible w-0" name="notification_filter" type="radio" value="Duyurular" />
                        </label>
                        <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-3 sm:px-4 has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:bg-gray-900 text-[#617589] dark:text-gray-400 text-sm font-medium leading-normal transition-colors duration-200">
                            <span className="truncate">Hatırlatma</span>
                            <input className="invisible w-0" name="notification_filter" type="radio" value="Hatırlatma" />
                        </label>
                        <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-3 sm:px-4 has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:bg-gray-900 text-[#617589] dark:text-gray-400 text-sm font-medium leading-normal transition-colors duration-200">
                            <span className="truncate">Motivasyon</span>
                            <input className="invisible w-0" name="notification_filter" type="radio" value="Motivasyon" />
                        </label>
                        <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-3 sm:px-4 has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:bg-gray-900 text-[#617589] dark:text-gray-400 text-sm font-medium leading-normal transition-colors duration-200">
                            <span className="truncate">Mesajlar</span>
                            <input className="invisible w-0" name="notification_filter" type="radio" value="Mesajlar" />
                        </label>
                    </div>
                </div>
                <div className="flex w-full sm:w-auto gap-2">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/60 text-sm" placeholder="Bildirimlerde ara..." type="search" />
                    </div>
                    <button className="flex items-center justify-center h-10 px-4 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"> Hepsini Okundu İşaretle </button>
                </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-4 bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-transparent hover:border-primary/50 dark:hover:border-primary/60 transition-colors duration-200 cursor-pointer relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1.5 bg-primary rounded-r-full"></div>
                    <div className="text-green-500 flex items-center justify-center rounded-lg bg-green-500/10 dark:bg-green-500/20 shrink-0 size-12">
                        <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[#111418] dark:text-gray-100 text-base font-semibold leading-normal line-clamp-1">Psikolojiye Giriş dersi için yeni not girildi.</p>
                        <p className="text-green-600 dark:text-green-400 text-sm font-normal leading-normal line-clamp-2">Akademik</p>
                    </div>
                    <div className="shrink-0 text-right">
                        <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">2 saat önce</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-transparent hover:border-primary/50 dark:hover:border-primary/60 transition-colors duration-200 cursor-pointer relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1.5 bg-primary rounded-r-full"></div>
                    <div className="text-yellow-500 flex items-center justify-center rounded-lg bg-yellow-500/10 dark:bg-yellow-500/20 shrink-0 size-12">
                        <span className="material-symbols-outlined text-2xl">event_upcoming</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[#111418] dark:text-gray-100 text-base font-semibold leading-normal line-clamp-1">Prof. Dr. Yılmaz ile olan toplantınıza 1 saat kaldı.</p>
                        <p className="text-yellow-600 dark:text-yellow-400 text-sm font-normal leading-normal line-clamp-2">Hatırlatma</p>
                    </div>
                    <div className="shrink-0 text-right">
                        <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">58 dakika önce</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-transparent hover:border-primary/50 dark:hover:border-primary/60 transition-colors duration-200 cursor-pointer relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1.5 bg-primary rounded-r-full"></div>
                    <div className="text-purple-500 flex items-center justify-center rounded-lg bg-purple-500/10 dark:bg-purple-500/20 shrink-0 size-12">
                        <span className="material-symbols-outlined text-2xl">celebration</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[#111418] dark:text-gray-100 text-base font-semibold leading-normal line-clamp-1">Harika gidiyorsun! Bu hafta hedeflerinin %80'ini tamamladın.</p>
                        <p className="text-purple-600 dark:text-purple-400 text-sm font-normal leading-normal line-clamp-2">Motivasyon</p>
                    </div>
                    <div className="shrink-0 text-right">
                        <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">2 saat önce</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-transparent hover:border-primary/50 dark:hover:border-primary/60 transition-colors duration-200 cursor-pointer opacity-70">
                    <div className="text-red-500 flex items-center justify-center rounded-lg bg-red-500/10 dark:bg-red-500/20 shrink-0 size-12">
                        <span className="material-symbols-outlined text-2xl">campaign</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[#111418] dark:text-gray-100 text-base font-medium leading-normal line-clamp-1">25 Aralık'ta üniversite genelinde bakım çalışması planlanmıştır.</p>
                        <p className="text-red-600 dark:text-red-400 text-sm font-normal leading-normal line-clamp-2">Duyuru</p>
                    </div>
                    <div className="shrink-0 text-right">
                        <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">1 gün önce</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-transparent hover:border-primary/50 dark:hover:border-primary/60 transition-colors duration-200 cursor-pointer opacity-70">
                    <div className="text-blue-500 flex items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/20 shrink-0 size-12">
                        <span className="material-symbols-outlined text-2xl">chat</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[#111418] dark:text-gray-100 text-base font-medium leading-normal line-clamp-1">Ayşe Kaya'dan yeni bir mesajınız var.</p>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-normal leading-normal line-clamp-2">Mesaj</p>
                    </div>
                    <div className="shrink-0 text-right">
                        <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">3 gün önce</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;
