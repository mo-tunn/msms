# Yazılım Gereksinim Dokümanı (SRS)

---

## 1. Giriş

### 1.1 Proje Amacı
Bu projenin amacı, Türkiye'deki YKS sınavına hazırlanan öğrencilere mentorluk (psikolojik danışmanlık ve öğretmenlik) hizmeti veren bir işletmenin operasyonel süreçlerini dijitalleştirmektir. Geliştirilecek web tabanlı öğrenci paneli (YKS-MÖP), yöneticiler, alt-yöneticiler (danışman/öğretmen) ve öğrenciler arasındaki iletişimi, görev takibini, toplantı planlamasını ve performans analizini merkezi bir platform üzerinden yönetmeyi hedefler.

### 1.2 Proje Kapsamı
Bu dokümanın 1.1 versiyonu, sistemin ilk fazında geliştirilecek temel modülleri kapsamaktadır:

- Kullanıcı Yönetimi ve Yetkilendirme  
- Profilim Modülü  
- Duyurular Modülü  
- Ders Programı Yönetimi  
- Toplantı Modülü  
- Sınavlarım Modülü  
- Analiz Modülü  
- Mesajlar Modülü  
- AI Destekli Öneriler Modülü *(Yeni)*  

Sistem, gelecekte yeni modüller (Ödev Takibi, Soru Bankası, Online Deneme) eklenebilecek şekilde ölçeklenebilir bir mimariyle tasarlanacaktır.

### 1.3 Hedef Kitle ve Kullanıcı Rolleri
Sistemde üç ana kullanıcı rolü yer alır:

- **Yönetici (Admin):** Tüm sistem fonksiyonlarına erişim.  
- **Alt-Yönetici (Danışman/Öğretmen):** Sadece kendisine atanmış öğrenciler üzerinde yetkili.  
- **Öğrenci:** Kendi bilgilerini ve analizlerini görüntüleyebilir.

### 1.4 Tanımlar ve Kısaltmalar
- **YKS:** Yükseköğretim Kurumları Sınavı  
- **TYT:** Temel Yeterlilik Testi  
- **AYT:** Alan Yeterlilik Testi  
- **RBAC:** Rol Bazlı Erişim Kontrolü  
- **D/Y/B:** Doğru / Yanlış / Boş  
- **AI:** Yapay Zeka  
- **ML:** Makine Öğrenmesi  
- **API:** Uygulama Programlama Arayüzü  

---

## 2. Genel Açıklama

### 2.1 Sistem Perspektifi
YKS-MÖP, modern tarayıcılar üzerinden çalışan, sunucu–istemci mimarisine sahip, API-first yaklaşımıyla geliştirilecek bir web uygulamasıdır.

### 2.2 Genel Kısıtlamalar
- **Modülerlik ve Genişletilebilirlik**  
- **API-First Mimari**  
- **Güvenlik (RBAC, veri gizliliği)**  
- **WhatsApp entegrasyonu (wa.me linkleri)**  
- **ML Model Entegrasyonu (Kitap Satış Tahmin API’si)**  

---

## 3. Fonksiyonel Gereksinimler

### 3.1 Kullanıcı Yönetimi ve Yetkilendirme (Auth Modülü)

#### FG-3.1.1: Güvenli Giriş/Çıkış
- Tüm kullanıcılar e-posta/kullanıcı adı + şifre ile giriş yapabilmelidir.  
- Güvenli çıkış (logout) sağlanmalıdır.

#### FG-3.1.2: Yönetici Yetkileri (CRUD)
- Kullanıcı ekleme, düzenleme, listeleme, silme.  
- Öğrenci–mentor atama işlemleri.  
- Sistem ayarlarını yönetme.  
- Alt-Yöneticilere WhatsApp numarası ekleme.

#### FG-3.1.3: Alt-Yönetici Yetkileri
- Sadece kendisine atanmış öğrencileri görüntüleme ve yönetme.

#### FG-3.1.4: Öğrenci Yetkileri
- Sadece kendi verilerini görüntüleme.

---

### 3.2 Profilim Modülü

#### FG-3.2.1: Profil Bilgilerini Görüntüleme
- Ad, soyad, e-posta ve rol bilgileri.  
- Alan (Sayısal/Sözel/EA/Dil).  
- Alt-Yönetici için WhatsApp numarası görüntüleme.

#### FG-3.2.2: Profil Güncelleme
- Şifre değiştirme.  
- E-posta/telefon bilgisi düzenleme.  
- Yönetici tüm profilleri düzenleyebilir.

#### FG-3.2.3: Atanmış Kullanıcıları Görme
- Öğrenci mentorunu görür.  
- Alt-Yönetici öğrencilerini listeler.

---

### 3.3 Duyurular Modülü

#### FG-3.3.1: Kategori Yönetimi
Yönetici duyuru kategorilerini yönetebilir.

#### FG-3.3.2: Duyuru Oluşturma
- Başlık, içerik, kategori zorunludur.  
- Yönetici → tüm öğrenciler veya bir alan seçebilir.  
- Alt-Yönetici → kendi öğrencileri arasından seçebilir.

#### FG-3.3.3: Duyuru Görüntüleme (Öğrenci)
- Kategorilere göre filtreleme.  
- Okunmamış duyurular işaretlenir.

---

### 3.4 Ders Programı Yönetimi Modülü

#### FG-3.4.1: Haftalık Takvim
- Öğrenci + mentor ders programını haftalık görür.

#### FG-3.4.2: Görev Ekleme/Düzenleme
- Öğrenci kendi görevlerini ekleyebilir.  
- Alt-Yönetici öğrencisine görev ekleyebilir.  
- Gerçek zamanlı senkronizasyon.

#### FG-3.4.3: Görev Tamamlama Durumu
Görevler “tamamlandı/tamamlanmadı” olarak işaretlenir.

#### FG-3.4.4: Veritabanı Kaydı
Tüm görev geçmişi analiz için saklanır.

---

### 3.5 Toplantı Modülü

#### FG-3.5.1: Toplantı Kategorileri
Yönetici toplantı kategorilerini yönetebilir.

#### FG-3.5.2: Toplantı Oluşturma
- Kategori, tarih/saat, açıklama.  
- Yönetici → tüm öğrenciler arasından seçebilir.  
- Alt-Yönetici → yalnızca kendi öğrencileri arasından seçebilir.

#### FG-3.5.3: Öğrenci Görüntüleme
Toplantılar öğrencinin takviminde görünür.

#### FG-3.5.4: Katılım Durumu
Gerçekleşen toplantılarda “Katıldı/Katılmadı” işareti.

---

### 3.6 Sınavlarım Modülü

#### FG-3.6.1: Sınav Sonucu Girişi
- Sınav adı, tarih, tür (TYT/AYT).  
- Ders–konu bazlı detaylı D/Y/B girişi.  
- Sistem otomatik net hesaplamalıdır.  
- PDF cevap anahtarı (opsiyonel) yüklenebilir.

#### FG-3.6.2: Sınavlarım Ana Sayfası
- Filtreleme (tür, tarih aralığı).  
- KPI kartları (ortalama net, toplam sınav, max net).  
- Zaman serisi grafik (net gelişimi).  
- Genel D/Y/B dağılımı donut grafik.  
- Sınav listesi.

#### FG-3.6.3: Sınav Detay Sayfası
- Özet kartlar.  
- Cevap anahtarı görüntüleme.  
- Ders bazlı net grafiği.  
- Tab yapısı ile ders geçişi.  
- Konu dağılımı listesi.

---

### 3.7 Analiz Modülü

#### FG-3.7.1: Dashboard
Görev & toplantı performansı gösterimi.

#### FG-3.7.1.1: Filtreleme
Haftalık–aylık–3 aylık–yıllık.

#### FG-3.7.1.2: Göstergeler
- Görev atama/tamamlama yüzdesi.  
- Toplantı katılım oranı.

---

### 3.8 Mesajlar Modülü

#### FG-3.8.1: Mentor Listeleme
Öğrenci tüm mentorları görür.

#### FG-3.8.2: WhatsApp Entegrasyonu
- Metin → wa.me linki  
- Yeni sekmede WhatsApp Web açılır.

#### FG-3.8.3: Sınırlama
Sistem mesajı otomatik göndermez.

---

### 3.9 AI Destekli Öneriler Modülü *(Yeni)*

#### FG-3.9.1: Modül Erişimi
Öğrenciler bu modülü kullanabilir.

#### FG-3.9.2: Kitap Parametre Girişi
Model için gerekli parametre formu.

#### FG-3.9.3: ML API Entegrasyonu
- Parametreler modele iletilir.  
- Tahmini satış sayısı alınır.  
- Hata durumunda bilgilendirme yapılır.

#### FG-3.9.4: Popülerlik Kategorizasyonu
Tahmin edilen satış sayısına göre sınıflandırma yapılır.

---

