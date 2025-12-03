# -*- coding: utf-8 -*-
"""
Kitap Satis Sayisi Tahmini - Veri On Isleme (Data Preprocessing) Scripti
==========================================================================

Bu script, kitap veri setini makine ogrenmesi modeli icin hazirlamak uzere
kapsamli veri on isleme adimlarini uygular.

Uygulanan Adimlar:
1. Veri Yukleme ve Inceleme
2. Eksik Veri Tespiti
3. Boslukları Doldurma (Imputation)
4. Boslukları Silme
5. Aykiri Deger Tespiti (Outlier Detection)
6. Aykiri Degerleri Temizleme
7. Etiket Kodlama (Label Encoding)
8. Tek-Sicak Kodlama (One-Hot Encoding)
9. Veri Normalizasyonu (Min-Max Normalization)
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from datetime import datetime
import warnings
import sys

# Encoding ayarlari
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

warnings.filterwarnings('ignore')

# Turkce karakter destegi icin
plt.rcParams['font.family'] = 'DejaVu Sans'

print("=" * 80)
print("KITAP SATIS TAHMINI - VERI ON ISLEME SCRIPTI")
print("=" * 80)
print()

# ============================================================================
# 1. VERI YUKLEME VE ILK INCELEME
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 1: VERI YUKLEME VE ILK INCELEME")
print("=" * 80)

# Veriyi yukle
df = pd.read_csv('kitapdata.csv', encoding='utf-8')
print(f"\n[OK] Veri seti basariyla yuklendi!")
print(f"  - Toplam satir sayisi: {df.shape[0]}")
print(f"  - Toplam sutun sayisi: {df.shape[1]}")
print(f"\n[INFO] Sutun Isimleri:")
for i, col in enumerate(df.columns, 1):
    print(f"  {i:2d}. {col}")

print(f"\n[INFO] Ilk 5 satir:")
print(df.head())

print(f"\n[INFO] Veri Tipleri:")
print(df.dtypes)

print(f"\n[INFO] Temel Istatistikler:")
print(df.describe())

# Hedef degiskeni belirle
target_column = 'Toplam Satılma Sayısı'
print(f"\n[TARGET] Hedef Degisken: {target_column}")

# ============================================================================
# 2. EKSIK VERI TESPITI
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 2: EKSIK VERI TESPITI")
print("=" * 80)

# Eksik degerleri tespit et
missing_values = df.isnull().sum()
missing_percentage = (df.isnull().sum() / len(df)) * 100

missing_df = pd.DataFrame({
    'Sutun': missing_values.index,
    'Eksik Deger Sayisi': missing_values.values,
    'Yuzde (%)': missing_percentage.values
})
missing_df = missing_df[missing_df['Eksik Deger Sayisi'] > 0].sort_values('Eksik Deger Sayisi', ascending=False)

if len(missing_df) > 0:
    print(f"\n[WARNING] Eksik deger iceren sutunlar:")
    print(missing_df.to_string(index=False))
else:
    print(f"\n[OK] Hicbir sutunda eksik deger bulunamadi!")

# "Puan Yok" ve "Bilgi Yok" gibi degerleri NaN olarak isaretleyin
print(f"\n[INFO] 'Puan Yok' ve 'Bilgi Yok' gibi degerler tespit ediliyor...")
for col in df.columns:
    if df[col].dtype == 'object':
        df[col] = df[col].replace(['Puan Yok', 'Bilgi Yok', 'puan yok', 'bilgi yok'], np.nan)

# Tekrar eksik deger kontrolu
missing_values_after = df.isnull().sum()
missing_percentage_after = (df.isnull().sum() / len(df)) * 100

missing_df_after = pd.DataFrame({
    'Sutun': missing_values_after.index,
    'Eksik Deger Sayisi': missing_values_after.values,
    'Yuzde (%)': missing_percentage_after.values
})
missing_df_after = missing_df_after[missing_df_after['Eksik Deger Sayisi'] > 0].sort_values('Eksik Deger Sayisi', ascending=False)

if len(missing_df_after) > 0:
    print(f"\n[WARNING] Guncellenmis eksik deger raporu:")
    print(missing_df_after.to_string(index=False))

# ============================================================================
# 3. VERI TIPI DUZENLEMELERI VE OZELLIK CIKARIMI
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 3: VERI TIPI DUZENLEMELERI VE OZELLIK CIKARIMI")
print("=" * 80)

# Puan sutununu isle
if '100 Üzerinden Aldığı Puan' in df.columns:
    print(f"\n[PROCESS] '100 Uzerinden Aldigi Puan' sutunu isleniyor...")
    
    def extract_rating(rating_str):
        """Puan degerini cikar (orn: '5 / 5 (3 oy)' -> 5.0)"""
        if pd.isna(rating_str):
            return np.nan
        try:
            if '/' in str(rating_str):
                return float(str(rating_str).split('/')[0].strip())
            return np.nan
        except:
            return np.nan
    
    def extract_vote_count(rating_str):
        """Oy sayisini cikar (orn: '5 / 5 (3 oy)' -> 3)"""
        if pd.isna(rating_str):
            return np.nan
        try:
            if '(' in str(rating_str) and 'oy)' in str(rating_str):
                vote_part = str(rating_str).split('(')[1].split('oy')[0].strip()
                return int(vote_part)
            return 0
        except:
            return 0
    
    df['Puan_Degeri'] = df['100 Üzerinden Aldığı Puan'].apply(extract_rating)
    df['Oy_Sayisi'] = df['100 Üzerinden Aldığı Puan'].apply(extract_vote_count)
    print(f"  [OK] Puan degeri cikarildi")
    print(f"  [OK] Oy sayisi cikarildi")

# Fiyat sutununu isle
if 'Liste Fiyatı' in df.columns:
    print(f"\n[PROCESS] 'Liste Fiyati' sutunu isleniyor...")
    
    def clean_price(price_str):
        """Fiyat degerini temizle ve sayiya cevir"""
        if pd.isna(price_str):
            return np.nan
        try:
            # Virgulu noktaya cevir ve sayiya donustur
            clean_val = str(price_str).replace('"', '').replace(',', '.').strip()
            return float(clean_val)
        except:
            return np.nan
    
    df['Liste_Fiyati_Numeric'] = df['Liste Fiyatı'].apply(clean_price)
    print(f"  [OK] Fiyat degerleri sayisal formata donusturuldu")

# Yayin tarihini isle
if 'Yayın Tarihi' in df.columns:
    print(f"\n[PROCESS] 'Yayin Tarihi' sutunu isleniyor...")
    
    def parse_date(date_str):
        """Tarihi isle ve yil bilgisini cikar"""
        if pd.isna(date_str):
            return np.nan
        try:
            # DD.MM.YYYY formatini parse et
            date_obj = datetime.strptime(str(date_str), '%d.%m.%Y')
            return date_obj.year
        except:
            return np.nan
    
    df['Yayin_Yili'] = df['Yayın Tarihi'].apply(parse_date)
    print(f"  [OK] Yayin yili cikarildi")

# Sayfa sayisini isle
if 'Sayfa Sayısı' in df.columns:
    print(f"\n[PROCESS] 'Sayfa Sayisi' sutunu isleniyor...")
    
    def clean_page_count(page_str):
        """Sayfa sayisini temizle"""
        if pd.isna(page_str):
            return np.nan
        try:
            return int(page_str)
        except:
            return np.nan
    
    df['Sayfa_Sayisi_Numeric'] = df['Sayfa Sayısı'].apply(clean_page_count)
    print(f"  [OK] Sayfa sayisi sayisal formata donusturuldu")

# Ana kategoriyi cikar
if 'Kitabın kategorisi' in df.columns:
    print(f"\n[PROCESS] 'Kitabin kategorisi' sutunundan ana kategori cikariliyor...")
    
    def extract_main_category(category_str):
        """Ana kategoriyi cikar"""
        if pd.isna(category_str):
            return np.nan
        try:
            # Ilk '>' isaretine kadar olan kismi al
            parts = str(category_str).split('>')
            if len(parts) > 1:
                return parts[1].strip()
            return str(category_str).strip()
        except:
            return np.nan
    
    df['Ana_Kategori'] = df['Kitabın kategorisi'].apply(extract_main_category)
    print(f"  [OK] Ana kategori cikarildi")
    print(f"  - Benzersiz kategori sayisi: {df['Ana_Kategori'].nunique()}")

print(f"\n[OK] Ozellik cikarimi tamamlandi!")
print(f"  - Yeni sutunlar: Puan_Degeri, Oy_Sayisi, Liste_Fiyati_Numeric, Yayin_Yili, Sayfa_Sayisi_Numeric, Ana_Kategori")

# ============================================================================
# 4. BOSLUKLARI DOLDURMA (IMPUTATION)
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 4: BOSLUKLARI DOLDURMA (IMPUTATION)")
print("=" * 80)

print(f"\n[PROCESS] Istatistiksel yontemlerle eksik degerler dolduruluyor...")

# Sayisal sutunlar icin medyan ile doldurma
numeric_columns = ['Puan_Degeri', 'Oy_Sayisi', 'Liste_Fiyati_Numeric', 
                   'Yayin_Yili', 'Sayfa_Sayisi_Numeric',
                   'Favorilere Ekleyen Kişi Sayısı', 'Okuyacağım olarak işaretlenmiş sayısı',
                   'Okuyorum olarak işaretlenmiş sayısı', 'Okudum olarak işaretlenmiş sayısı',
                   'Toplam Satılma Sayısı', 'Toplam Yorum Sayısı']

for col in numeric_columns:
    if col in df.columns:
        missing_count = df[col].isnull().sum()
        if missing_count > 0:
            median_value = df[col].median()
            df[col].fillna(median_value, inplace=True)
            print(f"  [OK] {col}: {missing_count} eksik deger medyan ({median_value:.2f}) ile dolduruldu")

# Kategorik sutunlar icin mod (en sik kullanilan deger) ile doldurma
categorical_columns = ['Dil', 'Cilt Tipi', 'Kağıt Cinsi', 'Ana_Kategori']

for col in categorical_columns:
    if col in df.columns:
        missing_count = df[col].isnull().sum()
        if missing_count > 0:
            mode_value = df[col].mode()[0] if not df[col].mode().empty else 'Bilinmiyor'
            df[col].fillna(mode_value, inplace=True)
            print(f"  [OK] {col}: {missing_count} eksik deger mod ('{mode_value}') ile dolduruldu")

print(f"\n[OK] Imputation islemi tamamlandi!")

# ============================================================================
# 5. BOSLUKLARI SILME
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 5: KRITIK SUTUNLARDA BOSLUKLARI SILME")
print("=" * 80)

# Hedef degiskende eksik deger olmamali
initial_rows = len(df)
df = df.dropna(subset=[target_column])
removed_rows = initial_rows - len(df)

print(f"\n[INFO] Hedef degiskende ({target_column}) eksik deger olan satirlar silindi")
print(f"  - Silinen satir sayisi: {removed_rows}")
print(f"  - Kalan satir sayisi: {len(df)}")

# ============================================================================
# 6. AYKIRI DEGER TESPITI (OUTLIER DETECTION)
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 6: AYKIRI DEGER TESPITI (IQR METODU)")
print("=" * 80)

def detect_outliers_iqr(df, column):
    """IQR metoduyla aykiri degerleri tespit et"""
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]
    
    return outliers, lower_bound, upper_bound

print(f"\n[PROCESS] Sayisal sutunlarda aykiri degerler tespit ediliyor...")

outlier_report = {}
outlier_columns = ['Liste_Fiyati_Numeric', 'Sayfa_Sayisi_Numeric', 
                   'Favorilere Ekleyen Kişi Sayısı', 'Toplam Satılma Sayısı']

for col in outlier_columns:
    if col in df.columns:
        outliers, lower, upper = detect_outliers_iqr(df, col)
        outlier_count = len(outliers)
        outlier_percentage = (outlier_count / len(df)) * 100
        
        outlier_report[col] = {
            'count': outlier_count,
            'percentage': outlier_percentage,
            'lower_bound': lower,
            'upper_bound': upper
        }
        
        print(f"\n  [INFO] {col}:")
        print(f"     - Aykiri deger sayisi: {outlier_count} ({outlier_percentage:.2f}%)")
        print(f"     - Alt sinir: {lower:.2f}")
        print(f"     - Ust sinir: {upper:.2f}")

# ============================================================================
# 7. AYKIRI DEGERLERI TEMIZLEME
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 7: AYKIRI DEGERLERI TEMIZLEME (CAPPING)")
print("=" * 80)

print(f"\n[PROCESS] Aykiri degerler sinir degerleriyle degistiriliyor (capping)...")

for col in outlier_columns:
    if col in df.columns and col in outlier_report:
        lower = outlier_report[col]['lower_bound']
        upper = outlier_report[col]['upper_bound']
        
        # Alt ve ust sinirlarin disindaki degerleri sinirlarla degistir
        df[col] = df[col].clip(lower=lower, upper=upper)
        print(f"  [OK] {col}: Aykiri degerler sinir degerleriyle degistirildi")

print(f"\n[OK] Aykiri deger temizleme tamamlandi!")

# ============================================================================
# 8. ETIKET KODLAMA (LABEL ENCODING)
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 8: ETIKET KODLAMA (LABEL ENCODING)")
print("=" * 80)

print(f"\n[PROCESS] Sirali kategorik degiskenler icin etiket kodlama uygulanıyor...")

# Label Encoding icin uygun sutunlar (sirali kategorik)
label_encode_columns = ['Dil', 'Cilt Tipi', 'Kağıt Cinsi']

label_encoders = {}
for col in label_encode_columns:
    if col in df.columns:
        le = LabelEncoder()
        df[f'{col}_Encoded'] = le.fit_transform(df[col].astype(str))
        label_encoders[col] = le
        
        unique_count = len(le.classes_)
        print(f"  [OK] {col}: {unique_count} benzersiz deger kodlandi")
        print(f"     Ornek: {list(le.classes_[:3])} -> [0, 1, 2]")

print(f"\n[OK] Label Encoding tamamlandi!")

# ============================================================================
# 9. TEK-SICAK KODLAMA (ONE-HOT ENCODING)
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 9: TEK-SICAK KODLAMA (ONE-HOT ENCODING)")
print("=" * 80)

print(f"\n[PROCESS] Nominal kategorik degiskenler icin one-hot encoding uygulanıyor...")

# One-Hot Encoding icin uygun sutunlar (nominal kategorik)
onehot_columns = ['Ana_Kategori']

for col in onehot_columns:
    if col in df.columns:
        # Kategorileri sinirla (en yaygin kategoriler)
        top_n = 10
        top_categories = df[col].value_counts().head(top_n).index.tolist()
        
        print(f"\n  [INFO] {col}:")
        print(f"     - Toplam benzersiz deger: {df[col].nunique()}")
        print(f"     - En yaygin {top_n} kategori secildi")
        
        # Diger kategorileri 'Diger' olarak grupla
        df[f'{col}_Grouped'] = df[col].apply(lambda x: x if x in top_categories else 'Diger')
        
        # One-hot encoding uygula
        dummies = pd.get_dummies(df[f'{col}_Grouped'], prefix=col, dtype=int)
        df = pd.concat([df, dummies], axis=1)
        
        print(f"     - {len(dummies.columns)} yeni sutun olusturuldu")
        print(f"     - Ornek sutunlar: {list(dummies.columns[:3])}")

print(f"\n[OK] One-Hot Encoding tamamlandi!")

# ============================================================================
# 10. VERI NORMALIZASYONU (MIN-MAX SCALING)
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 10: VERI NORMALIZASYONU (MIN-MAX NORMALIZATION)")
print("=" * 80)

print(f"\n[PROCESS] Sayisal degiskenler 0-1 araligina normalize ediliyor...")

# Normalize edilecek sutunlar
normalize_columns = ['Liste_Fiyati_Numeric', 'Sayfa_Sayisi_Numeric', 
                    'Favorilere Ekleyen Kişi Sayısı', 'Okuyacağım olarak işaretlenmiş sayısı',
                    'Okuyorum olarak işaretlenmiş sayısı', 'Okudum olarak işaretlenmiş sayısı',
                    'Toplam Yorum Sayısı', 'Puan_Degeri', 'Oy_Sayisi']

scaler = MinMaxScaler()

for col in normalize_columns:
    if col in df.columns:
        # Orijinal degerleri koru
        original_min = df[col].min()
        original_max = df[col].max()
        
        # Normalize et
        df[f'{col}_Normalized'] = scaler.fit_transform(df[[col]])
        
        print(f"  [OK] {col}")
        print(f"     Orijinal aralik: [{original_min:.2f}, {original_max:.2f}]")
        print(f"     Yeni aralik: [0.00, 1.00]")

# Hedef degiskeni de normalize et (opsiyonel - model egitimi icin)
if target_column in df.columns:
    df[f'{target_column}_Normalized'] = scaler.fit_transform(df[[target_column]])
    print(f"\n  [TARGET] Hedef degisken ({target_column}) normalize edildi")

print(f"\n[OK] Normalizasyon tamamlandi!")

# ============================================================================
# 11. OZELLIK SECIMI VE SON VERI SETINI OLUSTURMA
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 11: ISLENMIS VERI SETINI OLUSTURMA")
print("=" * 80)

# Model icin kullanilacak ozellikleri sec
selected_features = []

# Sayisal ozellikler (normalized)
for col in normalize_columns:
    if f'{col}_Normalized' in df.columns:
        selected_features.append(f'{col}_Normalized')

# Encoded ozellikler
for col in label_encode_columns:
    if f'{col}_Encoded' in df.columns:
        selected_features.append(f'{col}_Encoded')

# One-hot encoded ozellikler
onehot_features = [col for col in df.columns if col.startswith('Ana_Kategori_')]
selected_features.extend(onehot_features)

# Hedef degisken
selected_features.append(target_column)

# Secili ozellikleri iceren yeni DataFrame olustur
df_processed = df[selected_features].copy()

# Ana_Kategori_Grouped sutununu cikar (string oldugu icin model icin uygun degil)
if 'Ana_Kategori_Grouped' in df_processed.columns:
    df_processed = df_processed.drop('Ana_Kategori_Grouped', axis=1)
    print(f"\n[INFO] 'Ana_Kategori_Grouped' sutunu cikarildi (string sütun)")

print(f"\n[OK] Islenmis veri seti olusturuldu!")
print(f"  - Toplam ozellik sayisi: {len(df_processed.columns) - 1} (hedef degisken haric)")
print(f"  - Hedef degisken: {target_column}")
print(f"  - Toplam satir sayisi: {len(df_processed)}")

# ============================================================================
# 12. VERI KALITESI RAPORU
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 12: VERI KALITESI RAPORU")
print("=" * 80)

print(f"\n[INFO] Son Durum:")
print(f"  - Eksik deger sayisi: {df_processed.isnull().sum().sum()}")
print(f"  - Toplam hucre sayisi: {df_processed.shape[0] * df_processed.shape[1]}")
print(f"  - Veri butunlugu: {((1 - df_processed.isnull().sum().sum() / (df_processed.shape[0] * df_processed.shape[1])) * 100):.2f}%")

# ============================================================================
# 13. ISLENMIS VERIYI KAYDETME
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 13: ISLENMIS VERIYI KAYDETME")
print("=" * 80)

output_filename = 'kitapdata_model_ready.csv'
df_processed.to_csv(output_filename, index=False, encoding='utf-8-sig')

print(f"\n[SAVE] Islenmis veri seti kaydedildi!")
print(f"  - Dosya adi: {output_filename}")
print(f"  - Boyut: {df_processed.shape[0]} satir x {df_processed.shape[1]} sutun")
print(f"  - STRING SUTUN YOK - TUM DEGERLER SAYISAL!")

# Detayli veri seti de kaydedilsin (tum sutunlarla)
detailed_output_filename = 'kitapdata_full_details.csv'
df.to_csv(detailed_output_filename, index=False, encoding='utf-8-sig')

print(f"\n[SAVE] Detayli veri seti (tum sutunlar) kaydedildi!")
print(f"  - Dosya adi: {detailed_output_filename}")
print(f"  - Boyut: {df.shape[0]} satir x {df.shape[1]} sutun")

# ============================================================================
# 14. GORSELLESTIRME VE DOKUMANTASYON
# ============================================================================
print("\n" + "=" * 80)
print("ADIM 14: GORSELLESTIRME OLUSTURULUYOR")
print("=" * 80)

# Gorsellestirmeler olustur
try:
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle('Veri On Isleme Sonuclari - Gorsellestirme', fontsize=16, fontweight='bold')

    # 1. Hedef degiskenin dagilimi (normalizasyon oncesi)
    axes[0, 0].hist(df[target_column], bins=50, color='skyblue', edgecolor='black', alpha=0.7)
    axes[0, 0].set_title(f'{target_column} - Dagilim (Orijinal)', fontweight='bold')
    axes[0, 0].set_xlabel('Satis Sayisi')
    axes[0, 0].set_ylabel('Frekans')
    axes[0, 0].grid(True, alpha=0.3)

    # 2. Hedef degiskenin dagilimi (normalizasyon sonrasi)
    if f'{target_column}_Normalized' in df.columns:
        axes[0, 1].hist(df[f'{target_column}_Normalized'], bins=50, color='lightgreen', edgecolor='black', alpha=0.7)
        axes[0, 1].set_title(f'{target_column} - Dagilim (Normalize)', fontweight='bold')
        axes[0, 1].set_xlabel('Normalize Satis Sayisi [0-1]')
        axes[0, 1].set_ylabel('Frekans')
        axes[0, 1].grid(True, alpha=0.3)

    # 3. Eksik deger oranlari (preprocessing oncesi)
    missing_before = missing_percentage_after[missing_percentage_after > 0].sort_values(ascending=True)
    if len(missing_before) > 0:
        axes[1, 0].barh(range(len(missing_before)), missing_before.values, color='coral', alpha=0.7)
        axes[1, 0].set_yticks(range(len(missing_before)))
        axes[1, 0].set_yticklabels(missing_before.index, fontsize=8)
        axes[1, 0].set_title('Eksik Deger Oranlari (Islem Oncesi)', fontweight='bold')
        axes[1, 0].set_xlabel('Yuzde (%)')
        axes[1, 0].grid(True, alpha=0.3, axis='x')
    else:
        axes[1, 0].text(0.5, 0.5, 'Eksik Deger Yok', ha='center', va='center', fontsize=14)
        axes[1, 0].set_title('Eksik Deger Oranlari (Islem Oncesi)', fontweight='bold')

    # 4. Kategorik degisken dagilimi
    if 'Ana_Kategori' in df.columns:
        top_categories = df['Ana_Kategori'].value_counts().head(10)
        axes[1, 1].barh(range(len(top_categories)), top_categories.values, color='plum', alpha=0.7)
        axes[1, 1].set_yticks(range(len(top_categories)))
        axes[1, 1].set_yticklabels(top_categories.index, fontsize=8)
        axes[1, 1].set_title('En Yaygin 10 Ana Kategori', fontweight='bold')
        axes[1, 1].set_xlabel('Kitap Sayisi')
        axes[1, 1].grid(True, alpha=0.3, axis='x')

    plt.tight_layout()
    plt.savefig('preprocessing_visualization.png', dpi=300, bbox_inches='tight')
    print(f"\n[SAVE] Gorsellestirme kaydedildi: preprocessing_visualization.png")
except Exception as e:
    print(f"\n[WARNING] Gorsellestirme olusturulamadi: {str(e)}")

# ============================================================================
# 15. OZET RAPOR
# ============================================================================
print("\n" + "=" * 80)
print("OZET RAPOR - VERI ON ISLEME TAMAMLANDI!")
print("=" * 80)

report = f"""
================================================================================
                     VERI ON ISLEME OZET RAPORU                               
================================================================================

GIRIS VERISI:
   - Dosya: kitapdata.csv
   - Satir Sayisi: {initial_rows}
   - Sutun Sayisi: {len(df.columns)}

UYGULANAN ISLEMLER:

   1. [OK] Veri Yukleme ve Inceleme
   2. [OK] Eksik Veri Tespiti
   3. [OK] Ozellik Cikarimi (Puan, Fiyat, Tarih, vb.)
   4. [OK] Boslukları Doldurma (Imputation) - Medyan ve Mod ile
   5. [OK] Kritik Sutunlarda Boslukları Silme
   6. [OK] Aykiri Deger Tespiti (IQR Metodu)
   7. [OK] Aykiri Degerleri Temizleme (Capping)
   8. [OK] Etiket Kodlama (Label Encoding) - {len(label_encode_columns)} sutun
   9. [OK] Tek-Sicak Kodlama (One-Hot Encoding) - Ana kategori
   10. [OK] Veri Normalizasyonu (Min-Max 0-1)

CIKIS VERILERI:
   
   - {output_filename}
     Satir: {df_processed.shape[0]}
     Sutun: {df_processed.shape[1]}
     Aciklama: Model icin hazir ozellikler
   
   - {detailed_output_filename}
     Satir: {df.shape[0]}
     Sutun: {df.shape[1]}
     Aciklama: Tum sutunlari iceren detayli veri seti
   
   - preprocessing_visualization.png
     Gorsellestirme raporu

HEDEF DEGISKEN: {target_column}

VERI SETI MAKINE OGRENMESI ICIN HAZIR!
"""

print(report)

# Raporu dosyaya kaydet
with open('preprocessing_report.txt', 'w', encoding='utf-8') as f:
    f.write(report)
    f.write("\n\n" + "=" * 80 + "\n")
    f.write("DETAYLI SUTUN BILGILERI\n")
    f.write("=" * 80 + "\n\n")
    
    f.write("ISLENMIS VERI SETINDEKI SUTUNLAR:\n")
    f.write("-" * 80 + "\n")
    for i, col in enumerate(df_processed.columns, 1):
        f.write(f"{i:3d}. {col}\n")
    
    f.write("\n" + "=" * 80 + "\n")
    f.write("ISTATISTIKSEL OZET\n")
    f.write("=" * 80 + "\n\n")
    f.write(df_processed.describe().to_string())

print(f"\n[SAVE] Detayli rapor kaydedildi: preprocessing_report.txt")

print("\n" + "=" * 80)
print("TUM ISLEMLER BASARIYLA TAMAMLANDI!")
print("=" * 80)
print()
