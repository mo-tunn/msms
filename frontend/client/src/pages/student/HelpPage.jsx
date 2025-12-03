import React from 'react';

const HelpPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Paneli Nasıl Kullanırım?</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">MSMS panelindeki özellikleri en verimli şekilde kullanmanız için hazırladığımız rehber.</p>
            </div>

            {/* Ana Sayfa */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-2xl">home</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ana Sayfa</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Ana sayfa, panelinize giriş yaptığınızda sizi karşılayan ekrandır. Burada:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1">
                            <li>Günlük özetinizi görebilirsiniz.</li>
                            <li>Yaklaşan görevlerinizi ve sınavlarınızı takip edebilirsiniz.</li>
                            <li>Genel ilerleme durumunuzu grafiklerle inceleyebilirsiniz.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Ders Programı */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined text-2xl">calendar_month</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ders Programı</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Haftalık çalışma planınızı buradan yönetebilirsiniz.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1">
                            <li><strong>Görev Ekle:</strong> Yeni bir çalışma veya ders eklemek için "Görev Ekle" butonunu kullanın.</li>
                            <li><strong>Sürükle & Bırak:</strong> Görevlerinizi günler arasında sürükleyerek planınızı kolayca güncelleyebilirsiniz.</li>
                            <li><strong>Tamamlandı İşaretleme:</strong> Yaptığınız çalışmaları kutucuğa tıklayarak tamamlandı olarak işaretleyin.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Sınavlarım */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                        <span className="material-symbols-outlined text-2xl">quiz</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sınavlarım</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Deneme sınavlarınızı ve sonuçlarınızı buradan takip edin.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1">
                            <li>Girdiğiniz TYT ve AYT denemelerini sisteme kaydedin.</li>
                            <li>Netlerinizi ve puanlarınızı detaylı olarak görün.</li>
                            <li>Gelişim grafikleri ile performansınızı analiz edin.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Analizler (Disiplin) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                        <span className="material-symbols-outlined text-2xl">monitoring</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Disiplin (Analizler)</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Çalışma disiplininizi ve sürekliliğinizi ölçen bölümdür.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1">
                            <li>Haftalık çalışma saatlerinizi görüntüleyin.</li>
                            <li>Ders bazlı çalışma dağılımınızı inceleyin.</li>
                            <li>Hedeflerinize ne kadar yaklaştığınızı görün.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Yapay Zeka */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Yapay Zeka Önerileri</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Size özel akıllı öneriler sunan asistanınız.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1">
                            <li><strong>Kitap Analizi:</strong> Okumayı düşündüğünüz bir kitabın size uygunluğunu yapay zekaya sorabilirsiniz.</li>
                            <li>Çalışma programınız için kişiselleştirilmiş tavsiyeler alın.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Toplantılar & Mesajlar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                        <span className="material-symbols-outlined text-2xl">groups</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">İletişim (Toplantılar & Mesajlar)</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Mentorunuzla iletişimde kalmanızı sağlayan araçlar.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-1">
                            <li><strong>Toplantılar:</strong> Planlanan görüşmelerinizi görün ve katılın.</li>
                            <li><strong>Mesajlar:</strong> Mentorunuza hızlıca soru sorun veya durum bildirimi yapın.</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HelpPage;
