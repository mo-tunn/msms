import React from 'react';

const HelpPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Paneli Nasıl Kullanırım?</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">MSMS öğrenci panelindeki özellikleri en verimli şekilde kullanmanız için hazırladığımız güncel rehber.</p>
            </div>

            {/* Ana Sayfa */}
            <div className="bg-white dark:bg-[#18212a] rounded-2xl p-6 border border-gray-200 dark:border-[#202932] shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined text-2xl">home</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ana Sayfa</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Panelinizin kontrol merkezi. Buradan:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1 feature-list">
                            <li><strong>Özet İstatistikler:</strong> TYT ve AYT genel net ortalamalarınızı anlık takip edin.</li>
                            <li><strong>Hava Durumu:</strong> Bulunduğunuz konuma göre güncel hava durumu bilgisini görün.</li>
                            <li><strong>Bildirimler:</strong> Ok okunmamış bildirimlerinizi sağ üst köşeden kontrol edin.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Ders Programı */}
            <div className="bg-white dark:bg-[#18212a] rounded-2xl p-6 border border-gray-200 dark:border-[#202932] shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                        <span className="material-symbols-outlined text-2xl">calendar_month</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ders Programı</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Haftalık çalışma rutininizi planlayın ve takip edin.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1 feature-list">
                            <li>Mentorunuz tarafından atanan programı görüntüleyin.</li>
                            <li>Tamamladığınız çalışmaları işaretleyerek ilerlemenizi kaydedin.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Sınavlar */}
            <div className="bg-white dark:bg-[#18212a] rounded-2xl p-6 border border-gray-200 dark:border-[#202932] shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                        <span className="material-symbols-outlined text-2xl">quiz</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sınavlarım</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Deneme sınavı performansınızı analiz edin.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1 feature-list">
                            <li>Girdiğiniz tüm TYT ve AYT deneme sonuçlarını listeyin.</li>
                            <li>Her sınavın detayına giderek ders bazlı doğru/yanlış ve netlerinizi inceleyin.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Analizler */}
            <div className="bg-white dark:bg-[#18212a] rounded-2xl p-6 border border-gray-200 dark:border-[#202932] shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                        <span className="material-symbols-outlined text-2xl">monitoring</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analizler</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Gelişiminizi görsel grafiklerle izleyin.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1 feature-list">
                            <li><strong>Çalışma Isı Haritası:</strong> Hangi günlerde ne kadar yoğun çalıştığınızı renkli ısı haritasında görün.</li>
                            <li><strong>Seri Takibi:</strong> Aralıksız çalışma günlerinizi takip ederek "streak" yapın.</li>
                            <li><strong>Ders Dağılımı:</strong> Hangi derse ne kadar ağırlık verdiğinizi pasta grafikleriyle inceleyin.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Yapay Zeka - Kitap Analizi */}
            <div className="bg-white dark:bg-[#18212a] rounded-2xl p-6 border border-gray-200 dark:border-[#202932] shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Yapay Zeka: Kitap Analizi</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Okumayı düşündüğünüz kitaplar için yapay zeka destekli öngörüler.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1 feature-list">
                            <li><strong>Satış Tahmini:</strong> Kitabın özelliklerine göre tahmini satış adedini öğrenin.</li>
                            <li><strong>Sınav Uygunluğu:</strong> Kitabın popülerliğine göre sınavlarda soru kaynağı olma ihtimalini değerlendirin.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* İletişim */}
            <div className="bg-white dark:bg-[#18212a] rounded-2xl p-6 border border-gray-200 dark:border-[#202932] shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
                        <span className="material-symbols-outlined text-2xl">forum</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">İletişim</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Mentorlarınızla her zaman bağlantıda kalın.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1 feature-list">
                            <li><strong>Mesajlar:</strong> Tüm mentorlarınızı listeleyin ve WhatsApp üzerinden hızlıca iletişime geçin.</li>
                            <li><strong>Toplantılar:</strong> Planlanan online veya yüz yüze görüşmelerinizi takip edin.</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HelpPage;
