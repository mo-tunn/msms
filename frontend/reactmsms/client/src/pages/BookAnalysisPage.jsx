import React, { useState } from 'react';

const BookAnalysisPage = () => {
    const [formData, setFormData] = useState({
        bookName: '',
        pageCount: '',
        subject: '',
        authorTotalBooks: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate AI analysis delay
        setTimeout(() => {
            setResult({
                message: "Bu kitap AI analizine göre çok popülerdir. Popüler kitap içerikleri sınavlarda sıkça sorulur.",
                score: 85,
                details: "Kitabın konusu ve yazarın yetkinliği, bu eserin edebi değerini artırmaktadır. Sınav müfredatına uygunluğu yüksektir."
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-[#111418] dark:text-gray-100 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Kitap Analizi</h1>
                <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">
                    Yapay zeka ile kitapların sınavlara uygunluğunu ve popülaritesini analiz edin.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal" htmlFor="bookName">Kitap Adı</label>
                            <input
                                required
                                type="text"
                                id="bookName"
                                name="bookName"
                                value={formData.bookName}
                                onChange={handleInputChange}
                                className="h-11 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-2.5 text-[#111418] dark:text-gray-200 text-sm focus:border-primary focus:outline-none focus:ring-0 placeholder:text-[#9ca3af]"
                                placeholder="Örn: Suç ve Ceza"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal" htmlFor="pageCount">Sayfa Sayısı</label>
                            <input
                                required
                                type="number"
                                id="pageCount"
                                name="pageCount"
                                value={formData.pageCount}
                                onChange={handleInputChange}
                                className="h-11 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-2.5 text-[#111418] dark:text-gray-200 text-sm focus:border-primary focus:outline-none focus:ring-0 placeholder:text-[#9ca3af]"
                                placeholder="Örn: 687"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal" htmlFor="subject">Konusu</label>
                            <input
                                required
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="h-11 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-2.5 text-[#111418] dark:text-gray-200 text-sm focus:border-primary focus:outline-none focus:ring-0 placeholder:text-[#9ca3af]"
                                placeholder="Örn: Psikolojik Roman"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal" htmlFor="authorTotalBooks">Yazarın Toplam Kitap Sayısı</label>
                            <input
                                required
                                type="number"
                                id="authorTotalBooks"
                                name="authorTotalBooks"
                                value={formData.authorTotalBooks}
                                onChange={handleInputChange}
                                className="h-11 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-2.5 text-[#111418] dark:text-gray-200 text-sm focus:border-primary focus:outline-none focus:ring-0 placeholder:text-[#9ca3af]"
                                placeholder="Örn: 15"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-6 bg-primary text-white text-base font-bold leading-normal hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                    <span>Analiz Ediliyor...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                    <span>Analiz Et</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {result && (
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/20 p-3 rounded-full shrink-0">
                            <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#111418] dark:text-gray-100 text-lg font-bold mb-2">AI Analiz Sonucu</h3>
                            <p className="text-[#111418] dark:text-gray-200 text-base font-medium leading-relaxed mb-4">
                                "{result.message}"
                            </p>
                            <p className="text-[#617589] dark:text-gray-400 text-sm leading-relaxed mb-4">
                                {result.details}
                            </p>

                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-[#617589] dark:text-gray-400 font-medium uppercase tracking-wider">Uygunluk Skoru</span>
                                    <span className="text-2xl font-black text-primary">{result.score}/100</span>
                                </div>
                                <div className="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                    <span className="text-sm font-medium text-[#111418] dark:text-gray-200">Okunması Tavsiye Edilir</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookAnalysisPage;
