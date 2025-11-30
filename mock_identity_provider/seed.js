const mongoose = require('mongoose');
const Citizen = require('./models/Citizen');

mongoose.connect('mongodb://localhost:27017/nvi_mock').then(async () => {
    console.log('Connected to MongoDB');

    const dummyCitizens = [
        { tcKimlikNo: '11111111110', ad: 'ALI', soyad: 'VELI', dogumYili: 1990 },
        { tcKimlikNo: '22222222220', ad: 'AYŞE', soyad: 'YILMAZ', dogumYili: 1995 },
        { tcKimlikNo: '33333333330', ad: 'MEHMET', soyad: 'ÖZTÜRK', dogumYili: 1985 },
        { tcKimlikNo: '44444444440', ad: 'ZEYNEP', soyad: 'KAYA', dogumYili: 2000 },
        { tcKimlikNo: '55555555550', ad: 'MUSTAFA', soyad: 'DEMIR', dogumYili: 1992 },
        { tcKimlikNo: '66666666660', ad: 'ELIF', soyad: 'ÇELIK', dogumYili: 1998 },
        { tcKimlikNo: '77777777770', ad: 'HÜSEYIN', soyad: 'ŞAHIN', dogumYili: 1988 },
        { tcKimlikNo: '88888888880', ad: 'HATICE', soyad: 'YILDIRIM', dogumYili: 1993 },
        { tcKimlikNo: '99999999990', ad: 'IBRAHIM', soyad: 'KOÇ', dogumYili: 1980 },
        { tcKimlikNo: '12345678901', ad: 'EMINE', soyad: 'ARSLAN', dogumYili: 1996 }
    ];

    try {
        // Clear existing data for these citizens to avoid duplicates
        const tckns = dummyCitizens.map(c => c.tcKimlikNo);
        await Citizen.deleteMany({ tcKimlikNo: { $in: tckns } });

        await Citizen.insertMany(dummyCitizens);
        console.log('Dummy citizens added:', dummyCitizens.length);
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
