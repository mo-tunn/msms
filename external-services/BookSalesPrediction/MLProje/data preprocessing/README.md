# 📚 Kitap Satış Tahmini - Veri Ön İşleme Projesi

## 🎯 Proje Özeti

Bu proje, kitap verilerini kullanarak **satış sayısı tahmini** yapabilecek bir makine öğrenmesi modeli için veri ön işleme (data preprocessing) sürecini içermektedir.

## 📁 Dosyalar

### Giriş
- **kitapdata.csv** - Orijinal veri seti (1,497 kitap)

### Çıkış
- **kitapdata_preprocessed.csv** - Model için hazır veri seti (25 sütun)
- **kitapdata_full_preprocessed.csv** - Detaylı veri seti (49 sütun)
- **preprocessing_visualization.png** - Görsel rapor
- **preprocessing_report.txt** - İstatistiksel rapor

### Kod ve Dokümantasyon
- **preprocessing_script.py** - Ana ön işleme scripti
- **VERİ_ÖN_İŞLEME_DOKÜMANTASYON.md** - Detaylı dokümantasyon
- **README.md** - Bu dosya

## 🚀 Hızlı Başlangıç

### 1. Ön İşleme Scriptini Çalıştırma

```bash
python preprocessing_script.py
```

Bu komut otomatik olarak:
- ✅ Veriyi yükler ve inceler
- ✅ Eksik değerleri doldurur
- ✅ Aykırı değerleri temizler
- ✅ Kategorik değişkenleri encode eder
- ✅ Tüm özellikleri normalize eder
- ✅ Sonuçları kaydeder

### 2. İşlenmiş Veriyi Kullanma

```python
import pandas as pd
from sklearn.model_selection import train_test_split

# Veriyi yukle
df = pd.read_csv('kitapdata_preprocessed.csv')

# Ozellikleri ve hedef degiskeni ayir
X = df.drop('Toplam Satılma Sayısı', axis=1)
y = df['Toplam Satılma Sayısı']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Artik model egitimi yapabilirsiniz!
```

## 📊 Uygulanan Ön İşleme Adımları

| # | Adım | Açıklama |
|---|------|----------|
| 1 | **Veri Yükleme** | CSV dosyası pandas ile yüklendi |
| 2 | **Eksik Veri Tespiti** | NaN değerler ve "Puan Yok" gibi ifadeler tespit edildi |
| 3 | **Özellik Çıkarımı** | Puan, fiyat, yıl, kategori gibi yeni özellikler türetildi |
| 4 | **Imputation** | Eksik değerler medyan/mod ile dolduruldu |
| 5 | **Silme** | Hedef değişkende eksik olan satırlar silindi (0 satır) |
| 6 | **Outlier Detection** | IQR metodu ile aykırı değerler tespit edildi |
| 7 | **Outlier Cleaning** | Aykırı değerler capping ile temizlendi |
| 8 | **Label Encoding** | Dil, Cilt Tipi, Kağıt Cinsi encode edildi |
| 9 | **One-Hot Encoding** | Ana kategori için 11 binary sütun oluşturuldu |
| 10 | **Normalization** | Tüm sayısal özellikler 0-1 aralığına normalize edildi |

## 📈 Veri Seti İstatistikleri

### Ön İşleme Öncesi
- Satır: 1,497
- Sütun: 18
- Eksik Değer: Var (5 sütunda)
- Aykırı Değer: Var (4 sütunda)

### Ön İşleme Sonrası
- Satır: 1,497 ✅
- Sütun: 25 (model için)
- Eksik Değer: 0 ✅
- Aykırı Değer: Temizlendi ✅
- Veri Bütünlüğü: %100 ✅

## 🎨 Görselleştirme

`preprocessing_visualization.png` dosyası şunları içerir:

1. **Sol Üst**: Satış sayısı dağılımı (orijinal)
2. **Sağ Üst**: Satış sayısı dağılımı (normalize)
3. **Sol Alt**: Eksik değer oranları
4. **Sağ Alt**: En yaygın 10 kategori

## 🔍 Model Özellikleri (24 adet)

### Sayısal Özellikler (9):
- Fiyat (normalize)
- Sayfa sayısı (normalize)
- Favori sayısı (normalize)
- Okuma durumu istatistikleri (normalize)
- Yorum sayısı (normalize)
- Puan ve oy sayısı (normalize)

### Kategorik Özellikler (3):
- Dil (encoded: 0-2)
- Cilt tipi (encoded: 0-1)
- Kağıt cinsi (encoded: 0-4)

### One-Hot Encoded (12):
- 11 ana kategori + 1 grouped kategori

## 💡 Önerilen Model Algoritmaları

### Regresyon Modelleri
1. **Linear Regression** - Baseline model
2. **Ridge/Lasso Regression** - Regularization ile
3. **Random Forest Regressor** - Ensemble method
4. **Gradient Boosting** - XGBoost, LightGBM, CatBoost
5. **Neural Networks** - Deep learning yaklaşımı

### Örnek Model Eğitimi

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Model olustur
model = RandomForestRegressor(n_estimators=100, random_state=42)

# Egit
model.fit(X_train, y_train)

# Tahmin yap
y_pred = model.predict(X_test)

# Performans olc
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"MAE: {mae:.2f}")
print(f"R2 Score: {r2:.2f}")
```

## ⚙️ Gereksinimler

```bash
pip install pandas numpy scikit-learn matplotlib seaborn
```

## 📖 Detaylı Dokümantasyon

Tüm ön işleme adımlarının detaylı açıklaması için:
- **VERİ_ÖN_İŞLEME_DOKÜMANTASYON.md** dosyasına bakınız

## ⚠️ Önemli Notlar

1. **Veri Kaybı Yok**: 1,497 satırın tamamı korundu
2. **Aykırı Değerler**: Silme yerine capping uygulandı (veri kaybı yok)
3. **Eksik Değerler**: İstatistiksel yöntemlerle dolduruldu
4. **Normalizasyon**: 0-1 aralığı kullanıldı (standardization yerine)

## 🎓 Öğrenme Kaynakları

### Veri Ön İşleme Hakkında:
- [Scikit-learn Preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [Handling Missing Data](https://www.kaggle.com/learn/data-cleaning)

### Makine Öğrenmesi Modelleri:
- [Regression Tutorial](https://scikit-learn.org/stable/supervised_learning.html)
- [Model Evaluation Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html)

## 📞 İletişim

Sorularınız için proje sahibiyle iletişime geçebilirsiniz.

---

**Son Güncelleme**: 10 Ekim 2025  
**Durum**: ✅ Tamamlandı - Model eğitimine hazır!


