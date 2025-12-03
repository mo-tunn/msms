# 🏛️ Mock Identity Provider (MERNİS Simülasyonu)

Bu servis, gerçek dünyadaki **MERNİS (TC Kimlik Doğrulama)** sistemini simüle eden bir SOAP servisidir.

## 📋 Özellikler

- **SOAP 1.1** protokolü desteği
- TC Kimlik No, Ad, Soyad ve Doğum Yılı doğrulama
- Statik JSON tabanlı vatandaş listesi
- Türkçe karakter desteği (büyük/küçük harf dönüşümü)
- TC Kimlik No format ve algoritma kontrolü

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Servisi başlat
npm start

# Geliştirme modunda başlat (auto-reload)
npm run dev
```

## 🔗 Endpoint'ler

| Endpoint | Açıklama |
|----------|----------|
| `http://localhost:3001/mernis` | SOAP servisi |
| `http://localhost:3001/mernis?wsdl` | WSDL tanımı |
| `http://localhost:3001/health` | Sağlık kontrolü |

## 📡 SOAP İsteği

### Metot: `TCKimlikNoDogrula`

#### İstek Parametreleri

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| TCKimlikNo | string | 11 haneli TC Kimlik Numarası |
| Ad | string | Vatandaşın adı |
| Soyad | string | Vatandaşın soyadı |
| DogumYili | int | Doğum yılı (örn: 1990) |

#### Yanıt

| Alan | Tip | Açıklama |
|------|-----|----------|
| TCKimlikNoDogrulaResult | boolean | `true` = Doğru, `false` = Yanlış |

### Örnek SOAP İsteği (cURL)

```bash
curl -X POST http://localhost:3001/mernis \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H "SOAPAction: http://mock.mernis.gov.tr/TCKimlikNoDogrula" \
  -d '<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:tns="http://mock.mernis.gov.tr/">
  <soap:Body>
    <tns:TCKimlikNoDogrulaRequest>
      <tns:TCKimlikNo>11111111111</tns:TCKimlikNo>
      <tns:Ad>TEST</tns:Ad>
      <tns:Soyad>KULLANICI</tns:Soyad>
      <tns:DogumYili>2000</tns:DogumYili>
    </tns:TCKimlikNoDogrulaRequest>
  </soap:Body>
</soap:Envelope>'
```

### Örnek SOAP Yanıtı (Başarılı)

```xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:tns="http://mock.mernis.gov.tr/">
  <soap:Body>
    <tns:TCKimlikNoDogrulaResponse>
      <tns:TCKimlikNoDogrulaResult>true</tns:TCKimlikNoDogrulaResult>
    </tns:TCKimlikNoDogrulaResponse>
  </soap:Body>
</soap:Envelope>
```

## 👥 Test Vatandaşları

`citizens.json` dosyasında tanımlı test vatandaşları:

| TC Kimlik No | Ad | Soyad | Doğum Yılı |
|--------------|-----|-------|------------|
| 12345678901 | AHMET | YILMAZ | 1985 |
| 12345678902 | MEHMET | KAYA | 1990 |
| 12345678903 | AYŞE | DEMİR | 1988 |
| 12345678904 | FATİH | ÇELİK | 1975 |
| 12345678905 | ZEYNEP | ÖZTÜRK | 1995 |
| 11111111111 | TEST | KULLANICI | 2000 |
| 99999999999 | ADMIN | ADMIN | 1980 |

## 🔧 Auth Service Entegrasyonu

Auth Service bu SOAP servisini kullanarak kullanıcı kimliğini doğrulayabilir.

### Node.js Client Örneği

```javascript
const soap = require('soap');

const WSDL_URL = 'http://localhost:3001/mernis?wsdl';

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

// Kullanım
const isValid = await verifyIdentity('11111111111', 'TEST', 'KULLANICI', 2000);
console.log('Doğrulama Sonucu:', isValid); // true
```

## 📁 Dosya Yapısı

```
external-services/
├── server.js        # Ana SOAP sunucusu
├── identity.wsdl    # WSDL tanım dosyası
├── citizens.json    # Statik vatandaş listesi
├── package.json     # Proje bağımlılıkları
└── README.md        # Bu dosya
```

## ⚙️ Ortam Değişkenleri

| Değişken | Varsayılan | Açıklama |
|----------|------------|----------|
| PORT | 3001 | Servisin çalışacağı port |

## 📝 Notlar

1. Bu bir **mock servis**tir ve gerçek MERNİS sistemiyle bir bağlantısı yoktur.
2. Tüm veriler `citizens.json` dosyasından okunur.
3. Ad ve Soyad karşılaştırması büyük harfe dönüştürülerek yapılır.
4. TC Kimlik No 11 haneli olmalı ve ilk hanesi 0 olmamalıdır.

## 🐛 Hata Ayıklama

Servis tüm istekleri ve yanıtları konsola yazdırır. Örnek log çıktısı:

```
========================================
[SOAP İSTEĞİ] TCKimlikNoDogrula
----------------------------------------
Gelen Parametreler: {
  "TCKimlikNo": "11111111111",
  "Ad": "TEST",
  "Soyad": "KULLANICI",
  "DogumYili": 2000
}
[DOĞRULAMA] TC: 11111111111, Ad: TEST, Soyad: KULLANICI, Yıl: 2000 => DOĞRU
----------------------------------------
[SOAP YANIT] TCKimlikNoDogrulaResult: true
========================================
```

