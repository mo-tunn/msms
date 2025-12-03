/**
 * Mock Identity Provider (MERNİS Simülasyonu)
 * 
 * Bu servis, gerçek MERNİS TC Kimlik Doğrulama sistemini taklit eder.
 * SOAP protokolü üzerinden TC Kimlik No, Ad, Soyad ve Doğum Yılı
 * bilgilerini doğrular.
 */

const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Statik vatandaş listesini yükle
const citizensPath = path.join(__dirname, 'citizens.json');
let citizens = [];

try {
    const data = fs.readFileSync(citizensPath, 'utf8');
    citizens = JSON.parse(data);
    console.log(`✓ ${citizens.length} vatandaş kaydı yüklendi.`);
} catch (error) {
    console.error('✗ Vatandaş listesi yüklenemedi:', error.message);
    process.exit(1);
}

/**
 * TC Kimlik No doğrulama fonksiyonu
 * Gerçek MERNİS mantığını simüle eder
 */
function verifyCitizen(tcKimlikNo, ad, soyad, dogumYili) {
    // TC Kimlik No format kontrolü (11 haneli, rakamlardan oluşmalı)
    if (!tcKimlikNo || !/^\d{11}$/.test(tcKimlikNo)) {
        console.log(`[DOĞRULAMA] TC Kimlik No format hatası: ${tcKimlikNo}`);
        return false;
    }

    // TC Kimlik No algoritma kontrolü (ilk hane 0 olamaz)
    if (tcKimlikNo.charAt(0) === '0') {
        console.log(`[DOĞRULAMA] TC Kimlik No ilk hane 0 olamaz: ${tcKimlikNo}`);
        return false;
    }

    // Büyük harfe çevir (Türkçe karakter desteği)
    const normalizedAd = ad ? ad.toLocaleUpperCase('tr-TR').trim() : '';
    const normalizedSoyad = soyad ? soyad.toLocaleUpperCase('tr-TR').trim() : '';

    // Vatandaş listesinde ara
    const citizen = citizens.find(c => c.tcKimlikNo === tcKimlikNo);

    if (!citizen) {
        console.log(`[DOĞRULAMA] TC Kimlik No bulunamadı: ${tcKimlikNo}`);
        return false;
    }

    // Tüm bilgileri karşılaştır
    const isMatch = 
        citizen.ad === normalizedAd &&
        citizen.soyad === normalizedSoyad &&
        citizen.dogumYili === parseInt(dogumYili, 10);

    console.log(`[DOĞRULAMA] TC: ${tcKimlikNo}, Ad: ${normalizedAd}, Soyad: ${normalizedSoyad}, Yıl: ${dogumYili} => ${isMatch ? 'DOĞRU' : 'YANLIŞ'}`);
    
    return isMatch;
}

// SOAP Servis Tanımı
const serviceDefinition = {
    KimlikDogrulamaService: {
        KimlikDogrulamaPort: {
            /**
             * TCKimlikNoDogrula - Ana doğrulama metodu
             * 
             * @param {Object} args - SOAP request parametreleri
             * @param {string} args.TCKimlikNo - 11 haneli TC Kimlik Numarası
             * @param {string} args.Ad - Vatandaşın adı
             * @param {string} args.Soyad - Vatandaşın soyadı
             * @param {number} args.DogumYili - Doğum yılı (4 haneli)
             * @returns {Object} Doğrulama sonucu
             */
            TCKimlikNoDogrula: function(args, callback) {
                console.log('\n========================================');
                console.log('[SOAP İSTEĞİ] TCKimlikNoDogrula');
                console.log('----------------------------------------');
                console.log('Gelen Parametreler:', JSON.stringify(args, null, 2));
                
                const { TCKimlikNo, Ad, Soyad, DogumYili } = args;
                
                const result = verifyCitizen(TCKimlikNo, Ad, Soyad, DogumYili);
                
                console.log('----------------------------------------');
                console.log(`[SOAP YANIT] TCKimlikNoDogrulaResult: ${result}`);
                console.log('========================================\n');
                
                // SOAP yanıtı
                return {
                    TCKimlikNoDogrulaResult: result
                };
            }
        }
    }
};

// WSDL dosyasını oku
const wsdlPath = path.join(__dirname, 'identity.wsdl');
const wsdl = fs.readFileSync(wsdlPath, 'utf8');

// Express middleware
app.use(express.raw({ type: () => true, limit: '5mb' }));

// Sağlık kontrolü endpoint'i
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Mock Identity Provider (MERNİS)',
        citizensLoaded: citizens.length,
        timestamp: new Date().toISOString()
    });
});

// WSDL endpoint'i (browser'da görüntüleme için)
app.get('/mernis', (req, res) => {
    if (req.query.wsdl !== undefined) {
        res.set('Content-Type', 'text/xml');
        res.send(wsdl);
    } else {
        res.send(`
            <html>
                <head>
                    <title>MERNİS Mock Servisi</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
                        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        h1 { color: #c41e3a; }
                        code { background: #e9e9e9; padding: 2px 8px; border-radius: 4px; }
                        .endpoint { background: #f0f7ff; padding: 15px; border-radius: 4px; margin: 10px 0; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                        th { background: #c41e3a; color: white; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🏛️ MERNİS Mock Servisi</h1>
                        <p>TC Kimlik Doğrulama SOAP Servisi çalışıyor.</p>
                        
                        <h2>WSDL</h2>
                        <div class="endpoint">
                            <a href="/mernis?wsdl">http://localhost:${PORT}/mernis?wsdl</a>
                        </div>
                        
                        <h2>Servis Bilgileri</h2>
                        <table>
                            <tr><th>Özellik</th><th>Değer</th></tr>
                            <tr><td>Servis Adı</td><td>KimlikDogrulamaService</td></tr>
                            <tr><td>Port</td><td>KimlikDogrulamaPort</td></tr>
                            <tr><td>Metot</td><td>TCKimlikNoDogrula</td></tr>
                            <tr><td>Protokol</td><td>SOAP 1.1</td></tr>
                        </table>
                        
                        <h2>Parametreler</h2>
                        <table>
                            <tr><th>Parametre</th><th>Tip</th><th>Açıklama</th></tr>
                            <tr><td>TCKimlikNo</td><td>string</td><td>11 haneli TC Kimlik Numarası</td></tr>
                            <tr><td>Ad</td><td>string</td><td>Vatandaşın adı</td></tr>
                            <tr><td>Soyad</td><td>string</td><td>Vatandaşın soyadı</td></tr>
                            <tr><td>DogumYili</td><td>int</td><td>Doğum yılı (örn: 1990)</td></tr>
                        </table>
                        
                        <h2>Test Vatandaşları</h2>
                        <p>Toplam <strong>${citizens.length}</strong> test vatandaşı yüklendi.</p>
                    </div>
                </body>
            </html>
        `);
    }
});

// Sunucuyu başlat
const server = app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║   🏛️  MERNİS Mock Servisi (TC Kimlik Doğrulama)            ║');
    console.log('║                                                            ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║   SOAP Endpoint : http://localhost:${PORT}/mernis              ║`);
    console.log(`║   WSDL          : http://localhost:${PORT}/mernis?wsdl         ║`);
    console.log(`║   Health Check  : http://localhost:${PORT}/health              ║`);
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    // SOAP servisini Express sunucusuna bağla
    soap.listen(server, '/mernis', serviceDefinition, wsdl, () => {
        console.log('✓ SOAP servisi /mernis endpoint\'inde dinleniyor.\n');
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Servis kapatılıyor...');
    server.close(() => {
        console.log('✓ Servis kapatıldı.');
        process.exit(0);
    });
});

