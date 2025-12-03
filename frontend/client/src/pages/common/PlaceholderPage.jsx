import React from 'react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-[#111418] dark:text-white">{title}</h1>
            <p className="text-[#617589] dark:text-gray-400">Bu sayfa henüz hazırlanma aşamasındadır.</p>
        </div>
    );
};

export default PlaceholderPage;
