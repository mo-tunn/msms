# 🚀 Hızlı Başlangıç Rehberi

## ✅ Tamamlanan İşlemler

Veri ön işleme süreci **başarıyla tamamlandı**! İşte yapılanlar:

### 📊 Ön İşleme Adımları (Görseldeki Tüm Adımlar Uygulandı)

1. ✅ **Eksik Veri Tespiti** - 5 sütunda eksiklik bulundu
2. ✅ **Boşlukları Doldurma (Imputation)** - Medyan ve mod ile dolduruldu
3. ✅ **Boşlukları Silme** - Hedef değişkende eksik olanlar silindi (0 satır)
4. ✅ **Aykırı Değer Tespiti** - IQR metodu ile tespit edildi
5. ✅ **Aykırı Değerleri Temizleme** - Capping metodu uygulandı
6. ✅ **Etiket Kodlama (Label Encoding)** - 3 sütun encode edildi
7. ✅ **Tek-Sıcak Kodlama (One-Hot Encoding)** - Ana kategori için 11 sütun
8. ✅ **Veri Normalizasyonu** - Tüm sayısal değerler 0-1 aralığında

---

## 📁 Oluşturulan Dosyalar

### 1️⃣ Ana Çıktılar

| Dosya | Açıklama | Kullanım |
|-------|----------|----------|
| `kitapdata_preprocessed.csv` | Model için hazır veri (25 sütun) | **Model eğitiminde kullan** |
| `kitapdata_full_preprocessed.csv` | Tüm sütunlar (49 sütun) | Analiz ve araştırma |
| `preprocessing_visualization.png` | Görsel rapor | İnceleme ve sunum |

### 2️⃣ Dokümantasyon

| Dosya | İçerik |
|-------|--------|
| `README.md` | Genel proje bilgisi |
| `VERİ_ÖN_İŞLEME_DOKÜMANTASYON.md` | Detaylı adım açıklamaları |
| `preprocessing_report.txt` | İstatistiksel rapor |

### 3️⃣ Kod Dosyaları

| Dosya | Amaç |
|-------|------|
| `preprocessing_script.py` | Ön işleme scripti |
| `model_example.py` | Örnek model eğitimi |

---

## 🎯 Şimdi Ne Yapmalısınız?

### Seçenek 1: Örnek Modeli Çalıştırın

```bash
python model_example.py
```

Bu script:
- ✅ Ön işlenmiş veriyi yükler
- ✅ Linear Regression ve Random Forest modelleri eğitir
- ✅ Performans metriklerini gösterir
- ✅ Özellik önemlerini analiz eder
- ✅ Görselleştirmeler oluşturur

### Seçenek 2: Kendi Modelinizi Oluşturun

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor

# Veriyi yukle
df = pd.read_csv('kitapdata_preprocessed.csv')

# Ana_Kategori_Grouped sutununu cikar (string)
df = df.drop('Ana_Kategori_Grouped', axis=1)

# X ve y ayir
X = df.drop('Toplam Satılma Sayısı', axis=1)
y = df['Toplam Satılma Sayısı']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Kendi modelinizi egit!
model = GradientBoostingRegressor(n_estimators=200)
model.fit(X_train, y_train)

# Tahmin
predictions = model.predict(X_test)
```

---

## 📈 Veri Seti Özellikleri

### Hazır Özellikler (24 adet - hedef hariç)

**Sayısal Özellikler (9):**
- Liste fiyatı, sayfa sayısı
- Favori/okuma istatistikleri
- Puan ve oy sayısı

**Kategorik Özellikler (3):**
- Dil, cilt tipi, kağıt cinsi

**One-Hot Encoded (12):**
- 11 ana kategori + grouped

**Hedef Değişken (1):**
- Toplam Satılma Sayısı

---

## 🎨 Görselleştirmeyi İnceleyin

`preprocessing_visualization.png` dosyasını açarak:

1. **Satış dağılımını** görebilirsiniz (orijinal vs normalize)
2. **Eksik değer oranlarını** inceleyebilirsiniz
3. **Kategori dağılımını** analiz edebilirsiniz

---

## 💡 Öneriler

### Model Performansını Artırmak İçin:

1. **Daha Fazla Özellik Mühendisliği**
   - Yazar bazlı istatistikler
   - Yayınevi bazlı ortalamalar
   - Fiyat/sayfa oranı gibi türev özellikler

2. **Hiperparametre Optimizasyonu**
   ```python
   from sklearn.model_selection import GridSearchCV
   
   param_grid = {
       'n_estimators': [100, 200, 300],
       'max_depth': [5, 10, 15],
       'min_samples_split': [2, 5, 10]
   }
   
   grid_search = GridSearchCV(
       RandomForestRegressor(),
       param_grid,
       cv=5,
       scoring='r2'
   )
   ```

3. **Ensemble Yöntemleri**
   - Birden fazla modeli birleştirin
   - Voting/Stacking yaklaşımı

4. **Deep Learning**
   - Neural Network deneyin (çok özellik olduğu için uygun)

---

## 📚 Dosya İçerikleri

### kitapdata_preprocessed.csv
```
25 sütun × 1,497 satır
- Tüm değerler sayısal
- Normalizasyon uygulanmış
- One-hot encoding yapılmış
- Eksik değer YOK
```

### kitapdata_full_preprocessed.csv
```
49 sütun × 1,497 satır
- Orijinal sütunlar + işlenmiş sütunlar
- Analiz için ideal
- Karşılaştırma yapılabilir
```

---

## ⚡ Hızlı Komutlar

### Veriyi Hızlı İncele
```python
import pandas as pd

# Yukle
df = pd.read_csv('kitapdata_preprocessed.csv')

# Bilgi
print(df.info())
print(df.describe())
print(df.head())

# Eksik deger kontrolu
print(df.isnull().sum().sum())  # Sonuc: 0
```

### Model Performansını Test Et
```bash
# Ornek modeli calistir
python model_example.py

# Cikti: MAE, RMSE, R2 metrikleri
# Grafik: model_performance.png
```

---

## 🎯 Başarı Kriterleri

### ✅ Tamamlanan
- [x] Veri yükleme
- [x] Eksik değer kontrolü
- [x] Eksik değer doldurma
- [x] Aykırı değer tespiti
- [x] Aykırı değer temizleme
- [x] Kategorik encoding
- [x] Normalizasyon
- [x] Veri kaydetme
- [x] Dokümantasyon
- [x] Görselleştirme

### 📝 Sıradaki Adımlar (Sizin Yapacağınız)
- [ ] Model seçimi
- [ ] Hiperparametre optimizasyonu
- [ ] Cross-validation
- [ ] Model değerlendirme
- [ ] Production deployment

---

## 🆘 Sorun Giderme

### "ModuleNotFoundError" Hatası Alırsanız:
```bash
pip install pandas numpy scikit-learn matplotlib seaborn
```

### Dosya Bulunamadı Hatası Alırsanız:
```python
import os
print(os.getcwd())  # Bulundugunuz dizini kontrol edin
```

### Encoding Hatası Alırsanız:
```python
df = pd.read_csv('kitapdata_preprocessed.csv', encoding='utf-8-sig')
```

---

## 📞 Yardım

### Detaylı Bilgi İçin:
1. **VERİ_ÖN_İŞLEME_DOKÜMANTASYON.md** - Her adımın detaylı açıklaması
2. **preprocessing_report.txt** - İstatistiksel rapor
3. **preprocessing_script.py** - Kod üzerinde yorumlar

### Model Eğitimi İçin:
1. **model_example.py** - Çalışan örnek kod
2. **README.md** - Genel kullanım kılavuzu

---

## 🎉 Tebrikler!

Veri setiniz artık makine öğrenmesi için **tamamen hazır**!

- ✅ 1,497 temiz satır
- ✅ 24 işlenmiş özellik
- ✅ %100 veri bütünlüğü
- ✅ Normalize edilmiş değerler
- ✅ Encoded kategoriler

**Artık model eğitimine geçebilirsiniz!** 🚀

---

**Kolay gelsin!** 💪


