import React, { useState, useEffect } from 'react';
import { getUser, updateUser } from '../../services/api';
import { getAuth } from '../../utils/authUtils';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Form Data
    const [editFormData, setEditFormData] = useState({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const auth = getAuth();
            if (auth && auth.user && auth.user.id) {
                const userData = await getUser(auth.user.id);
                setUser(userData);
                setEditFormData({
                    phone: userData.phone || '',
                    address: userData.address || ''
                });
            } else {
                setError('Oturum bilgisi bulunamadı.');
            }
        } catch (err) {
            setError('Kullanıcı bilgileri yüklenemedi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(user.id, editFormData);
            setSuccessMessage('Profil bilgileri güncellendi.');
            setIsEditModalOpen(false);
            fetchUser(); // Refresh data
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert('Güncelleme başarısız: ' + err.message);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Yeni şifreler eşleşmiyor!');
            return;
        }
        try {
            await updateUser(user.id, { password: passwordData.newPassword });
            setSuccessMessage('Şifre başarıyla değiştirildi.');
            setIsPasswordModalOpen(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert('Şifre değiştirme başarısız: ' + err.message);
        }
    };

    if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
    if (!user) return <div className="p-8 text-center text-red-500">Kullanıcı bulunamadı.</div>;

    const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

    return (
        <>
            <div className="flex flex-wrap justify-between gap-3 mb-6">
                <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Profilim</p>
            </div>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400">
                    <span className="material-symbols-outlined">check_circle</span>
                    {successMessage}
                </div>
            )}

            <div className="mb-8 @container">
                <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <div className="bg-primary/10 text-primary flex items-center justify-center rounded-full size-32 text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
                                {initials}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">{user.first_name} {user.last_name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                                {user.grade_level ? `${user.grade_level}. Sınıf` : 'Öğrenci'}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Hedef: {user.field || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Kişisel Bilgiler */}
                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-6 pb-3 pt-5 border-b border-gray-200 dark:border-gray-800">Kişisel Bilgiler</h2>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Ad</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.first_name}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Soyad</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.last_name}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Doğum Tarihi</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.birth_date ? new Date(user.birth_date).toLocaleDateString() : '-'}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">TC Kimlik Numarası</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.tckn ? `${user.tckn.substring(0, 2)}*******${user.tckn.substring(9)}` : '***********'}</p>
                            </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-4">Bu bilgiler resmi kayıtlardan alınmıştır ve düzenlenemez.</p>
                    </div>
                </div>

                {/* Akademik Bilgiler */}
                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center px-6 pb-3 pt-5 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Akademik Bilgiler</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Okul</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.school_name || '-'}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Sınıf</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.grade_level ? `${user.grade_level}. Sınıf` : '-'}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Alan</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.field || '-'}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Okul Başarı Puanı (OBP)</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.school_score || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* İletişim ve Tercihler */}
                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center px-6 pb-3 pt-5 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">İletişim ve Tercihler</h2>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">edit</span>
                            <span className="truncate">Düzenle</span>
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">E-posta</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Telefon Numarası</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.phone || '-'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Adres</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{user.address || '-'}</p>
                            </div>
                            <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <span className="material-symbols-outlined text-lg">lock_reset</span>
                                    Şifreni Değiştir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">İletişim Bilgilerini Düzenle</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon</label>
                                <input
                                    type="tel"
                                    value={editFormData.phone}
                                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adres</label>
                                <textarea
                                    rows="3"
                                    value={editFormData.address}
                                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Şifre Değiştir</h3>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yeni Şifre</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yeni Şifre (Tekrar)</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium"
                                >
                                    Şifreyi Güncelle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfilePage;
