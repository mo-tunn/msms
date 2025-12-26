import React from 'react';

const MentorTaskAnalyticsPage = () => {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-[#111418] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">Görev Takibi</h1>
                <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal mt-2">
                    Öğrencilerin günlük görev tamamlama oranları ve istatistikleri.
                </p>
            </div>

            <div className="flex items-center justify-center h-64 rounded-2xl border border-dashed border-[#e0e6ed] dark:border-[#202932] bg-black/5 dark:bg-white/5">
                <div className="text-center">
                    <span className="material-symbols-outlined text-4xl text-[#617589] dark:text-gray-400 mb-2">task_alt</span>
                    <p className="text-[#617589] dark:text-gray-400 font-medium">Bu sayfa yapım aşamasındadır.</p>
                </div>
            </div>
        </div>
    );
};

export default MentorTaskAnalyticsPage;
