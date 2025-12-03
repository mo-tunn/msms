/**
 * SOAP Client Test Dosyası
 * 
 * Mock Identity Provider servisini test etmek için kullanılır.
 * Kullanım: node test-client.js
 */

const soap = require('soap');

const WSDL_URL = 'http://localhost:3001/mernis?wsdl';

// Test senaryoları
const testCases = [
    {
        name: 'Geçerli Vatandaş (TEST KULLANICI)',
        data: { TCKimlikNo: '11111111111', Ad: 'TEST', Soyad: 'KULLANICI', DogumYili: 2000 },
        expected: true
    },
    {
        name: 'Geçerli Vatandaş (AHMET YILMAZ)',
        data: { TCKimlikNo: '12345678901', Ad: 'AHMET', Soyad: 'YILMAZ', DogumYili: 1985 },
        expected: true
    },
    {
        name: 'Küçük Harfle Yazılmış Ad (otomatik düzeltilmeli)',
        data: { TCKimlikNo: '12345678902', Ad: 'mehmet', Soyad: 'kaya', DogumYili: 1990 },
        expected: true
    },
    {
        name: 'Yanlış Doğum Yılı',
        data: { TCKimlikNo: '11111111111', Ad: 'TEST', Soyad: 'KULLANICI', DogumYili: 1999 },
        expected: false
    },
    {
        name: 'Yanlış Ad',
        data: { TCKimlikNo: '11111111111', Ad: 'YANLIS', Soyad: 'KULLANICI', DogumYili: 2000 },
        expected: false
    },
    {
        name: 'Olmayan TC Kimlik No',
        data: { TCKimlikNo: '55555555555', Ad: 'TEST', Soyad: 'TEST', DogumYili: 2000 },
        expected: false
    },
    {
        name: 'Geçersiz TC Kimlik No Format (10 haneli)',
        data: { TCKimlikNo: '1234567890', Ad: 'TEST', Soyad: 'TEST', DogumYili: 2000 },
        expected: false
    },
    {
        name: 'TC Kimlik No 0 ile Başlıyor',
        data: { TCKimlikNo: '01234567890', Ad: 'TEST', Soyad: 'TEST', DogumYili: 2000 },
        expected: false
    }
];

async function runTests() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           SOAP Client Test - MERNİS Mock Servisi           ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    try {
        console.log('🔗 SOAP Client oluşturuluyor...');
        const client = await soap.createClientAsync(WSDL_URL);
        console.log('✓ SOAP Client bağlandı.\n');

        let passed = 0;
        let failed = 0;

        for (const test of testCases) {
            try {
                console.log(`\n📋 Test: ${test.name}`);
                console.log(`   Veri: TC=${test.data.TCKimlikNo}, Ad=${test.data.Ad}, Soyad=${test.data.Soyad}, Yıl=${test.data.DogumYili}`);
                
                const result = await client.TCKimlikNoDogrulaAsync(test.data);
                const actual = result[0].TCKimlikNoDogrulaResult;
                
                if (actual === test.expected) {
                    console.log(`   ✅ BAŞARILI - Beklenen: ${test.expected}, Dönen: ${actual}`);
                    passed++;
                } else {
                    console.log(`   ❌ BAŞARISIZ - Beklenen: ${test.expected}, Dönen: ${actual}`);
                    failed++;
                }
            } catch (error) {
                console.log(`   ❌ HATA: ${error.message}`);
                failed++;
            }
        }

        console.log('\n════════════════════════════════════════════════════════════');
        console.log(`📊 Test Sonuçları: ${passed} başarılı, ${failed} başarısız`);
        console.log('════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('\n❌ SOAP Client hatası:', error.message);
        console.log('\n💡 Servisin çalıştığından emin olun: npm start\n');
    }
}

// Tek bir doğrulama için export edilebilir fonksiyon
async function verifyIdentity(tcKimlikNo, ad, soyad, dogumYili) {
    const client = await soap.createClientAsync(WSDL_URL);
    const result = await client.TCKimlikNoDogrulaAsync({
        TCKimlikNo: tcKimlikNo,
        Ad: ad,
        Soyad: soyad,
        DogumYili: dogumYili
    });
    return result[0].TCKimlikNoDogrulaResult;
}

// Script olarak çalıştırıldığında testleri çalıştır
if (require.main === module) {
    runTests();
}

module.exports = { verifyIdentity };

