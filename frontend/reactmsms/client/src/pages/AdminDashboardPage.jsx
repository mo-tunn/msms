import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('student');
    const [successMessage, setSuccessMessage] = useState('');

    // User Management State
    const [users, setUsers] = useState([
        { id: 1, name: 'Ahmet Yılmaz', type: 'student', email: 'ahmet@ogrenci.com', role: '12. Sınıf', school: 'Atatürk Lisesi' },
        { id: 2, name: 'Ayşe Demir', type: 'student', email: 'ayse@ogrenci.com', role: '11. Sınıf', school: 'Fen Lisesi' },
        { id: 3, name: 'Dr. Selin Yılmaz', type: 'mentor', email: 'selin@edukoc.com', role: 'Matematik', school: '-' },
        { id: 4, name: 'Mehmet Kaya', type: 'student', email: 'mehmet@ogrenci.com', role: 'Mezun', school: 'Anadolu Lisesi' },
    ]);
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Mock student list for mentor assignment (for registration form)
    const students = [
        { id: 1, name: 'Ahmet Yılmaz' },
        { id: 2, name: 'Ayşe Demir' },
        { id: 3, name: 'Mehmet Kaya' },
        { id: 4, name: 'Zeynep Çelik' },
    ];

    const handleLogout = () => {
        navigate('/login');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage('Kayıt başarıyla oluşturuldu!');
        setTimeout(() => setSuccessMessage(''), 3000);
        e.target.reset();
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        setIsEditModalOpen(false);
        setSuccessMessage('Kullanıcı bilgileri güncellendi!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
            setUsers(users.filter(u => u.id !== id));
            setSuccessMessage('Kullanıcı silindi.');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-500">admin_panel_settings</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Yönetici Paneli</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="hidden sm:inline">Çıkış Yap</span>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
                    <button
                        onClick={() => setActiveTab('student')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'student'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">school</span>
                        Öğrenci Kayıt
                    </button>
                    <button
                        onClick={() => setActiveTab('mentor')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'mentor'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">person_celebrate</span>
                        Mentor Kayıt
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'users'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">manage_accounts</span>
                        Kullanıcı Yönetimi
                    </button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400 animate-in fade-in slide-in-from-top-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        {successMessage}
                    </div>
                )}

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm">
                    {activeTab === 'student' && (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Yeni Öğrenci Kaydı</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sisteme yeni bir öğrenci eklemek için tüm bilgileri eksiksiz doldurun.</p>
                            </div>

                            {/* Kişisel Bilgiler */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Kişisel Bilgiler</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Ad</label>
                                        <input required type="text" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Örn: Ali" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Soyad</label>
                                        <input required type="text" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Örn: Yılmaz" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Doğum Tarihi</label>
                                        <input required type="date" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">TC Kimlik Numarası</label>
                                        <input required type="text" maxLength="11" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="11 haneli TC No" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Şifre</label>
                                        <input required type="password" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="******" />
                                    </div>
                                </div>
                            </div>

                            {/* Akademik Bilgiler */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Akademik Bilgiler</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Okul</label>
                                        <input required type="text" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Örn: Atatürk Anadolu Lisesi" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Sınıf / Seviye</label>
                                        <select className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                            <option>9. Sınıf</option>
                                            <option>10. Sınıf</option>
                                            <option>11. Sınıf</option>
                                            <option>12. Sınıf (YKS)</option>
                                            <option>Mezun</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Alan</label>
                                        <select className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                            <option>Sayısal</option>
                                            <option>Eşit Ağırlık</option>
                                            <option>Sözel</option>
                                            <option>Dil</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Okul Başarı Puanı (OBP)</label>
                                        <input type="number" step="0.01" max="100" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Örn: 92.50" />
                                    </div>
                                </div>
                            </div>



                            {/* İletişim Bilgileri */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">İletişim Bilgileri</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">E-posta</label>
                                        <input required type="email" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="ornek@ogrenci.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Telefon</label>
                                        <input required type="tel" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="05XX XXX XX XX" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Adres</label>
                                        <textarea className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px]" placeholder="Açık adres giriniz..." />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end border-t border-gray-200 dark:border-gray-700">
                                <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined">save</span>
                                    Öğrenciyi Kaydet
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'mentor' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Yeni Mentor Kaydı</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sisteme yeni bir mentor eklemek ve öğrenci atamak için bilgileri doldurun.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Ad</label>
                                    <input required type="text" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Örn: Selin" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Soyad</label>
                                    <input required type="text" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Örn: Yılmaz" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Unvan</label>
                                    <input required type="text" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Örn: Matematik Mentoru" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Uzmanlık Alanı</label>
                                    <input required type="text" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Örn: TYT/AYT Matematik, Geometri" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">E-posta</label>
                                    <input required type="email" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="mentor@edukoc.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Telefon</label>
                                    <input required type="tel" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="05XX XXX XX XX" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Şifre</label>
                                    <input required type="password" className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="******" />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Atanacak Öğrenciler</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg max-h-48 overflow-y-auto">
                                        {students.map(student => (
                                            <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{student.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Birden fazla öğrenci seçebilirsiniz.</p>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined">save</span>
                                    Mentoru Kaydet
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Kayıtlı Kullanıcılar</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sistemdeki tüm öğrenci ve mentorları yönetin.</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Kullanıcı ara..."
                                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                    <span className="material-symbols-outlined absolute left-3 top-2 text-gray-400 text-lg">search</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-3">Ad Soyad</th>
                                            <th className="px-6 py-3">Tip</th>
                                            <th className="px-6 py-3">Rol / Uzmanlık</th>
                                            <th className="px-6 py-3">Okul</th>
                                            <th className="px-6 py-3">E-posta</th>
                                            <th className="px-6 py-3 text-right">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${user.type === 'student'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                        }`}>
                                                        {user.type === 'student' ? 'Öğrenci' : 'Mentor'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.role}</td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.school}</td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleEditClick(user)}
                                                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                    >
                                                        Düzenle
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="text-red-600 dark:text-red-400 hover:underline font-medium"
                                                    >
                                                        Sil
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Modal */}
            {isEditModalOpen && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Kullanıcı Düzenle ({editingUser.type === 'student' ? 'Öğrenci' : 'Mentor'})</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-6">
                            {/* Ortak Alanlar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ad Soyad</label>
                                    <input
                                        type="text"
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-posta</label>
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon</label>
                                    <input
                                        type="tel"
                                        placeholder="05XX XXX XX XX"
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">TC Kimlik No</label>
                                    <input
                                        type="text"
                                        maxLength="11"
                                        placeholder="11 haneli TC No"
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doğum Tarihi</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yeni Şifre</label>
                                    <input
                                        type="password"
                                        placeholder="Değiştirmek için girin..."
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adres</label>
                                    <textarea
                                        rows="2"
                                        placeholder="Açık adres..."
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Öğrenciye Özel Alanlar */}
                            {editingUser.type === 'student' && (
                                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Akademik Bilgiler</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Okul</label>
                                            <input
                                                type="text"
                                                value={editingUser.school}
                                                onChange={(e) => setEditingUser({ ...editingUser, school: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sınıf / Seviye</label>
                                            <select
                                                value={editingUser.role}
                                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            >
                                                <option>9. Sınıf</option>
                                                <option>10. Sınıf</option>
                                                <option>11. Sınıf</option>
                                                <option>12. Sınıf</option>
                                                <option>Mezun</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alan</label>
                                            <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                                <option>Sayısal</option>
                                                <option>Eşit Ağırlık</option>
                                                <option>Sözel</option>
                                                <option>Dil</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OBP</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                max="100"
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                    </div>


                                </div>
                            )}

                            {/* Mentora Özel Alanlar */}
                            {editingUser.type === 'mentor' && (
                                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Uzmanlık Bilgileri</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unvan</label>
                                            <input
                                                type="text"
                                                placeholder="Örn: Matematik Mentoru"
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Uzmanlık Alanı</label>
                                            <input
                                                type="text"
                                                value={editingUser.role}
                                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 z-10">
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
        </div>
    );
};

export default AdminDashboardPage;
