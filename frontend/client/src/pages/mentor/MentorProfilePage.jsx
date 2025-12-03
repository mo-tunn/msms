import React, { useState, useEffect } from 'react';
import { getUser, updateUser, getStudentsByMentor } from '../../services/api';
import { getAuth } from '../../utils/authUtils';

const MentorProfilePage = () => {
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

    // Students Data
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;

    // Get current students
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        fetchUserAndStudents();
    }, []);

    const fetchUserAndStudents = async () => {
        try {
            const auth = getAuth();
            if (auth && auth.user && auth.user.id) {
                // Fetch User
                const userData = await getUser(auth.user.id);
                setUser(userData);
                setEditFormData({
                    phone: userData.phone || '',
                    address: userData.address || '',
                    title: userData.title || '',
                    branch: userData.branch || ''
                });

                // Fetch Students
                const studentsData = await getStudentsByMentor(auth.user.id);
                setStudents(studentsData);
            } else {
                setError('Oturum bilgisi bulunamadı.');
            }
        } catch (err) {
            setError('Bilgiler yüklenemedi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(user.id, editFormData);
            setSuccessMessage('Profil başarıyla güncellendi.');
            setIsEditModalOpen(false);
            fetchUserAndStudents(); // Refresh data
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Güncelleme başarısız oldu.');
            console.error(err);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Yeni şifreler eşleşmiyor.');
            return;
        }
        try {
            await updateUser(user.id, {
                password: passwordData.newPassword
            });
            setSuccessMessage('Şifre başarıyla değiştirildi.');
            setIsPasswordModalOpen(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Şifre değiştirilemedi.');
            console.error(err);
        }
    };

    if (loading) return <div className="p-4">Yükleniyor...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-[#111418] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">Profilim</h1>
                <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">Kişisel bilgilerinizi ve tercihlerinizi buradan yönetebilirsiniz.</p>
            </div>

            {/* Messages */}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">{successMessage}</div>}

            {/* Profile Card */}
            <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-[#18212a] p-6 rounded-xl border border-[#e0e6ed] dark:border-[#202932]">
                <div className="flex flex-col items-center gap-4 min-w-[200px]">
                    <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold overflow-hidden">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <span>{user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` : 'M'}</span>
                        )}
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-[#111418] dark:text-white">{user?.first_name} {user?.last_name}</h2>
                        <p className="text-[#617589] dark:text-gray-400">{user?.title || 'Mentor'}</p>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-4">Kişisel Bilgiler</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-[#617589] dark:text-gray-400">E-posta</p>
                                <p className="text-[#111418] dark:text-white font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#617589] dark:text-gray-400">Telefon</p>
                                <p className="text-[#111418] dark:text-white font-medium">{user?.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#617589] dark:text-gray-400">TC Kimlik No</p>
                                <p className="text-[#111418] dark:text-white font-medium">{user?.tckn ? `*******${user.tckn.slice(-4)}` : '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#617589] dark:text-gray-400">Adres</p>
                                <p className="text-[#111418] dark:text-white font-medium">{user?.address || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-4">Mesleki Bilgiler</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-[#617589] dark:text-gray-400">Branş</p>
                                <p className="text-[#111418] dark:text-white font-medium">{user?.branch || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#617589] dark:text-gray-400">Unvan</p>
                                <p className="text-[#111418] dark:text-white font-medium">{user?.title || 'Mentor'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Bilgileri Düzenle</span>
                </button>
                <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#18212a] border border-[#e0e6ed] dark:border-[#202932] text-[#111418] dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-[#202932]/80 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>Şifre Değiştir</span>
                </button>
            </div>

            {/* Assigned Students */}
            <div className="bg-white dark:bg-[#18212a] p-6 rounded-xl border border-[#e0e6ed] dark:border-[#202932]">
                <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-4">Sorumlu Olduğum Öğrenciler</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#e0e6ed] dark:border-[#202932]">
                                <th className="py-3 px-4 text-sm font-medium text-[#617589] dark:text-gray-400">Ad Soyad</th>
                                <th className="py-3 px-4 text-sm font-medium text-[#617589] dark:text-gray-400">Sınıf</th>
                                <th className="py-3 px-4 text-sm font-medium text-[#617589] dark:text-gray-400">Okul</th>
                                <th className="py-3 px-4 text-sm font-medium text-[#617589] dark:text-gray-400">Alan</th>
                                <th className="py-3 px-4 text-sm font-medium text-[#617589] dark:text-gray-400">Risk Durumu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStudents.length > 0 ? (
                                currentStudents.map((student, index) => (
                                    <tr key={index} className="border-b border-[#e0e6ed] dark:border-[#202932] last:border-0 hover:bg-gray-50 dark:hover:bg-[#202932]/50">
                                        <td className="py-3 px-4 text-[#111418] dark:text-white font-medium">{student.first_name} {student.last_name}</td>
                                        <td className="py-3 px-4 text-[#111418] dark:text-white">{student.grade_level}. Sınıf</td>
                                        <td className="py-3 px-4 text-[#111418] dark:text-white">{student.school_name}</td>
                                        <td className="py-3 px-4 text-[#111418] dark:text-white">{student.field}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.risk_status === 'Riskli' ? 'bg-red-100 text-red-700' :
                                                    student.risk_status === 'Dengeli' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {student.risk_status || 'Belirsiz'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-gray-500">Henüz atanmış öğrenci bulunmamaktadır.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {students.length > studentsPerPage && (
                    <div className="flex justify-center mt-4 gap-2">
                        {Array.from({ length: Math.ceil(students.length / studentsPerPage) }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${currentPage === i + 1
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 dark:bg-[#202932] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#202932]/80'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#18212a] rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-[#111418] dark:text-white">Bilgileri Düzenle</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Telefon</label>
                                <input
                                    type="text"
                                    value={editFormData.phone || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[#e0e6ed] dark:border-[#202932] bg-white dark:bg-[#18212a] text-[#111418] dark:text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Adres</label>
                                <textarea
                                    value={editFormData.address || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[#e0e6ed] dark:border-[#202932] bg-white dark:bg-[#18212a] text-[#111418] dark:text-white focus:outline-none focus:border-primary"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Unvan</label>
                                <input
                                    type="text"
                                    value={editFormData.title || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[#e0e6ed] dark:border-[#202932] bg-white dark:bg-[#18212a] text-[#111418] dark:text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Branş</label>
                                <input
                                    type="text"
                                    value={editFormData.branch || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, branch: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[#e0e6ed] dark:border-[#202932] bg-white dark:bg-[#18212a] text-[#111418] dark:text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202932] rounded-lg"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#18212a] rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-[#111418] dark:text-white">Şifre Değiştir</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Mevcut Şifre</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[#e0e6ed] dark:border-[#202932] bg-white dark:bg-[#18212a] text-[#111418] dark:text-white focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Yeni Şifre</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[#e0e6ed] dark:border-[#202932] bg-white dark:bg-[#18212a] text-[#111418] dark:text-white focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Yeni Şifre (Tekrar)</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[#e0e6ed] dark:border-[#202932] bg-white dark:bg-[#18212a] text-[#111418] dark:text-white focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202932] rounded-lg"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                >
                                    Değiştir
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorProfilePage;
