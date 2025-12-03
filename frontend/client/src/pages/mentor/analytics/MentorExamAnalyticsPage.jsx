import React from 'react';

const MentorExamAnalyticsPage = () => {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-[#111418] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">Sınav Analizleri</h1>
                <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal mt-2">
                    Öğrencilerin sınav performanslarının detaylı karşılaştırması.
                </p>
            </div>

            <div className="flex items-center justify-center h-64 rounded-2xl border border-dashed border-[#e0e6ed] dark:border-[#202932] bg-black/5 dark:bg-white/5">
                <div className="text-center">
                    <span className="material-symbols-outlined text-4xl text-[#617589] dark:text-gray-400 mb-2">bar_chart</span>
                    <p className="text-[#617589] dark:text-gray-400 font-medium">Bu sayfa yapım aşamasındadır.</p>
                </div>
            </div>
        </div>
    );
};

export default MentorExamAnalyticsPage;
