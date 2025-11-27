import React from 'react';

const MessagesPage = () => {
    const mentors = [
        {
            id: 1,
            name: 'Prof. Dr. Ahmet Yılmaz',
            title: 'Computer Science Mentor',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIAydlRNQBr8JszxTdl0G56FqYeSVuWTSVZyU8eny7E2qcM4EfUfSc9wGdS2aGIbXXUZgDmK5qDbE0Q4GEjTXjC96iQLdaY9IKjt5YzrOjA8rv2Mz0rvE6wiim5KG-qhEm9OzOtegdiXctBhrxD5wJfLMPqhMqlHcPEb0-GyupPNdUSt8QjSksIct-FNmFuKM5RMwvNCuWSQc5w60HEBNulxZrnav4hPdvhfC-A44b3I1q3OUlJPPFfhjVflp-sCiw9K0C2Hddiwz0'
        },
        {
            id: 2,
            name: 'Doç. Dr. Elif Kara',
            title: 'Physics Mentor',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr2QvLxWnVUjNIDL_q1ApnOJFzcP4OgN5KGMamrBEq-uPWoZbd37sL3b2I1enG5vTHAnRdcDW1Tz18tzYL0jeGRWfkXNzg8tdduMQeiCa4DIsagjs2PTCqHYn0U_48ofRoZZsPmBHPjkwZoA6PzQlKpRlG12V9ilqkNSKZ_2KptYZz93dOZSlg_9uLTfPaAEYbLcJCsU-q8kCBPF1J5SPU6U9J4vcNAyfxohsdELm4RYNbNhy1t3KPzeJhI1Q4tZfzTn6P2erYub-Q'
        },
        {
            id: 3,
            name: 'Dr. Mehmet Can',
            title: 'Mathematics Mentor',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy17NwVgwO3D95Gq9k3vS2NQZDif24mHi5iqh4Z5Ox4GpFZqc021yfZhtN4ez2GV6G78kbFfqok6xwkawXzOCI6vjWkeTQsFvB2jOJ-TLVxxa7n-DxsMtXHonZ5yud2jK-VDSrUbuZry8L5SlpX1ucKhiLzdWeDnx-oWo8rWCnvqJ2e0CmDIiT1CNJGpYBxi2YSQCVbCs8u6xlKYntIW9xt9vWarkMKQW-MY4hNJFFWzzo5ByNyx6ePvhDss3SENCeJx52Mz90XrXa'
        },
        {
            id: 4,
            name: 'Ar. Gör. Zeynep Öztürk',
            title: 'Chemistry Mentor',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIAydlRNQBr8JszxTdl0G56FqYeSVuWTSVZyU8eny7E2qcM4EfUfSc9wGdS2aGIbXXUZgDmK5qDbE0Q4GEjTXjC96iQLdaY9IKjt5YzrOjA8rv2Mz0rvE6wiim5KG-qhEm9OzOtegdiXctBhrxD5wJfLMPqhMqlHcPEb0-GyupPNdUSt8QjSksIct-FNmFuKM5RMwvNCuWSQc5w60HEBNulxZrnav4hPdvhfC-A44b3I1q3OUlJPPFfhjVflp-sCiw9K0C2Hddiwz0'
        }
    ];

    return (
        <div className="flex flex-col gap-4 p-4">
            {mentors.map((mentor) => (
                <div key={mentor.id} className="bg-white dark:bg-[#18212a] rounded-xl border border-[#e0e6ed] dark:border-[#202932] p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16 border-2 border-white shadow-sm"
                                style={{ backgroundImage: `url("${mentor.image}")` }}
                            ></div>
                            <div>
                                <h3 className="text-lg font-bold text-[#111418] dark:text-white">{mentor.name}</h3>
                                <p className="text-sm text-[#617589] dark:text-gray-400">{mentor.title}</p>
                            </div>
                        </div>
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-bold text-sm hover:bg-[#128C7E] transition-colors w-full sm:w-auto">
                            <svg className="h-5 w-5" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <title>WhatsApp</title>
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.785 1.605h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                            </svg>
                            <span>WhatsApp ile Bağlan</span>
                        </button>
                    </div>
                    <div>
                        <input
                            className="w-full rounded-lg border border-[#dbe0e6] dark:border-[#343d46] bg-[#f0f2f4] dark:bg-[#202932] px-4 py-3 text-sm text-[#111418] dark:text-white focus:border-primary focus:ring-primary focus:bg-white dark:focus:bg-[#18212a] transition-colors"
                            placeholder="Hızlı mesaj gönder..."
                            type="text"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessagesPage;
