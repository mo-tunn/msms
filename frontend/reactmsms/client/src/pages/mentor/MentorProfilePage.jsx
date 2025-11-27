import React, { useState } from 'react';

const MentorProfilePage = () => {
    // Mock students data (expanded for pagination)
    const students = [
        { name: 'Ahmet Yılmaz', grade: '12. Sınıf', school: 'Atatürk Lisesi' },
        { name: 'Ayşe Demir', grade: '11. Sınıf', school: 'Fen Lisesi' },
        { name: 'Mehmet Kaya', grade: 'Mezun', school: 'Anadolu Lisesi' },
        { name: 'Zeynep Çelik', grade: '12. Sınıf', school: 'Fen Lisesi' },
        { name: 'Can Yıldız', grade: '10. Sınıf', school: 'Atatürk Lisesi' },
        { name: 'Elif Şahin', grade: '11. Sınıf', school: 'Anadolu Lisesi' },
        { name: 'Burak Öz', grade: '12. Sınıf', school: 'Fen Lisesi' },
        { name: 'Selin Arslan', grade: '9. Sınıf', school: 'Kolej' },
        { name: 'Mert Koç', grade: 'Mezun', school: 'Anadolu Lisesi' },
        { name: 'Gamze Ak', grade: '11. Sınıf', school: 'Fen Lisesi' },
        { name: 'Deniz Can', grade: '12. Sınıf', school: 'Atatürk Lisesi' },
        { name: 'Ece Su', grade: '10. Sınıf', school: 'Kolej' },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;

    // Get current students
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (
        <>
            <div className="flex flex-wrap justify-between gap-3 mb-6">
                <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Profilim</p>
            </div>
            <div className="mb-8 @container">
                <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                                SY
                            </div>
                            <button className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                                <span className="material-symbols-outlined text-base">photo_camera</span>
                            </button>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Dr. Selin Yılmaz</p>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Matematik Mentoru</p>

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
                                <p className="text-gray-800 dark:text-gray-200 font-medium">Selin</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Soyad</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">Yılmaz</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Doğum Tarihi</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">15/05/1985</p>
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
                        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Uzmanlık ve İstatistikler</h2>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors">
                            <span className="material-symbols-outlined text-base">edit</span>
                            <span className="truncate">Düzenle</span>
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Uzmanlık Alanı</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">TYT/AYT Matematik, Geometri</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1">Aktif Öğrenci Sayısı</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">12</p>
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
                                <p className="text-gray-800 dark:text-gray-200 font-medium">selin.yilmaz@edukoc.com</p>
                            </div>
                            <div>
                                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Telefon Numarası</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">+90 505 123 45 67</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Adres</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">Eğitim Mah. Okul Sok. No:1, Kadıköy, İstanbul</p>
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

                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center px-6 pb-3 pt-5 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Sorumlu Olduğu Öğrenciler</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {currentStudents.map((student, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                            {student.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-gray-900 dark:text-white font-medium text-sm">{student.name}</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs">{student.grade} • {student.school}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Toplam <span className="font-medium text-gray-900 dark:text-white">{students.length}</span> öğrenciden <span className="font-medium text-gray-900 dark:text-white">{indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, students.length)}</span> arası gösteriliyor
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">chevron_left</span>
                                </button>
                                {Array.from({ length: Math.ceil(students.length / studentsPerPage) }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginate(i + 1)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(students.length / studentsPerPage)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MentorProfilePage;
