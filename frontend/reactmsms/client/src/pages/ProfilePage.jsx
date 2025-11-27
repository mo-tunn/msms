import React from 'react';

const ProfilePage = () => {
    return (
        <>
            <div className="flex flex-wrap justify-between gap-3 mb-6">
                <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Profilim</p>
            </div>
            <div className="mb-8 @container">
                <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32" data-alt="Profile picture of Cem Yılmaz" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPLb_lGb-ZulAP_MUEte4KTwmtMiz9ulp1g5iMNHDl4CvcxFwB0rXJpuRSAzJW02Y8Blmai0epmLicFB8xAKrqk2cguAcxC5FiUY_zOEhtrCu6G5f1k0Tcv60MkfYfUA9aQcn-wBKxislUn8oUt8hERZqj_4UDaa_fI-KOg-_4ZQJwU_fwnEbcBNY3QuPekhOACvPCd7tSM-sa_x0G-NOnIsUtvb3TDQIRxeDLbK5dFd_VOgH8vuTZ28B06z0tndgqy8ayrTJ5wuUE")' }}></div>
                            <button className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                                <span className="material-symbols-outlined text-base">photo_camera</span>
                            </button>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Cem Yılmaz</p>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">YKS 2024 Adayı</p>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Hedef: Sayısal</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-8">
                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-6 pb-3 pt-5 border-b border-gray-200 dark:border-gray-800">Kişisel Bilgiler</h2>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Ad</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">Cem</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Soyad</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">Yılmaz</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Doğum Tarihi</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">01/01/2006</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">TC Kimlik Numarası</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">************</p>
                            </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-4">Bu bilgiler resmi kayıtlardan alınmıştır ve düzenlenemez.</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center px-6 pb-3 pt-5 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Akademik Bilgiler</h2>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors">
                            <span className="material-symbols-outlined text-base">edit</span>
                            <span className="truncate">Düzenle</span>
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Okul</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">İstanbul Atatürk Fen Lisesi</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Sınıf</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">12. Sınıf</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Alan</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">Sayısal</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Okul Başarı Puanı (OBP)</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">92.50 / 100</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center px-6 pb-3 pt-5 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">İletişim ve Tercihler</h2>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors">
                            <span className="material-symbols-outlined text-base">edit</span>
                            <span className="truncate">Düzenle</span>
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">E-posta</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">cem.yilmaz@email.com</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Telefon Numarası</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">+90 555 123 4567</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Adres</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">Örnek Mah. Atatürk Cad. No:123, 34000, İstanbul</p>
                            </div>
                            <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium">
                                    <span className="material-symbols-outlined text-lg">lock_reset</span>
                                    Şifreni Değiştir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
