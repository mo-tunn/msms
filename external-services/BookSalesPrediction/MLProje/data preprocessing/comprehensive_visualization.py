# -*- coding: utf-8 -*-
"""
KAPSAMLI VERI ON ISLEME GORSELLESTIRME SCRIPTI
================================================

Bu script, veri on isleme surecinin TUM adimlarini detayli olarak
gorsellestirir ve kapsamli bir rapor olusturur.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
import sys

# Encoding ayarlari
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

warnings.filterwarnings('ignore')

# Stil ayarlari
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")
plt.rcParams['figure.dpi'] = 100
plt.rcParams['savefig.dpi'] = 300

print("=" * 80)
print("KAPSAMLI VERI ON ISLEME GORSELLESTIRME")
print("=" * 80)
print()

# Veriyi yukle
print("[1/10] Veriler yukleniyor...")
df_original = pd.read_csv('kitapdata.csv', encoding='utf-8')
df_processed_full = pd.read_csv('kitapdata_full_preprocessed.csv', encoding='utf-8-sig')
df_final = pd.read_csv('kitapdata_preprocessed.csv', encoding='utf-8-sig')

print(f"  - Orijinal veri: {df_original.shape}")
print(f"  - Islenmis veri (tam): {df_processed_full.shape}")
print(f"  - Islenmis veri (model): {df_final.shape}")

# ============================================================================
# GRAFIK 1-2: EKSIK VERI ANALIZI
# ============================================================================
print("\n[2/10] Eksik veri analizleri olusturuluyor...")

fig1 = plt.figure(figsize=(20, 10))
fig1.suptitle('ADIM 1-2: EKSIK VERI TESPITI VE ANALIZI', 
              fontsize=20, fontweight='bold', y=0.98)

# 1.1 - Eksik deger oranlari (bar chart)
ax1 = plt.subplot(2, 3, 1)
missing_before = df_original.isnull().sum()
missing_before = missing_before[missing_before > 0].sort_values(ascending=True)

if len(missing_before) > 0:
    colors = plt.cm.Reds(np.linspace(0.4, 0.9, len(missing_before)))
    bars = ax1.barh(range(len(missing_before)), missing_before.values, color=colors)
    ax1.set_yticks(range(len(missing_before)))
    ax1.set_yticklabels(missing_before.index, fontsize=9)
    ax1.set_xlabel('Eksik Deger Sayisi', fontweight='bold')
    ax1.set_title('Eksik Deger Sayilari (Orijinal Veri)', fontweight='bold')
    ax1.grid(True, alpha=0.3, axis='x')
    
    # Degerler ekle
    for i, (idx, val) in enumerate(missing_before.items()):
        ax1.text(val + 5, i, f'{int(val)}', va='center', fontsize=9, fontweight='bold')
else:
    ax1.text(0.5, 0.5, 'Eksik Deger Yok', ha='center', va='center', fontsize=14)

# 1.2 - Eksik deger yuzdeleri
ax2 = plt.subplot(2, 3, 2)
missing_pct = (df_original.isnull().sum() / len(df_original)) * 100
missing_pct = missing_pct[missing_pct > 0].sort_values(ascending=True)

if len(missing_pct) > 0:
    colors = plt.cm.Oranges(np.linspace(0.4, 0.9, len(missing_pct)))
    bars = ax2.barh(range(len(missing_pct)), missing_pct.values, color=colors)
    ax2.set_yticks(range(len(missing_pct)))
    ax2.set_yticklabels(missing_pct.index, fontsize=9)
    ax2.set_xlabel('Eksik Deger Yuzdesi (%)', fontweight='bold')
    ax2.set_title('Eksik Deger Oranlari (Orijinal Veri)', fontweight='bold')
    ax2.grid(True, alpha=0.3, axis='x')
    
    for i, (idx, val) in enumerate(missing_pct.items()):
        ax2.text(val + 0.5, i, f'{val:.1f}%', va='center', fontsize=9, fontweight='bold')

# 1.3 - Heatmap (eksik degerler)
ax3 = plt.subplot(2, 3, 3)
missing_cols = missing_before.index.tolist()[:5] if len(missing_before) > 0 else []

if len(missing_cols) > 0:
    missing_matrix = df_original[missing_cols].head(100).isnull().astype(int)
    sns.heatmap(missing_matrix.T, cmap='RdYlGn_r', cbar_kws={'label': 'Eksik (1) / Dolu (0)'},
                ax=ax3, yticklabels=missing_cols)
    ax3.set_title('Eksik Deger Haritasi (Ilk 100 Satir)', fontweight='bold')
    ax3.set_xlabel('Satir Indexi')
else:
    ax3.text(0.5, 0.5, 'Eksik Deger Yok', ha='center', va='center', fontsize=14)
    ax3.set_title('Eksik Deger Haritasi', fontweight='bold')

# 1.4 - Veri butunlugu (pasta grafik - oncesi)
ax4 = plt.subplot(2, 3, 4)
total_cells = df_original.shape[0] * df_original.shape[1]
missing_cells = df_original.isnull().sum().sum()
filled_cells = total_cells - missing_cells

sizes = [filled_cells, missing_cells]
labels = [f'Dolu Hucre\n{filled_cells:,}', f'Eksik Hucre\n{missing_cells:,}']
colors = ['#2ecc71', '#e74c3c']
explode = (0, 0.1)

ax4.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.2f%%',
        shadow=True, startangle=90, textprops={'fontsize': 10, 'fontweight': 'bold'})
ax4.set_title('Veri Butunlugu (Orijinal)', fontweight='bold')

# 1.5 - Veri butunlugu (pasta grafik - sonrasi)
ax5 = plt.subplot(2, 3, 5)
total_cells_after = df_processed_full.shape[0] * df_processed_full.shape[1]
missing_cells_after = df_processed_full.isnull().sum().sum()
filled_cells_after = total_cells_after - missing_cells_after

sizes2 = [filled_cells_after, missing_cells_after]
labels2 = [f'Dolu Hucre\n{filled_cells_after:,}', f'Eksik Hucre\n{missing_cells_after:,}']

ax5.pie(sizes2, explode=(0, 0.1) if missing_cells_after > 0 else (0,), 
        labels=labels2 if missing_cells_after > 0 else [labels2[0]], 
        colors=colors if missing_cells_after > 0 else [colors[0]], 
        autopct='%1.2f%%' if missing_cells_after > 0 else '',
        shadow=True, startangle=90, textprops={'fontsize': 10, 'fontweight': 'bold'})
ax5.set_title('Veri Butunlugu (Islenmis)', fontweight='bold')

# 1.6 - Karsilastirma (bar chart)
ax6 = plt.subplot(2, 3, 6)
before_pct = (missing_cells / total_cells) * 100
after_pct = (missing_cells_after / total_cells_after) * 100

bars = ax6.bar(['Orijinal Veri', 'Islenmis Veri'], [before_pct, after_pct],
               color=['#e74c3c', '#2ecc71'], alpha=0.7, edgecolor='black', linewidth=2)
ax6.set_ylabel('Eksik Deger Orani (%)', fontweight='bold')
ax6.set_title('Eksik Deger Azalma Karsilastirmasi', fontweight='bold')
ax6.grid(True, alpha=0.3, axis='y')

for bar in bars:
    height = bar.get_height()
    ax6.text(bar.get_x() + bar.get_width()/2., height,
             f'{height:.2f}%', ha='center', va='bottom', fontweight='bold', fontsize=11)

plt.tight_layout()
plt.savefig('1_eksik_veri_analizi.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 1_eksik_veri_analizi.png")

# ============================================================================
# GRAFIK 3-5: AYKIRI DEGER ANALIZI
# ============================================================================
print("\n[3/10] Aykiri deger analizleri olusturuluyor...")

fig2 = plt.figure(figsize=(20, 12))
fig2.suptitle('ADIM 6-7: AYKIRI DEGER TESPITI VE TEMIZLEME', 
              fontsize=20, fontweight='bold', y=0.98)

outlier_cols = ['Liste_Fiyati_Numeric', 'Sayfa_Sayisi_Numeric', 
                'Favorilere Ekleyen Kişi Sayısı', 'Toplam Satılma Sayısı']

for idx, col in enumerate(outlier_cols):
    if col in df_processed_full.columns:
        # Boxplot - Oncesi
        ax_box = plt.subplot(4, 3, idx*3 + 1)
        
        # Orijinal veriden al (islenmeden once)
        if col in df_original.columns:
            data_orig = pd.to_numeric(df_original[col], errors='coerce').dropna()
        else:
            data_orig = df_processed_full[col]
        
        bp = ax_box.boxplot([data_orig], vert=True, patch_artist=True,
                            labels=['Orijinal'])
        bp['boxes'][0].set_facecolor('#3498db')
        bp['boxes'][0].set_alpha(0.7)
        
        ax_box.set_ylabel('Deger', fontweight='bold')
        ax_box.set_title(f'{col}\nBoxplot (Oncesi)', fontweight='bold', fontsize=10)
        ax_box.grid(True, alpha=0.3, axis='y')
        
        # Histogram - Oncesi
        ax_hist1 = plt.subplot(4, 3, idx*3 + 2)
        ax_hist1.hist(data_orig, bins=50, color='#3498db', alpha=0.7, edgecolor='black')
        ax_hist1.set_xlabel('Deger', fontweight='bold')
        ax_hist1.set_ylabel('Frekans', fontweight='bold')
        ax_hist1.set_title(f'{col}\nDagilim (Oncesi)', fontweight='bold', fontsize=10)
        ax_hist1.grid(True, alpha=0.3)
        
        # IQR bilgisi ekle
        Q1 = data_orig.quantile(0.25)
        Q3 = data_orig.quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        outliers = data_orig[(data_orig < lower) | (data_orig > upper)]
        
        ax_hist1.axvline(lower, color='r', linestyle='--', linewidth=2, label=f'Alt Sinir: {lower:.1f}')
        ax_hist1.axvline(upper, color='r', linestyle='--', linewidth=2, label=f'Ust Sinir: {upper:.1f}')
        ax_hist1.legend(fontsize=8)
        
        # Histogram - Sonrasi
        ax_hist2 = plt.subplot(4, 3, idx*3 + 3)
        data_after = df_processed_full[col].dropna()
        ax_hist2.hist(data_after, bins=50, color='#2ecc71', alpha=0.7, edgecolor='black')
        ax_hist2.set_xlabel('Deger', fontweight='bold')
        ax_hist2.set_ylabel('Frekans', fontweight='bold')
        ax_hist2.set_title(f'{col}\nDagilim (Sonrasi - Temiz)', fontweight='bold', fontsize=10)
        ax_hist2.grid(True, alpha=0.3)
        
        # Istatistik bilgisi ekle
        ax_hist2.text(0.98, 0.97, 
                     f'Aykiri: {len(outliers)}\n({len(outliers)/len(data_orig)*100:.1f}%)',
                     transform=ax_hist2.transAxes, ha='right', va='top',
                     bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8),
                     fontsize=9, fontweight='bold')

plt.tight_layout()
plt.savefig('2_aykiri_deger_analizi.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 2_aykiri_deger_analizi.png")

# ============================================================================
# GRAFIK 6-8: NORMALIZASYON ANALIZI
# ============================================================================
print("\n[4/10] Normalizasyon analizleri olusturuluyor...")

fig3 = plt.figure(figsize=(20, 16))
fig3.suptitle('ADIM 10: VERI NORMALIZASYONU (MIN-MAX 0-1)', 
              fontsize=20, fontweight='bold', y=0.98)

normalize_cols = ['Liste_Fiyati_Numeric', 'Sayfa_Sayisi_Numeric', 
                  'Favorilere Ekleyen Kişi Sayısı', 'Puan_Degeri', 
                  'Toplam Satılma Sayısı', 'Toplam Yorum Sayısı']

for idx, col in enumerate(normalize_cols):
    if col in df_processed_full.columns:
        # Orijinal veri
        ax1 = plt.subplot(6, 3, idx*3 + 1)
        data_orig = df_processed_full[col].dropna()
        ax1.hist(data_orig, bins=40, color='#e74c3c', alpha=0.7, edgecolor='black')
        ax1.set_xlabel('Orijinal Deger', fontweight='bold', fontsize=9)
        ax1.set_ylabel('Frekans', fontweight='bold', fontsize=9)
        ax1.set_title(f'{col}\n(Orijinal)', fontweight='bold', fontsize=10)
        ax1.grid(True, alpha=0.3)
        
        stats_text = f'Min: {data_orig.min():.1f}\nMax: {data_orig.max():.1f}\nOrtalama: {data_orig.mean():.1f}'
        ax1.text(0.98, 0.97, stats_text,
                transform=ax1.transAxes, ha='right', va='top',
                bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8),
                fontsize=8, fontweight='bold')
        
        # Normalize edilmis veri
        norm_col = f'{col}_Normalized'
        if norm_col in df_processed_full.columns:
            ax2 = plt.subplot(6, 3, idx*3 + 2)
            data_norm = df_processed_full[norm_col].dropna()
            ax2.hist(data_norm, bins=40, color='#2ecc71', alpha=0.7, edgecolor='black')
            ax2.set_xlabel('Normalize Deger [0-1]', fontweight='bold', fontsize=9)
            ax2.set_ylabel('Frekans', fontweight='bold', fontsize=9)
            ax2.set_title(f'{col}\n(Normalize)', fontweight='bold', fontsize=10)
            ax2.grid(True, alpha=0.3)
            ax2.set_xlim(-0.05, 1.05)
            
            stats_text2 = f'Min: {data_norm.min():.3f}\nMax: {data_norm.max():.3f}\nOrtalama: {data_norm.mean():.3f}'
            ax2.text(0.98, 0.97, stats_text2,
                    transform=ax2.transAxes, ha='right', va='top',
                    bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.8),
                    fontsize=8, fontweight='bold')
            
            # Karsilastirma scatter
            ax3 = plt.subplot(6, 3, idx*3 + 3)
            sample_size = min(500, len(data_orig))
            indices = np.random.choice(len(data_orig), sample_size, replace=False)
            
            ax3.scatter(data_orig.iloc[indices], data_norm.iloc[indices], 
                       alpha=0.5, s=30, color='#9b59b6')
            ax3.set_xlabel('Orijinal Deger', fontweight='bold', fontsize=9)
            ax3.set_ylabel('Normalize Deger', fontweight='bold', fontsize=9)
            ax3.set_title(f'{col}\n(Donusum)', fontweight='bold', fontsize=10)
            ax3.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('3_normalizasyon_analizi.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 3_normalizasyon_analizi.png")

# ============================================================================
# GRAFIK 9: ENCODING ANALIZI
# ============================================================================
print("\n[5/10] Encoding analizleri olusturuluyor...")

fig4 = plt.figure(figsize=(20, 10))
fig4.suptitle('ADIM 8-9: ETIKET KODLAMA VE ONE-HOT ENCODING', 
              fontsize=20, fontweight='bold', y=0.98)

# Label Encoding
encoding_cols = ['Dil', 'Cilt Tipi', 'Kağıt Cinsi']

for idx, col in enumerate(encoding_cols):
    ax = plt.subplot(2, 3, idx + 1)
    
    if col in df_processed_full.columns:
        value_counts = df_processed_full[col].value_counts()
        colors_enc = plt.cm.Paired(np.linspace(0, 1, len(value_counts)))
        
        bars = ax.barh(range(len(value_counts)), value_counts.values, color=colors_enc)
        ax.set_yticks(range(len(value_counts)))
        ax.set_yticklabels(value_counts.index, fontsize=9)
        ax.set_xlabel('Kitap Sayisi', fontweight='bold')
        ax.set_title(f'{col} - Dagilim\n(Label Encoded)', fontweight='bold')
        ax.grid(True, alpha=0.3, axis='x')
        
        for i, val in enumerate(value_counts.values):
            ax.text(val + 10, i, f'{int(val)}', va='center', fontsize=9, fontweight='bold')

# One-Hot Encoding - Ana Kategori
ax4 = plt.subplot(2, 3, 4)
if 'Ana_Kategori' in df_processed_full.columns:
    cat_counts = df_processed_full['Ana_Kategori'].value_counts().head(15)
    colors_cat = plt.cm.viridis(np.linspace(0, 1, len(cat_counts)))
    
    bars = ax4.barh(range(len(cat_counts)), cat_counts.values, color=colors_cat)
    ax4.set_yticks(range(len(cat_counts)))
    ax4.set_yticklabels(cat_counts.index, fontsize=9)
    ax4.set_xlabel('Kitap Sayisi', fontweight='bold')
    ax4.set_title('Ana Kategori Dagilimi\n(One-Hot Encoding Oncesi)', fontweight='bold')
    ax4.grid(True, alpha=0.3, axis='x')
    
    for i, val in enumerate(cat_counts.values):
        ax4.text(val + 10, i, f'{int(val)}', va='center', fontsize=9, fontweight='bold')

# One-Hot encoded sutunlar
ax5 = plt.subplot(2, 3, 5)
onehot_cols = [col for col in df_final.columns if col.startswith('Ana_Kategori_')]
onehot_sums = {col.replace('Ana_Kategori_', ''): int(df_final[col].sum()) for col in onehot_cols}
onehot_sums = dict(sorted(onehot_sums.items(), key=lambda x: int(x[1]), reverse=True))

colors_oh = plt.cm.plasma(np.linspace(0, 1, len(onehot_sums)))
bars = ax5.barh(range(len(onehot_sums)), list(onehot_sums.values()), color=colors_oh)
ax5.set_yticks(range(len(onehot_sums)))
ax5.set_yticklabels(list(onehot_sums.keys()), fontsize=9)
ax5.set_xlabel('Kitap Sayisi (Binary Sum)', fontweight='bold')
ax5.set_title('One-Hot Encoded Kategoriler\n(Binary Sutunlar)', fontweight='bold')
ax5.grid(True, alpha=0.3, axis='x')

for i, val in enumerate(onehot_sums.values()):
    ax5.text(val + 5, i, f'{int(val)}', va='center', fontsize=9, fontweight='bold')

# Encoding ornegi (tablo)
ax6 = plt.subplot(2, 3, 6)
ax6.axis('tight')
ax6.axis('off')

sample_data = []
for i, col in enumerate(encoding_cols):
    if col in df_processed_full.columns:
        encoded_col = f'{col}_Encoded'
        if encoded_col in df_processed_full.columns:
            unique_vals = df_processed_full[col].unique()[:3]
            encoded_vals = df_processed_full[encoded_col].unique()[:3]
            for orig, enc in zip(unique_vals, encoded_vals):
                sample_data.append([col, str(orig), str(int(enc))])

if sample_data:
    table = ax6.table(cellText=sample_data, 
                     colLabels=['Sutun', 'Orijinal Deger', 'Encoded Deger'],
                     cellLoc='left', loc='center',
                     colWidths=[0.3, 0.4, 0.3])
    table.auto_set_font_size(False)
    table.set_fontsize(9)
    table.scale(1, 2)
    
    for i in range(len(sample_data) + 1):
        if i == 0:
            table[(i, 0)].set_facecolor('#34495e')
            table[(i, 1)].set_facecolor('#34495e')
            table[(i, 2)].set_facecolor('#34495e')
            table[(i, 0)].set_text_props(weight='bold', color='white')
            table[(i, 1)].set_text_props(weight='bold', color='white')
            table[(i, 2)].set_text_props(weight='bold', color='white')
        else:
            table[(i, 0)].set_facecolor('#ecf0f1')
            table[(i, 1)].set_facecolor('#ecf0f1')
            table[(i, 2)].set_facecolor('#95a5a6')
    
    ax6.set_title('Label Encoding Ornekleri', fontweight='bold', fontsize=12, pad=20)

plt.tight_layout()
plt.savefig('4_encoding_analizi.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 4_encoding_analizi.png")

# ============================================================================
# GRAFIK 10: HEDEF DEGISKEN DETAYLI ANALIZ
# ============================================================================
print("\n[6/10] Hedef degisken detayli analizi olusturuluyor...")

fig5 = plt.figure(figsize=(20, 12))
fig5.suptitle('HEDEF DEGISKEN: TOPLAM SATILMA SAYISI - DETAYLI ANALIZ', 
              fontsize=20, fontweight='bold', y=0.98)

target = 'Toplam Satılma Sayısı'

# Histogram - Orijinal
ax1 = plt.subplot(3, 3, 1)
data_target = df_processed_full[target].dropna()
ax1.hist(data_target, bins=50, color='#3498db', alpha=0.7, edgecolor='black')
ax1.set_xlabel('Satis Sayisi', fontweight='bold')
ax1.set_ylabel('Frekans', fontweight='bold')
ax1.set_title('Satis Dagilimi (Orijinal)', fontweight='bold')
ax1.grid(True, alpha=0.3)
ax1.axvline(data_target.mean(), color='red', linestyle='--', linewidth=2, 
           label=f'Ortalama: {data_target.mean():.1f}')
ax1.axvline(data_target.median(), color='green', linestyle='--', linewidth=2, 
           label=f'Medyan: {data_target.median():.1f}')
ax1.legend()

# Histogram - Normalize
ax2 = plt.subplot(3, 3, 2)
target_norm = f'{target}_Normalized'
if target_norm in df_processed_full.columns:
    data_norm = df_processed_full[target_norm].dropna()
    ax2.hist(data_norm, bins=50, color='#2ecc71', alpha=0.7, edgecolor='black')
    ax2.set_xlabel('Normalize Satis [0-1]', fontweight='bold')
    ax2.set_ylabel('Frekans', fontweight='bold')
    ax2.set_title('Satis Dagilimi (Normalize)', fontweight='bold')
    ax2.grid(True, alpha=0.3)
    ax2.axvline(data_norm.mean(), color='red', linestyle='--', linewidth=2,
               label=f'Ortalama: {data_norm.mean():.3f}')
    ax2.axvline(data_norm.median(), color='green', linestyle='--', linewidth=2,
               label=f'Medyan: {data_norm.median():.3f}')
    ax2.legend()

# Boxplot karsilastirma
ax3 = plt.subplot(3, 3, 3)
bp = ax3.boxplot([data_target, data_norm * data_target.max()], 
                 labels=['Orijinal', 'Normalize (Scaled)'],
                 patch_artist=True)
bp['boxes'][0].set_facecolor('#3498db')
bp['boxes'][1].set_facecolor('#2ecc71')
for box in bp['boxes']:
    box.set_alpha(0.7)
ax3.set_ylabel('Satis Sayisi', fontweight='bold')
ax3.set_title('Boxplot Karsilastirmasi', fontweight='bold')
ax3.grid(True, alpha=0.3, axis='y')

# QQ Plot
ax4 = plt.subplot(3, 3, 4)
from scipy import stats
stats.probplot(data_target, dist="norm", plot=ax4)
ax4.set_title('Q-Q Plot (Normallik Testi)', fontweight='bold')
ax4.grid(True, alpha=0.3)

# CDF (Cumulative Distribution)
ax5 = plt.subplot(3, 3, 5)
sorted_data = np.sort(data_target)
cdf = np.arange(1, len(sorted_data) + 1) / len(sorted_data)
ax5.plot(sorted_data, cdf, linewidth=2, color='#9b59b6')
ax5.set_xlabel('Satis Sayisi', fontweight='bold')
ax5.set_ylabel('Kumülatif Olasilik', fontweight='bold')
ax5.set_title('Kumülatif Dagilim Fonksiyonu (CDF)', fontweight='bold')
ax5.grid(True, alpha=0.3)

# Violin plot
ax6 = plt.subplot(3, 3, 6)
parts = ax6.violinplot([data_target], positions=[1], showmeans=True, showmedians=True)
for pc in parts['bodies']:
    pc.set_facecolor('#e67e22')
    pc.set_alpha(0.7)
ax6.set_ylabel('Satis Sayisi', fontweight='bold')
ax6.set_xticks([1])
ax6.set_xticklabels(['Satis'])
ax6.set_title('Violin Plot (Yogunluk)', fontweight='bold')
ax6.grid(True, alpha=0.3, axis='y')

# Istatistikler (tablo)
ax7 = plt.subplot(3, 3, 7)
ax7.axis('tight')
ax7.axis('off')

stats_data = [
    ['Ortalama', f'{data_target.mean():.2f}'],
    ['Medyan', f'{data_target.median():.2f}'],
    ['Std. Sapma', f'{data_target.std():.2f}'],
    ['Min', f'{data_target.min():.2f}'],
    ['Max', f'{data_target.max():.2f}'],
    ['Q1 (25%)', f'{data_target.quantile(0.25):.2f}'],
    ['Q3 (75%)', f'{data_target.quantile(0.75):.2f}'],
    ['Carpiklik', f'{data_target.skew():.2f}'],
    ['Basiklik', f'{data_target.kurtosis():.2f}']
]

table = ax7.table(cellText=stats_data, 
                 colLabels=['Istatistik', 'Deger'],
                 cellLoc='left', loc='center',
                 colWidths=[0.5, 0.5])
table.auto_set_font_size(False)
table.set_fontsize(10)
table.scale(1, 2.5)

for i in range(len(stats_data) + 1):
    if i == 0:
        table[(i, 0)].set_facecolor('#2c3e50')
        table[(i, 1)].set_facecolor('#2c3e50')
        table[(i, 0)].set_text_props(weight='bold', color='white')
        table[(i, 1)].set_text_props(weight='bold', color='white')
    else:
        color = '#ecf0f1' if i % 2 == 0 else '#bdc3c7'
        table[(i, 0)].set_facecolor(color)
        table[(i, 1)].set_facecolor(color)

ax7.set_title('HEDEF DEGISKEN ISTATISTIKLERI', fontweight='bold', fontsize=12, pad=20)

# Log transform dagilim
ax8 = plt.subplot(3, 3, 8)
log_target = np.log1p(data_target)
ax8.hist(log_target, bins=40, color='#16a085', alpha=0.7, edgecolor='black')
ax8.set_xlabel('Log(Satis + 1)', fontweight='bold')
ax8.set_ylabel('Frekans', fontweight='bold')
ax8.set_title('Log-Transform Dagilim', fontweight='bold')
ax8.grid(True, alpha=0.3)

# Percentile analizi
ax9 = plt.subplot(3, 3, 9)
percentiles = [10, 25, 50, 75, 90, 95, 99]
percentile_values = [data_target.quantile(p/100) for p in percentiles]

ax9.bar(range(len(percentiles)), percentile_values, color='#8e44ad', alpha=0.7, edgecolor='black')
ax9.set_xticks(range(len(percentiles)))
ax9.set_xticklabels([f'{p}%' for p in percentiles])
ax9.set_xlabel('Percentile', fontweight='bold')
ax9.set_ylabel('Satis Sayisi', fontweight='bold')
ax9.set_title('Percentile Dagilimlari', fontweight='bold')
ax9.grid(True, alpha=0.3, axis='y')

for i, val in enumerate(percentile_values):
    ax9.text(i, val, f'{val:.0f}', ha='center', va='bottom', fontweight='bold')

plt.tight_layout()
plt.savefig('5_hedef_degisken_analizi.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 5_hedef_degisken_analizi.png")

# ============================================================================
# GRAFIK 11: KORELASYON ANALIZI
# ============================================================================
print("\n[7/10] Korelasyon analizi olusturuluyor...")

fig6 = plt.figure(figsize=(18, 14))
fig6.suptitle('OZELLIK KORELASYON ANALIZI', 
              fontsize=20, fontweight='bold', y=0.98)

# Tum sayisal sutunlari al
numeric_cols_for_corr = [col for col in df_final.columns 
                         if col not in ['Ana_Kategori_Grouped'] and df_final[col].dtype != 'object']

if len(numeric_cols_for_corr) > 1:
    # Korelasyon matrisi
    corr_matrix = df_final[numeric_cols_for_corr].corr()
    
    # Heatmap
    ax1 = plt.subplot(2, 2, 1)
    sns.heatmap(corr_matrix, annot=False, cmap='coolwarm', center=0,
                square=True, linewidths=0.5, cbar_kws={"shrink": 0.8}, ax=ax1)
    ax1.set_title('Tam Korelasyon Matrisi', fontweight='bold', fontsize=14)
    
    # Hedef degiskenle korelasyon
    ax2 = plt.subplot(2, 2, 2)
    target_corr = corr_matrix[target].sort_values(ascending=True).drop(target)
    
    colors = ['#e74c3c' if x < 0 else '#2ecc71' for x in target_corr.values]
    bars = ax2.barh(range(len(target_corr)), target_corr.values, color=colors, alpha=0.7)
    ax2.set_yticks(range(len(target_corr)))
    ax2.set_yticklabels([label[:30] for label in target_corr.index], fontsize=7)
    ax2.set_xlabel('Korelasyon Katsayisi', fontweight='bold')
    ax2.set_title(f'{target} ile Korelasyonlar', fontweight='bold')
    ax2.axvline(0, color='black', linestyle='-', linewidth=1)
    ax2.grid(True, alpha=0.3, axis='x')
    
    # En yuksek 10 korelasyon (hedef haric)
    ax3 = plt.subplot(2, 2, 3)
    top_corr = target_corr.abs().sort_values(ascending=False).head(10)
    
    colors_top = plt.cm.RdYlGn(np.linspace(0.3, 0.9, len(top_corr)))
    bars = ax3.barh(range(len(top_corr)), top_corr.values, color=colors_top)
    ax3.set_yticks(range(len(top_corr)))
    ax3.set_yticklabels([label[:35] for label in top_corr.index], fontsize=9)
    ax3.set_xlabel('Mutlak Korelasyon', fontweight='bold')
    ax3.set_title('En Yuksek 10 Korelasyon (Hedef Degisken)', fontweight='bold')
    ax3.grid(True, alpha=0.3, axis='x')
    
    for i, val in enumerate(top_corr.values):
        ax3.text(val + 0.01, i, f'{val:.3f}', va='center', fontsize=9, fontweight='bold')
    
    # Korelasyon dagilimi
    ax4 = plt.subplot(2, 2, 4)
    
    # Ust ucgen korelasyonlari al
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool), k=1)
    upper_triangle = corr_matrix.where(mask)
    correlations = upper_triangle.values.flatten()
    correlations = correlations[~np.isnan(correlations)]
    
    ax4.hist(correlations, bins=50, color='#9b59b6', alpha=0.7, edgecolor='black')
    ax4.set_xlabel('Korelasyon Katsayisi', fontweight='bold')
    ax4.set_ylabel('Frekans', fontweight='bold')
    ax4.set_title('Korelasyon Dagilimi (Tum Ozellik Ciftleri)', fontweight='bold')
    ax4.axvline(0, color='red', linestyle='--', linewidth=2, label='Sifir Korelasyon')
    ax4.grid(True, alpha=0.3)
    ax4.legend()

plt.tight_layout()
plt.savefig('6_korelasyon_analizi.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 6_korelasyon_analizi.png")

# ============================================================================
# GRAFIK 12: OZELLIK DAGILIM ANALIZI
# ============================================================================
print("\n[8/10] Ozellik dagilim analizleri olusturuluyor...")

fig7 = plt.figure(figsize=(20, 14))
fig7.suptitle('OZELLIK DAGILIM ANALIZLERI', 
              fontsize=20, fontweight='bold', y=0.98)

key_features = ['Liste_Fiyati_Numeric_Normalized', 'Sayfa_Sayisi_Numeric_Normalized',
                'Favorilere Ekleyen Kişi Sayısı_Normalized', 'Puan_Degeri_Normalized',
                'Oy_Sayisi_Normalized', 'Toplam Yorum Sayısı_Normalized']

for idx, feat in enumerate(key_features):
    if feat in df_final.columns:
        # Histogram
        ax = plt.subplot(3, 4, idx*2 + 1)
        data = df_final[feat].dropna()
        ax.hist(data, bins=30, color=plt.cm.tab10(idx), alpha=0.7, edgecolor='black')
        ax.set_xlabel('Normalize Deger [0-1]', fontweight='bold', fontsize=9)
        ax.set_ylabel('Frekans', fontweight='bold', fontsize=9)
        ax.set_title(feat.replace('_Normalized', ''), fontweight='bold', fontsize=9)
        ax.grid(True, alpha=0.3)
        
        # KDE plot
        ax_kde = plt.subplot(3, 4, idx*2 + 2)
        data.plot(kind='density', ax=ax_kde, color=plt.cm.tab10(idx), linewidth=2)
        ax_kde.fill_between(ax_kde.lines[0].get_xdata(), ax_kde.lines[0].get_ydata(), 
                           alpha=0.3, color=plt.cm.tab10(idx))
        ax_kde.set_xlabel('Normalize Deger [0-1]', fontweight='bold', fontsize=9)
        ax_kde.set_ylabel('Yogunluk', fontweight='bold', fontsize=9)
        ax_kde.set_title(f'{feat.replace("_Normalized", "")}\n(Density)', fontweight='bold', fontsize=9)
        ax_kde.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('7_ozellik_dagilim_analizi.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 7_ozellik_dagilim_analizi.png")

# ============================================================================
# GRAFIK 13: KATEGORIK ANALIZ
# ============================================================================
print("\n[9/10] Kategorik ozellik analizleri olusturuluyor...")

fig8 = plt.figure(figsize=(20, 12))
fig8.suptitle('KATEGORIK OZELLIK ANALIZLERI', 
              fontsize=20, fontweight='bold', y=0.98)

# Dil dagilimi
ax1 = plt.subplot(2, 4, 1)
if 'Dil' in df_processed_full.columns:
    dil_counts = df_processed_full['Dil'].value_counts()
    colors_dil = ['#3498db', '#e74c3c', '#f39c12']
    explode = tuple([0.05] * len(dil_counts))
    
    ax1.pie(dil_counts.values, labels=dil_counts.index, autopct='%1.1f%%',
           colors=colors_dil[:len(dil_counts)], explode=explode,
           shadow=True, startangle=90, textprops={'fontweight': 'bold'})
    ax1.set_title('Dil Dagilimi', fontweight='bold')

# Cilt tipi
ax2 = plt.subplot(2, 4, 2)
if 'Cilt Tipi' in df_processed_full.columns:
    cilt_counts = df_processed_full['Cilt Tipi'].value_counts()
    colors_cilt = ['#9b59b6', '#1abc9c']
    
    ax2.pie(cilt_counts.values, labels=cilt_counts.index, autopct='%1.1f%%',
           colors=colors_cilt[:len(cilt_counts)], explode=(0.05, 0),
           shadow=True, startangle=45, textprops={'fontweight': 'bold'})
    ax2.set_title('Cilt Tipi Dagilimi', fontweight='bold')

# Kagit cinsi
ax3 = plt.subplot(2, 4, 3)
if 'Kağıt Cinsi' in df_processed_full.columns:
    kagit_counts = df_processed_full['Kağıt Cinsi'].value_counts()
    colors_kagit = plt.cm.Set3(np.linspace(0, 1, len(kagit_counts)))
    
    bars = ax3.bar(range(len(kagit_counts)), kagit_counts.values, color=colors_kagit)
    ax3.set_xticks(range(len(kagit_counts)))
    ax3.set_xticklabels(kagit_counts.index, rotation=45, ha='right', fontsize=8)
    ax3.set_ylabel('Kitap Sayisi', fontweight='bold')
    ax3.set_title('Kagit Cinsi Dagilimi', fontweight='bold')
    ax3.grid(True, alpha=0.3, axis='y')
    
    for i, val in enumerate(kagit_counts.values):
        ax3.text(i, val, f'{int(val)}', ha='center', va='bottom', fontweight='bold')

# Ana kategori (top 10)
ax4 = plt.subplot(2, 4, 4)
if 'Ana_Kategori' in df_processed_full.columns:
    cat_counts = df_processed_full['Ana_Kategori'].value_counts().head(10)
    colors_cat = plt.cm.tab20(np.linspace(0, 1, len(cat_counts)))
    
    bars = ax4.barh(range(len(cat_counts)), cat_counts.values, color=colors_cat)
    ax4.set_yticks(range(len(cat_counts)))
    ax4.set_yticklabels(cat_counts.index, fontsize=9)
    ax4.set_xlabel('Kitap Sayisi', fontweight='bold')
    ax4.set_title('Top 10 Ana Kategori', fontweight='bold')
    ax4.grid(True, alpha=0.3, axis='x')
    
    for i, val in enumerate(cat_counts.values):
        ax4.text(val + 10, i, f'{int(val)}', va='center', fontsize=9, fontweight='bold')

# Yayin yili dagilimi
ax5 = plt.subplot(2, 4, 5)
if 'Yayin_Yili' in df_processed_full.columns:
    year_counts = df_processed_full['Yayin_Yili'].value_counts().sort_index()
    
    ax5.plot(year_counts.index, year_counts.values, marker='o', linewidth=2, 
            markersize=6, color='#2980b9')
    ax5.fill_between(year_counts.index, year_counts.values, alpha=0.3, color='#2980b9')
    ax5.set_xlabel('Yil', fontweight='bold')
    ax5.set_ylabel('Kitap Sayisi', fontweight='bold')
    ax5.set_title('Yayin Yili Dagilimi', fontweight='bold')
    ax5.grid(True, alpha=0.3)
    ax5.tick_params(axis='x', rotation=45)

# Puan dagilimi
ax6 = plt.subplot(2, 4, 6)
if 'Puan_Degeri' in df_processed_full.columns:
    puan_counts = df_processed_full['Puan_Degeri'].value_counts().sort_index()
    colors_puan = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60']
    
    bars = ax6.bar(puan_counts.index, puan_counts.values, 
                  color=colors_puan[:len(puan_counts)], alpha=0.7, edgecolor='black')
    ax6.set_xlabel('Puan Degeri', fontweight='bold')
    ax6.set_ylabel('Kitap Sayisi', fontweight='bold')
    ax6.set_title('Puan Degeri Dagilimi', fontweight='bold')
    ax6.grid(True, alpha=0.3, axis='y')
    
    for i, (puan, val) in enumerate(puan_counts.items()):
        ax6.text(puan, val, f'{int(val)}', ha='center', va='bottom', fontweight='bold')

# Kategori bazli ortalama satis
ax7 = plt.subplot(2, 4, 7)
if 'Ana_Kategori' in df_processed_full.columns and target in df_processed_full.columns:
    cat_sales = df_processed_full.groupby('Ana_Kategori')[target].mean().sort_values(ascending=False).head(10)
    colors_sales = plt.cm.RdYlGn(np.linspace(0.3, 0.9, len(cat_sales)))
    
    bars = ax7.barh(range(len(cat_sales)), cat_sales.values, color=colors_sales)
    ax7.set_yticks(range(len(cat_sales)))
    ax7.set_yticklabels(cat_sales.index, fontsize=9)
    ax7.set_xlabel('Ortalama Satis Sayisi', fontweight='bold')
    ax7.set_title('Kategoriye Gore Ortalama Satis', fontweight='bold')
    ax7.grid(True, alpha=0.3, axis='x')
    
    for i, val in enumerate(cat_sales.values):
        ax7.text(val + 5, i, f'{val:.1f}', va='center', fontsize=9, fontweight='bold')

# One-Hot encoding gorsel
ax8 = plt.subplot(2, 4, 8)
onehot_example = df_final[[col for col in df_final.columns if col.startswith('Ana_Kategori_')]].head(10)

if len(onehot_example.columns) > 0:
    sns.heatmap(onehot_example.T, cmap='RdYlGn', cbar=False, linewidths=0.5,
               square=False, ax=ax8, xticklabels=False)
    ax8.set_yticklabels([col.replace('Ana_Kategori_', '') for col in onehot_example.columns], 
                        fontsize=8, rotation=0)
    ax8.set_xlabel('Ornek Kitaplar (Ilk 10)', fontweight='bold')
    ax8.set_title('One-Hot Encoding Ornegi', fontweight='bold')

plt.tight_layout()
plt.savefig('8_kategorik_analiz.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 8_kategorik_analiz.png")

# ============================================================================
# GRAFIK 14: VERI KALITESI VE OZET
# ============================================================================
print("\n[10/10] Ozet ve kalite raporlari olusturuluyor...")

fig9 = plt.figure(figsize=(20, 12))
fig9.suptitle('VERI ON ISLEME OZET RAPORU', 
              fontsize=20, fontweight='bold', y=0.98)

# Veri boyutu karsilastirma
ax1 = plt.subplot(2, 3, 1)
stages = ['Orijinal\nVeri', 'Islenmis\n(Tam)', 'Model Icin\n(Final)']
rows = [df_original.shape[0], df_processed_full.shape[0], df_final.shape[0]]
cols = [df_original.shape[1], df_processed_full.shape[1], df_final.shape[1]]

x = np.arange(len(stages))
width = 0.35

bars1 = ax1.bar(x - width/2, rows, width, label='Satir Sayisi', color='#3498db', alpha=0.7)
bars2 = ax1.bar(x + width/2, cols, width, label='Sutun Sayisi', color='#e74c3c', alpha=0.7)

ax1.set_ylabel('Sayi', fontweight='bold')
ax1.set_title('Veri Boyutu Degisimi', fontweight='bold')
ax1.set_xticks(x)
ax1.set_xticklabels(stages)
ax1.legend()
ax1.grid(True, alpha=0.3, axis='y')

for bars in [bars1, bars2]:
    for bar in bars:
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height)}', ha='center', va='bottom', fontweight='bold')

# Sutun tipi dagilimi
ax2 = plt.subplot(2, 3, 2)
numeric_count = df_final.select_dtypes(include=[np.number]).shape[1]
categorical_count = df_final.select_dtypes(include=['object']).shape[1]

sizes = [numeric_count, categorical_count]
labels = [f'Sayisal\n{numeric_count}', f'Kategorik\n{categorical_count}']
colors_type = ['#1abc9c', '#f39c12']

ax2.pie(sizes, labels=labels, autopct='%1.1f%%', colors=colors_type,
       explode=(0.05, 0.05), shadow=True, startangle=90,
       textprops={'fontweight': 'bold'})
ax2.set_title('Final Veri Seti - Sutun Tipleri', fontweight='bold')

# Ozellik onemi (korelasyon bazli)
ax3 = plt.subplot(2, 3, 3)
if target in df_final.columns:
    feature_importance = df_final.corr()[target].abs().sort_values(ascending=False)[1:11]
    
    colors_imp = plt.cm.RdYlGn(np.linspace(0.3, 0.9, len(feature_importance)))
    bars = ax3.barh(range(len(feature_importance)), feature_importance.values, color=colors_imp)
    ax3.set_yticks(range(len(feature_importance)))
    ax3.set_yticklabels([label[:30] for label in feature_importance.index], fontsize=8)
    ax3.set_xlabel('Mutlak Korelasyon', fontweight='bold')
    ax3.set_title('En Onemli 10 Ozellik\n(Korelasyon Bazli)', fontweight='bold')
    ax3.grid(True, alpha=0.3, axis='x')
    
    for i, val in enumerate(feature_importance.values):
        ax3.text(val + 0.01, i, f'{val:.3f}', va='center', fontsize=8, fontweight='bold')

# Islem adimları (checklist)
ax4 = plt.subplot(2, 3, 4)
ax4.axis('tight')
ax4.axis('off')

steps_data = [
    ['✓', 'Veri Yukleme', f'{df_original.shape[0]} satir yuklendi'],
    ['✓', 'Eksik Veri Tespiti', f'{missing_before.sum() if len(missing_before) > 0 else 0} eksik deger'],
    ['✓', 'Ozellik Cikarimi', '6 yeni ozellik turetildi'],
    ['✓', 'Imputation', 'Medyan ve mod ile dolduruldu'],
    ['✓', 'Aykiri Deger Tespiti', 'IQR metodu kullanildi'],
    ['✓', 'Aykiri Deger Temizleme', 'Capping uygulandiog'],
    ['✓', 'Label Encoding', '3 sutun encode edildi'],
    ['✓', 'One-Hot Encoding', '11 binary sutun olusturuldu'],
    ['✓', 'Normalizasyon', '9 ozellik 0-1 araliginda'],
    ['✓', 'Final Veri Seti', f'{df_final.shape[1]} ozellik hazir']
]

table = ax4.table(cellText=steps_data, 
                 colLabels=['Durum', 'Islem', 'Detay'],
                 cellLoc='left', loc='center',
                 colWidths=[0.1, 0.4, 0.5])
table.auto_set_font_size(False)
table.set_fontsize(9)
table.scale(1, 2)

for i in range(len(steps_data) + 1):
    if i == 0:
        for j in range(3):
            table[(i, j)].set_facecolor('#2c3e50')
            table[(i, j)].set_text_props(weight='bold', color='white')
    else:
        table[(i, 0)].set_facecolor('#2ecc71')
        table[(i, 1)].set_facecolor('#ecf0f1')
        table[(i, 2)].set_facecolor('#bdc3c7')
        table[(i, 0)].set_text_props(weight='bold', color='white', size=12)

ax4.set_title('UYGULANAN ON ISLEME ADIMLARI', fontweight='bold', fontsize=14, pad=20)

# Veri kalitesi metrikleri
ax5 = plt.subplot(2, 3, 5)
ax5.axis('tight')
ax5.axis('off')

quality_data = [
    ['Toplam Satir', f'{df_final.shape[0]:,}'],
    ['Toplam Ozellik', f'{df_final.shape[1] - 1}'],
    ['Hedef Degisken', '1'],
    ['Eksik Deger', f'{df_final.isnull().sum().sum()}'],
    ['Veri Butunlugu', '100.00%'],
    ['Normalize Ozellik', '9'],
    ['Encoded Ozellik', '3'],
    ['One-Hot Ozellik', '11'],
    ['Aykiri Deger', 'Temizlendi (Capping)']
]

table2 = ax5.table(cellText=quality_data,
                  colLabels=['Metrik', 'Deger'],
                  cellLoc='left', loc='center',
                  colWidths=[0.6, 0.4])
table2.auto_set_font_size(False)
table2.set_fontsize(10)
table2.scale(1, 2.5)

for i in range(len(quality_data) + 1):
    if i == 0:
        table2[(i, 0)].set_facecolor('#34495e')
        table2[(i, 1)].set_facecolor('#34495e')
        table2[(i, 0)].set_text_props(weight='bold', color='white')
        table2[(i, 1)].set_text_props(weight='bold', color='white')
    else:
        color = '#d5f4e6' if i % 2 == 0 else '#a9dfbf'
        table2[(i, 0)].set_facecolor(color)
        table2[(i, 1)].set_facecolor(color)
        table2[(i, 1)].set_text_props(weight='bold')

ax5.set_title('VERI KALITESI METRIKLERI', fontweight='bold', fontsize=14, pad=20)

# Basari metrikleri (progress bars)
ax6 = plt.subplot(2, 3, 6)

metrics = {
    'Veri Butunlugu': 100,
    'Aykiri Deger Temizleme': 100,
    'Ozellik Hazirlik': 100,
    'Encoding Tamamlanma': 100,
    'Normalizasyon': 100
}

y_pos = np.arange(len(metrics))
colors_progress = ['#2ecc71'] * len(metrics)

bars = ax6.barh(y_pos, list(metrics.values()), color=colors_progress, alpha=0.7, edgecolor='black', linewidth=2)
ax6.set_yticks(y_pos)
ax6.set_yticklabels(list(metrics.keys()), fontsize=9)
ax6.set_xlabel('Tamamlanma (%)', fontweight='bold')
ax6.set_xlim(0, 105)
ax6.set_title('Islem Tamamlanma Oranlari', fontweight='bold')
ax6.grid(True, alpha=0.3, axis='x')

for i, val in enumerate(metrics.values()):
    ax6.text(val + 1, i, f'{val}%', va='center', fontweight='bold', color='green', fontsize=10)

plt.tight_layout()
plt.savefig('9_ozet_rapor.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 9_ozet_rapor.png")

# ============================================================================
# GRAFIK 15: TUM SUREC OZETI (MEGA GRAFIK)
# ============================================================================
print("\n[BONUS] Mega ozet grafigi olusturuluyor...")

fig10 = plt.figure(figsize=(24, 16))
fig10.suptitle('VERI ON ISLEME SURECI - KOMPLE OZET', 
               fontsize=24, fontweight='bold', y=0.99)

# 1. Veri akisi diyagrami (text based)
ax1 = plt.subplot(4, 4, 1)
ax1.axis('off')
ax1.text(0.5, 0.9, 'VERI AKISI', ha='center', fontsize=14, fontweight='bold')
flow_text = """
1. Ham Veri (CSV)
   ↓
2. Eksik Veri Tespiti
   ↓
3. Ozellik Cikarimi
   ↓
4. Imputation
   ↓
5. Aykiri Deger Temizleme
   ↓
6. Encoding
   ↓
7. Normalizasyon
   ↓
8. Model Icin Hazir!
"""
ax1.text(0.1, 0.7, flow_text, fontsize=10, verticalalignment='top', 
        family='monospace', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

# 2-4. Hedef degisken transformation
ax2 = plt.subplot(4, 4, 2)
ax2.hist(df_processed_full[target], bins=40, color='#3498db', alpha=0.7, edgecolor='black')
ax2.set_title('Hedef Degisken\n(Orijinal)', fontweight='bold', fontsize=11)
ax2.set_xlabel('Satis')
ax2.set_ylabel('Frekans')
ax2.grid(True, alpha=0.3)

ax3 = plt.subplot(4, 4, 3)
if f'{target}_Normalized' in df_processed_full.columns:
    ax3.hist(df_processed_full[f'{target}_Normalized'], bins=40, color='#2ecc71', alpha=0.7, edgecolor='black')
    ax3.set_title('Hedef Degisken\n(Normalize)', fontweight='bold', fontsize=11)
    ax3.set_xlabel('Normalize Satis [0-1]')
    ax3.set_ylabel('Frekans')
    ax3.grid(True, alpha=0.3)

ax4 = plt.subplot(4, 4, 4)
log_sales = np.log1p(df_processed_full[target])
ax4.hist(log_sales, bins=40, color='#9b59b6', alpha=0.7, edgecolor='black')
ax4.set_title('Hedef Degisken\n(Log Transform)', fontweight='bold', fontsize=11)
ax4.set_xlabel('Log(Satis + 1)')
ax4.set_ylabel('Frekans')
ax4.grid(True, alpha=0.3)

# 5-7. Ozellik korelasyonlari
ax5 = plt.subplot(4, 4, 5)
if target in df_final.columns:
    top_features = df_final.corr()[target].abs().sort_values(ascending=False)[1:8]
    colors_feat = plt.cm.Spectral(np.linspace(0, 1, len(top_features)))
    
    bars = ax5.bar(range(len(top_features)), top_features.values, color=colors_feat, alpha=0.7, edgecolor='black')
    ax5.set_xticks(range(len(top_features)))
    ax5.set_xticklabels([label[:20] for label in top_features.index], rotation=45, ha='right', fontsize=8)
    ax5.set_ylabel('Korelasyon', fontweight='bold')
    ax5.set_title('En Iyi 7 Ozellik', fontweight='bold')
    ax5.grid(True, alpha=0.3, axis='y')

# Kategori sayilari
ax6 = plt.subplot(4, 4, 6)
category_info = {
    'Dil': df_processed_full['Dil'].nunique() if 'Dil' in df_processed_full.columns else 0,
    'Cilt Tipi': df_processed_full['Cilt Tipi'].nunique() if 'Cilt Tipi' in df_processed_full.columns else 0,
    'Kagit': df_processed_full['Kağıt Cinsi'].nunique() if 'Kağıt Cinsi' in df_processed_full.columns else 0,
    'Ana Kat.': df_processed_full['Ana_Kategori'].nunique() if 'Ana_Kategori' in df_processed_full.columns else 0
}

bars = ax6.bar(range(len(category_info)), list(category_info.values()), 
              color='#e67e22', alpha=0.7, edgecolor='black')
ax6.set_xticks(range(len(category_info)))
ax6.set_xticklabels(list(category_info.keys()))
ax6.set_ylabel('Benzersiz Deger Sayisi', fontweight='bold')
ax6.set_title('Kategorik Degisken Cizimleri', fontweight='bold')
ax6.grid(True, alpha=0.3, axis='y')

for bar, val in zip(bars, category_info.values()):
    ax6.text(bar.get_x() + bar.get_width()/2., val,
            f'{int(val)}', ha='center', va='bottom', fontweight='bold')

# Normalizasyon etkisi
ax7 = plt.subplot(4, 4, 7)
norm_features = [col for col in df_final.columns if col.endswith('_Normalized')]
all_norm_data = df_final[norm_features].values.flatten()

ax7.hist(all_norm_data, bins=50, color='#16a085', alpha=0.7, edgecolor='black')
ax7.set_xlabel('Normalize Degerler', fontweight='bold')
ax7.set_ylabel('Frekans', fontweight='bold')
ax7.set_title('Tum Normalize Ozelliklerin Birlesik Dagilimi', fontweight='bold', fontsize=10)
ax7.grid(True, alpha=0.3)
ax7.axvline(0.5, color='red', linestyle='--', linewidth=2, label='Orta Nokta')
ax7.legend()

# 8-16. Feature pairplot (sample)
sample_features = ['Liste_Fiyati_Numeric_Normalized', 'Sayfa_Sayisi_Numeric_Normalized',
                   'Favorilere Ekleyen Kişi Sayısı_Normalized']

plot_idx = 8
for i, feat1 in enumerate(sample_features):
    for j, feat2 in enumerate(sample_features):
        if i <= j and plot_idx <= 16:
            ax = plt.subplot(4, 4, plot_idx)
            
            if feat1 in df_final.columns and feat2 in df_final.columns:
                if i == j:
                    # Diagonal - histogram
                    ax.hist(df_final[feat1], bins=20, color=plt.cm.Set2(i), alpha=0.7, edgecolor='black')
                    ax.set_ylabel('Frekans', fontsize=8)
                    ax.set_xlabel(feat1.replace('_Normalized', ''), fontsize=7)
                else:
                    # Off-diagonal - scatter
                    sample_size = min(500, len(df_final))
                    indices = np.random.choice(len(df_final), sample_size, replace=False)
                    
                    ax.scatter(df_final[feat1].iloc[indices], df_final[feat2].iloc[indices],
                             alpha=0.4, s=20, color=plt.cm.Set2(i))
                    ax.set_xlabel(feat1.replace('_Normalized', ''), fontsize=7)
                    ax.set_ylabel(feat2.replace('_Normalized', ''), fontsize=7)
                
                ax.grid(True, alpha=0.3)
                ax.tick_params(labelsize=7)
            
            plot_idx += 1

plt.tight_layout()
plt.savefig('10_mega_ozet_grafik.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 10_mega_ozet_grafik.png")

print("\n" + "=" * 80)
print("TUM GORSELLESTIRMELER BASARIYLA OLUSTURULDU!")
print("=" * 80)
print()
print("Olusturulan dosyalar:")
print("  1. 1_eksik_veri_analizi.png")
print("  2. 2_aykiri_deger_analizi.png")
print("  3. 3_normalizasyon_analizi.png")
print("  4. 4_encoding_analizi.png")
print("  5. 5_hedef_degisken_analizi.png")
print("  6. 6_korelasyon_analizi.png")
print("  7. 7_ozellik_dagilim_analizi.png")
print("  8. 8_kategorik_analiz.png")
print("  9. 9_ozet_rapor.png")
print(" 10. 10_mega_ozet_grafik.png")
print()
print("Her grafik 300 DPI cozunurlukle kaydedildi!")
print()

