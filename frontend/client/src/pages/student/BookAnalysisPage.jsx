import React, { useState, useEffect } from 'react';
import { predictBookSales } from '../../services/api';

const BookAnalysisPage = () => {
    // Feature list from model_features.json
    const rawFeatures = [
        "Favorilere Ekleyen Kişi Sayısı", "Okuyacağım olarak işaretlenmiş sayısı", "Okudum olarak işaretlenmiş sayısı",
        "Liste Fiyatı", "Sayfa Sayısı", "Toplam Yorum Sayısı", "Puan", "Oy_Sayisi", "Yayin_Yili", "En", "Boy", "Yazar_Kitap_Sayisi",
        "Yayınevi_DESTEK YAYIN GRUBU-KAMPANYA", "Yayınevi_Diğer", "Yayınevi_EPONA KİTAP", "Yayınevi_FİHRİST KİTAP",
        "Yayınevi_HAYY KİTAP - KAMPANYA", "Yayınevi_PEGASUS YAYINLARI", "Yayınevi_SARMAL KİTABEVİ",
        "Yayınevi_SAY YAYIN GRUBU-KAMPANYA", "Yayınevi_URZENİ", "Yayınevi_YEDİVEREN YAYIN GRUBU - KAMPANYA",
        "Ana_Kategori_Diğer", "Ana_Kategori_Edebiyat", "Ana_Kategori_Felsefe-Düşünce", "Ana_Kategori_Kişisel Gelişim",
        "Ana_Kategori_Siyaset", "Ana_Kategori_Sosyoloji", "Ana_Kategori_Tarih", "Ana_Kategori_Çocuk Kitapları",
        "Ana_Kategori_İslam"
    ];

    const [publishers, setPublishers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [numericalFeatures, setNumericalFeatures] = useState([]);

    const [formData, setFormData] = useState({});
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const extractedPublishers = [];
        const extractedCategories = [];
        const extractedNumerical = [];

        rawFeatures.forEach(feature => {
            if (feature.startsWith("Yayınevi_")) {
                extractedPublishers.push(feature.replace("Yayınevi_", ""));
            } else if (feature.startsWith("Ana_Kategori_")) {
                extractedCategories.push(feature.replace("Ana_Kategori_", ""));
            } else {
                extractedNumerical.push(feature);
            }
        });

        setPublishers(extractedPublishers);
        setCategories(extractedCategories);
        setNumericalFeatures(extractedNumerical);

        // Initialize form data
        const initialData = {};
        extractedNumerical.forEach(f => initialData[f] = "");
        initialData["Yayınevi"] = extractedPublishers[0] || "";
        initialData["Ana_Kategori"] = extractedCategories[0] || "";
        setFormData(initialData);

    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const fillRandomData = () => {
        const randomData = { ...formData };
        numericalFeatures.forEach(f => {
            // Generate somewhat realistic random numbers based on feature name
            if (f.includes("Puan")) randomData[f] = (Math.random() * 5 + 5).toFixed(1); // 5-10
            else if (f.includes("Yili")) randomData[f] = Math.floor(Math.random() * (2024 - 1990) + 1990);
            else if (f.includes("Fiyat")) randomData[f] = Math.floor(Math.random() * 500 + 50);
            else if (f.includes("Sayfa")) randomData[f] = Math.floor(Math.random() * 1000 + 100);
            else randomData[f] = Math.floor(Math.random() * 10000);
        });

        // Pick random categorical options
        if (publishers.length > 0) {
            randomData["Yayınevi"] = publishers[Math.floor(Math.random() * publishers.length)];
        }
        if (categories.length > 0) {
            randomData["Ana_Kategori"] = categories[Math.floor(Math.random() * categories.length)];
        }

        setFormData(randomData);
    };

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            // Prepare data for the model
            // The model expects one-hot encoded features for categories
            const modelInput = {};

            // Add numerical features directly
            numericalFeatures.forEach(f => {
                modelInput[f] = parseFloat(formData[f]) || 0;
            });

            // Handle one-hot encoding for publishers
            publishers.forEach(p => {
                const key = `Yayınevi_${p}`;
                modelInput[key] = formData["Yayınevi"] === p ? 1.0 : 0.0;
            });

            // Handle one-hot encoding for categories
            categories.forEach(c => {
                const key = `Ana_Kategori_${c}`;
                modelInput[key] = formData["Ana_Kategori"] === c ? 1.0 : 0.0;
            });

            const result = await predictBookSales(modelInput);

            if (result.success) {
                setPrediction(Math.round(result.predicted_sales));
            } else {
                setError("Tahmin alınamadı.");
            }
        } catch (err) {
            console.error("Prediction error:", err);
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-[#5a4fcf] text-white p-6 rounded-t-lg shadow-md">
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <div>
                        <h1 className="text-2xl font-bold">Kitap Satış Adedi Tahmin Modeli</h1>
                        <p className="text-sm opacity-90">kitapyurdu.com verileri ile eğitildi.</p>
                    </div>
                </div>
            </div>

            {/* Explanation - Moved to Top */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-900/30 shadow-sm">
                <h4 className="font-bold text-[#2c3e50] dark:text-white mb-2 flex items-center gap-2 text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5a4fcf] dark:text-[#7c73e6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Satış Sayısı ve Sınav İlişkisi
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ÖSYM ve diğer sınav hazırlama komiteleri, paragraf sorularını seçerken genellikle toplumda karşılık bulmuş, çok okunan ve edebi değeri yüksek eserlerden alıntılar yapmayı tercih ederler.
                    Satış sayısının yüksek olması, kitabın popülerliğini ve dil kullanımının güncel kabul gördüğünü işaret eder. Bu nedenle, <strong className="text-gray-900 dark:text-white">çok satan kitapların sınavlarda soru kaynağı olarak kullanılma ihtimali istatistiksel olarak daha yüksektir.</strong>
                </p>
            </div>

            {/* Categorical Features */}
            <div className="bg-white dark:bg-[#18212a] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#202932]">
                <h2 className="text-[#5a4fcf] dark:text-[#7c73e6] font-bold text-lg mb-4">Kategorik Özellikler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yayınevi</label>
                        <select
                            name="Yayınevi"
                            value={formData["Yayınevi"] || ""}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#5a4fcf] focus:border-transparent outline-none bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                        >
                            {publishers.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ana Kategori</label>
                        <select
                            name="Ana_Kategori"
                            value={formData["Ana_Kategori"] || ""}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#5a4fcf] focus:border-transparent outline-none bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Numerical Features */}
            <div className="bg-white dark:bg-[#18212a] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#202932]">
                <h2 className="text-[#5a4fcf] dark:text-[#7c73e6] font-bold text-lg mb-4">Sayısal Özellikler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {numericalFeatures.map(feature => (
                        <div key={feature}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {feature.replace(/_/g, " ")}
                            </label>
                            <input
                                type="number"
                                name={feature}
                                value={formData[feature] || ""}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#5a4fcf] focus:border-transparent outline-none bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white"
                                placeholder="0"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={fillRandomData}
                    className="bg-[#7c73e6] hover:bg-[#6960d4] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Örnek Veri Doldur
                </button>
                <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="bg-[#4338ca] hover:bg-[#3730a3] disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    )}
                    {loading ? 'Tahmin Ediliyor...' : 'Tahmin Et'}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Prediction Result */}
            {prediction !== null && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-[#f0fdf4] dark:bg-green-900/20 border border-[#dcfce7] dark:border-green-900/30 p-8 rounded-lg text-center shadow-md">
                        <h3 className="text-xl font-bold text-[#166534] dark:text-green-400 mb-2">Tahmin Sonucu</h3>
                        <div className="text-6xl font-extrabold text-[#4338ca] dark:text-[#7c73e6] mb-2 tracking-tight">
                            {prediction}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">adet satılacağı tahmin ediliyor.</p>
                    </div>

                    {/* Feedback Message */}
                    <div className={`p-8 rounded-xl border-2 shadow-lg transition-all duration-500 transform hover:scale-[1.01] ${prediction < 200 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/30 text-yellow-900 dark:text-yellow-100' :
                        prediction < 450 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30 text-blue-900 dark:text-blue-100' :
                            'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900/30 text-purple-900 dark:text-purple-100'
                        }`}>
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${prediction < 200 ? 'bg-yellow-100' :
                                prediction < 450 ? 'bg-blue-100' :
                                    'bg-purple-100'
                                }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mb-2">Yapay Zeka Önerisi</h4>
                                <p className="text-lg leading-relaxed opacity-90">
                                    {prediction < 200
                                        ? "Bu kitap henüz geniş kitlelere ulaşmamış görünüyor. Sınav komisyonları genellikle toplumda yer etmiş, çok okunan eserleri tercih ettiğinden, bu kitaptan soru gelme ihtimali düşüktür. Yine de edebi zevkiniz için okuyabilirsiniz."
                                        : prediction < 450
                                            ? "Bu kitap belirli bir popülariteye ulaşmış ve okurlar arasında ilgi görüyor. Sınavlarda karşınıza çıkma ihtimali mevcuttur. Özellikle dil ve anlatım özellikleri bakımından incelenmeye değer olabilir."
                                            : "Bu kitap çok popüler ve geniş bir okur kitlesine sahip. ÖSYM, dil hakimiyetini ölçmek için bu tarz yaygın eserleri sıklıkla tercih eder. Sınavda paragraf veya anlam bilgisi sorusu olarak karşınıza çıkma ihtimali oldukça yüksektir."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-gray-400 text-sm mt-8 pb-4">
                Bu model %75.61 oranda doğru çalışıyor. Yapay Zeka Hata Yapabilir.
            </div>
        </div>
    );
};

export default BookAnalysisPage;
