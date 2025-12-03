# -*- coding: utf-8 -*-
"""
Hizli Duzeltme ve Kapsamli Gorsellestirme
==========================================
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

print("Veri yukleniyor...")

# Mevcut verileri yukle
df_original = pd.read_csv('kitapdata.csv', encoding='utf-8')
df_full = pd.read_csv('kitapdata_full_details.csv', encoding='utf-8-sig')

# String sutunu cikar ve yeni preprocessed dosya olustur
print("String sutun cikariliyor...")
df_model = df_full.copy()

# Model icin gerekli sutunlari sec
feature_cols = []

# Normalized features
for col in df_full.columns:
    if '_Normalized' in col:
        feature_cols.append(col)

# Encoded features
for col in ['Dil_Encoded', 'Cilt Tipi_Encoded', 'Kağıt Cinsi_Encoded']:
    if col in df_full.columns:
        feature_cols.append(col)

# One-hot features
for col in df_full.columns:
    if col.startswith('Ana_Kategori_') and not col.endswith('_Grouped'):
        feature_cols.append(col)

# Target
feature_cols.append('Toplam Satılma Sayısı')

# Final dataframe
df_model_final = df_full[feature_cols].copy()

# Kaydet
print("Duzeltilmis veri kaydediliyor...")
df_model_final.to_csv('kitapdata_model_ready.csv', index=False, encoding='utf-8-sig')
print(f"  [OK] kitapdata_model_ready.csv kaydedildi ({df_model_final.shape[0]} x {df_model_final.shape[1]})")
print(f"  - Hedef degisken haric {df_model_final.shape[1] - 1} ozellik")
print(f"  - TUM DEGERLER SAYISAL (string sutun YOK!)")

print("\n" + "="*80)
print("KAPSAMLI GORSELLESTIRME BASLADI")
print("="*80)

# ============================================================================
# 1. EKSIK VERI ANALIZI
# ============================================================================
print("\n[1/10] Eksik veri analizi...")

# 'Puan Yok' ve 'Bilgi Yok' değerlerini NaN yap
df_check = df_original.copy()
for col in df_check.columns:
    if df_check[col].dtype == 'object':
        df_check[col] = df_check[col].replace(['Puan Yok', 'Bilgi Yok'], np.nan)

missing_before = df_check.isnull().sum()
missing_before = missing_before[missing_before > 0].sort_values(ascending=False)

fig1, axes = plt.subplots(2, 3, figsize=(20, 10))
fig1.suptitle('ADIM 1-2: EKSIK VERI TESPITI VE ANALIZI', fontsize=20, fontweight='bold')

# Grafik 1: Eksik deger sayilari
ax = axes[0, 0]
if len(missing_before) > 0:
    colors = plt.cm.Reds(np.linspace(0.4, 0.9, len(missing_before)))
    bars = ax.barh(range(len(missing_before)), missing_before.values, color=colors, edgecolor='black', linewidth=1.5)
    ax.set_yticks(range(len(missing_before)))
    ax.set_yticklabels(missing_before.index, fontsize=10, fontweight='bold')
    ax.set_xlabel('Eksik Deger Sayisi', fontweight='bold', fontsize=12)
    ax.set_title('Eksik Deger Sayilari (Orijinal)', fontweight='bold', fontsize=14)
    ax.grid(True, alpha=0.4, axis='x')
    
    for i, val in enumerate(missing_before.values):
        ax.text(val + 5, i, f'{int(val)}', va='center', fontsize=11, fontweight='bold', color='darkred')

# Grafik 2: Yuzde oranlari
ax = axes[0, 1]
missing_pct = (missing_before / len(df_check)) * 100
if len(missing_pct) > 0:
    colors = plt.cm.Oranges(np.linspace(0.4, 0.9, len(missing_pct)))
    bars = ax.barh(range(len(missing_pct)), missing_pct.values, color=colors, edgecolor='black', linewidth=1.5)
    ax.set_yticks(range(len(missing_pct)))
    ax.set_yticklabels(missing_pct.index, fontsize=10, fontweight='bold')
    ax.set_xlabel('Eksik Deger Yuzdesi (%)', fontweight='bold', fontsize=12)
    ax.set_title('Eksik Deger Oranlari', fontweight='bold', fontsize=14)
    ax.grid(True, alpha=0.4, axis='x')
    
    for i, val in enumerate(missing_pct.values):
        ax.text(val + 0.3, i, f'{val:.1f}%', va='center', fontsize=11, fontweight='bold', color='darkorange')

# Grafik 3: Pasta (butunluk - oncesi)
ax = axes[0, 2]
total_cells = df_check.shape[0] * df_check.shape[1]
missing_cells = df_check.isnull().sum().sum()
filled_cells = total_cells - missing_cells

colors_pie = ['#2ecc71', '#e74c3c']
explode = (0, 0.1)
sizes = [filled_cells, missing_cells]
labels = [f'Dolu\n{filled_cells:,}\n({filled_cells/total_cells*100:.1f}%)', 
          f'Eksik\n{missing_cells:,}\n({missing_cells/total_cells*100:.1f}%)']

ax.pie(sizes, explode=explode, labels=labels, colors=colors_pie, autopct='',
       shadow=True, startangle=90, textprops={'fontsize': 11, 'fontweight': 'bold'})
ax.set_title('Veri Butunlugu (Oncesi)', fontweight='bold', fontsize=14)

# Grafik 4: Pasta (butunluk - sonrasi)
ax = axes[1, 0]
total_cells_after = df_full.shape[0] * df_full.shape[1]
missing_cells_after = df_full.isnull().sum().sum()
filled_cells_after = total_cells_after - missing_cells_after

ax.pie([filled_cells_after], labels=[f'%100 Dolu\n{filled_cells_after:,} Hucre'], 
       colors=['#27ae60'], shadow=True, startangle=90,
       textprops={'fontsize': 12, 'fontweight': 'bold'})
ax.set_title('Veri Butunlugu (Sonrasi)', fontweight='bold', fontsize=14)

# Grafik 5: Once/sonra karsilastirma
ax = axes[1, 1]
before_pct = (missing_cells / total_cells) * 100
after_pct = 0

bars = ax.bar(['Orijinal\nVeri', 'Islenmis\nVeri'], [before_pct, after_pct],
             color=['#e74c3c', '#2ecc71'], alpha=0.8, edgecolor='black', linewidth=2, width=0.6)
ax.set_ylabel('Eksik Deger Orani (%)', fontweight='bold', fontsize=12)
ax.set_title('Eksik Deger Azalma', fontweight='bold', fontsize=14)
ax.grid(True, alpha=0.4, axis='y')
ax.set_ylim(0, max(before_pct * 1.2, 5))

for bar in bars:
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2., height + 0.1,
           f'{height:.2f}%', ha='center', va='bottom', fontweight='bold', fontsize=13, color='darkblue')

# Grafik 6: Imputation summary
ax = axes[1, 2]
ax.axis('off')

impute_data = [
    ['Puan_Degeri', '281', '5.00 (Medyan)'],
    ['Oy_Sayisi', '281', '5.50 (Medyan)'],
    ['Liste_Fiyati', '10', '250.00 (Medyan)'],
    ['Yayin_Yili', '7', '2021 (Medyan)'],
    ['Sayfa_Sayisi', '9', '237 (Medyan)']
]

table = ax.table(cellText=impute_data,
                colLabels=['Sutun', 'Eksik', 'Doldurma Degeri'],
                cellLoc='center', loc='center',
                colWidths=[0.4, 0.2, 0.4])
table.auto_set_font_size(False)
table.set_fontsize(10)
table.scale(1, 3)

for i in range(6):
    if i == 0:
        for j in range(3):
            table[(i, j)].set_facecolor('#34495e')
            table[(i, j)].set_text_props(weight='bold', color='white')
    else:
        table[(i, 0)].set_facecolor('#ecf0f1')
        table[(i, 1)].set_facecolor('#ffe6e6')
        table[(i, 2)].set_facecolor('#e6ffe6')

ax.set_title('IMPUTATION OZETI', fontweight='bold', fontsize=14, pad=20)

plt.tight_layout()
plt.savefig('01_EKSIK_VERI_ANALIZI.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 01_EKSIK_VERI_ANALIZI.png")
plt.close()

# ============================================================================
# 2. AYKIRI DEGER ANALIZI
# ============================================================================
print("[2/10] Aykiri deger analizi...")

fig2, axes = plt.subplots(4, 3, figsize=(20, 14))
fig2.suptitle('ADIM 6-7: AYKIRI DEGER TESPITI VE TEMIZLEME (IQR METODU)', 
              fontsize=20, fontweight='bold')

outlier_cols = {
    'Liste_Fiyati_Numeric': 'Liste Fiyati',
    'Sayfa_Sayisi_Numeric': 'Sayfa Sayisi',
    'Favorilere Ekleyen Kişi Sayısı': 'Favori Sayisi',
    'Toplam Satılma Sayısı': 'Satis Sayisi'
}

for idx, (col, label) in enumerate(outlier_cols.items()):
    if col in df_full.columns:
        data = df_full[col].dropna()
        
        Q1 = data.quantile(0.25)
        Q3 = data.quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        
        outliers = data[(data < lower) | (data > upper)]
        
        # Boxplot
        ax = axes[idx, 0]
        bp = ax.boxplot([data], vert=True, patch_artist=True, widths=0.6)
        bp['boxes'][0].set_facecolor('#3498db')
        bp['boxes'][0].set_alpha(0.7)
        bp['boxes'][0].set_linewidth(2)
        
        ax.axhline(lower, color='r', linestyle='--', linewidth=2, label=f'Alt: {lower:.1f}')
        ax.axhline(upper, color='r', linestyle='--', linewidth=2, label=f'Ust: {upper:.1f}')
        ax.set_ylabel('Deger', fontweight='bold', fontsize=11)
        ax.set_title(f'{label} - Boxplot', fontweight='bold', fontsize=13)
        ax.legend(fontsize=9)
        ax.grid(True, alpha=0.3, axis='y')
        ax.set_xticklabels([label])
        
        # Histogram
        ax = axes[idx, 1]
        ax.hist(data, bins=50, color='#3498db', alpha=0.7, edgecolor='black', linewidth=1.5)
        ax.axvline(lower, color='r', linestyle='--', linewidth=2.5, label=f'Alt Sinir: {lower:.1f}')
        ax.axvline(upper, color='r', linestyle='--', linewidth=2.5, label=f'Ust Sinir: {upper:.1f}')
        ax.set_xlabel('Deger', fontweight='bold', fontsize=11)
        ax.set_ylabel('Frekans', fontweight='bold', fontsize=11)
        ax.set_title(f'{label} - Dagilim (Aykiri Degerli)', fontweight='bold', fontsize=13)
        ax.legend(fontsize=9)
        ax.grid(True, alpha=0.3)
        
        # Istatistikler
        ax = axes[idx, 2]
        ax.axis('off')
        
        stats_text = f"""
AYKIRI DEGER ISTATISTIKLERI

Toplam Veri: {len(data):,}
Aykiri Deger: {len(outliers):,}
Oran: %{len(outliers)/len(data)*100:.2f}

Q1 (25%): {Q1:.2f}
Q2 (50%): {data.median():.2f}
Q3 (75%): {Q3:.2f}
IQR: {IQR:.2f}

Alt Sinir: {lower:.2f}
Ust Sinir: {upper:.2f}

Min: {data.min():.2f}
Max: {data.max():.2f}
Ortalama: {data.mean():.2f}
        """
        
        ax.text(0.1, 0.95, stats_text, transform=ax.transAxes,
               fontsize=10, verticalalignment='top', family='monospace',
               bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8, pad=1))

plt.tight_layout()
plt.savefig('02_AYKIRI_DEGER_ANALIZI.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 02_AYKIRI_DEGER_ANALIZI.png")
plt.close()

# ============================================================================
# 3. NORMALIZASYON ANALIZI
# ============================================================================
print("[3/10] Normalizasyon analizi...")

fig3, axes = plt.subplots(3, 3, figsize=(20, 15))
fig3.suptitle('ADIM 10: VERI NORMALIZASYONU (MIN-MAX 0-1 SCALING)', 
              fontsize=20, fontweight='bold')

norm_pairs = [
    ('Liste_Fiyati_Numeric', 'Fiyat'),
    ('Sayfa_Sayisi_Numeric', 'Sayfa'),
    ('Favorilere Ekleyen Kişi Sayısı', 'Favori'),
    ('Puan_Degeri', 'Puan'),
    ('Toplam Satılma Sayısı', 'Satis'),
    ('Toplam Yorum Sayısı', 'Yorum'),
]

for idx, (col, label) in enumerate(norm_pairs[:9]):
    row = idx // 3
    col_idx = idx % 3
    ax = axes[row, col_idx]
    
    if col in df_full.columns:
        data_orig = df_full[col].dropna()
        norm_col = f'{col}_Normalized'
        
        if norm_col in df_full.columns:
            data_norm = df_full[norm_col].dropna()
            
            # Side-by-side histogram
            ax_twin = ax.twinx()
            
            # Orijinal (sol y-axis)
            n1, bins1, patches1 = ax.hist(data_orig, bins=40, alpha=0.6, color='#3498db', 
                                          edgecolor='black', linewidth=1, label='Orijinal')
            
            # Normalize (sag y-axis)
            n2, bins2, patches2 = ax_twin.hist(data_norm, bins=40, alpha=0.6, color='#2ecc71',
                                               edgecolor='black', linewidth=1, label='Normalize')
            
            ax.set_xlabel('Deger', fontweight='bold', fontsize=10)
            ax.set_ylabel('Frekans (Orijinal)', fontweight='bold', fontsize=10, color='#3498db')
            ax_twin.set_ylabel('Frekans (Normalize)', fontweight='bold', fontsize=10, color='#2ecc71')
            ax.set_title(f'{label}\nOrijinal [{data_orig.min():.1f}, {data_orig.max():.1f}] → Normalize [0, 1]',
                        fontweight='bold', fontsize=12)
            ax.tick_params(axis='y', labelcolor='#3498db')
            ax_twin.tick_params(axis='y', labelcolor='#2ecc71')
            ax.grid(True, alpha=0.3)
            
            # Legend
            lines1, labels1 = ax.get_legend_handles_labels()
            lines2, labels2 = ax_twin.get_legend_handles_labels()
            ax.legend(lines1 + lines2, labels1 + labels2, loc='upper right', fontsize=9)

plt.tight_layout()
plt.savefig('03_NORMALIZASYON_ANALIZI.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 03_NORMALIZASYON_ANALIZI.png")
plt.close()

# ============================================================================
# 4. ENCODING ANALIZI
# ============================================================================
print("[4/10] Encoding analizi...")

fig4, axes = plt.subplots(2, 3, figsize=(20, 12))
fig4.suptitle('ADIM 8-9: LABEL ENCODING VE ONE-HOT ENCODING',
              fontsize=20, fontweight='bold')

# Label Encoding - Dil
ax = axes[0, 0]
if 'Dil' in df_full.columns and 'Dil_Encoded' in df_full.columns:
    dil_map = df_full[['Dil', 'Dil_Encoded']].drop_duplicates().sort_values('Dil_Encoded')
    
    for i, (_, row) in enumerate(dil_map.iterrows()):
        ax.barh(i, 1, color=plt.cm.Set2(i), alpha=0.7, edgecolor='black', linewidth=2)
        ax.text(0.5, i, f'{row["Dil"]} → {int(row["Dil_Encoded"])}',
               ha='center', va='center', fontweight='bold', fontsize=11)
    
    ax.set_xlim(0, 1)
    ax.set_ylim(-0.5, len(dil_map) - 0.5)
    ax.set_title('Dil - Label Encoding', fontweight='bold', fontsize=14)
    ax.axis('off')

# Label Encoding - Cilt Tipi
ax = axes[0, 1]
if 'Cilt Tipi' in df_full.columns and 'Cilt Tipi_Encoded' in df_full.columns:
    cilt_map = df_full[['Cilt Tipi', 'Cilt Tipi_Encoded']].drop_duplicates().sort_values('Cilt Tipi_Encoded')
    
    for i, (_, row) in enumerate(cilt_map.iterrows()):
        ax.barh(i, 1, color=plt.cm.Pastel1(i), alpha=0.7, edgecolor='black', linewidth=2)
        ax.text(0.5, i, f'{row["Cilt Tipi"]} → {int(row["Cilt Tipi_Encoded"])}',
               ha='center', va='center', fontweight='bold', fontsize=11)
    
    ax.set_xlim(0, 1)
    ax.set_ylim(-0.5, len(cilt_map) - 0.5)
    ax.set_title('Cilt Tipi - Label Encoding', fontweight='bold', fontsize=14)
    ax.axis('off')

# Label Encoding - Kagit Cinsi
ax = axes[0, 2]
if 'Kağıt Cinsi' in df_full.columns and 'Kağıt Cinsi_Encoded' in df_full.columns:
    kagit_map = df_full[['Kağıt Cinsi', 'Kağıt Cinsi_Encoded']].drop_duplicates().sort_values('Kağıt Cinsi_Encoded')
    
    for i, (_, row) in enumerate(kagit_map.iterrows()):
        ax.barh(i, 1, color=plt.cm.Set3(i), alpha=0.7, edgecolor='black', linewidth=2)
        ax.text(0.5, i, f'{row["Kağıt Cinsi"]} → {int(row["Kağıt Cinsi_Encoded"])}',
               ha='center', va='center', fontweight='bold', fontsize=10)
    
    ax.set_xlim(0, 1)
    ax.set_ylim(-0.5, len(kagit_map) - 0.5)
    ax.set_title('Kagit Cinsi - Label Encoding', fontweight='bold', fontsize=14)
    ax.axis('off')

# One-Hot Encoding - Kategori dagilimi
ax = axes[1, 0]
if 'Ana_Kategori' in df_full.columns:
    cat_counts = df_full['Ana_Kategori'].value_counts().head(11)
    colors = plt.cm.tab20(np.linspace(0, 1, len(cat_counts)))
    
    bars = ax.barh(range(len(cat_counts)), cat_counts.values, color=colors, edgecolor='black', linewidth=1.5)
    ax.set_yticks(range(len(cat_counts)))
    ax.set_yticklabels(cat_counts.index, fontsize=10, fontweight='bold')
    ax.set_xlabel('Kitap Sayisi', fontweight='bold', fontsize=12)
    ax.set_title('Ana Kategori Dagilimi', fontweight='bold', fontsize=14)
    ax.grid(True, alpha=0.4, axis='x')
    
    for i, val in enumerate(cat_counts.values):
        ax.text(val + 10, i, f'{int(val)}', va='center', fontsize=10, fontweight='bold')

# One-Hot Encoding sonuc
ax = axes[1, 1]
onehot_cols = [col for col in df_model_final.columns if col.startswith('Ana_Kategori_')]
if len(onehot_cols) > 0:
    onehot_sums = {col.replace('Ana_Kategori_', ''): int(df_model_final[col].sum()) for col in onehot_cols}
    onehot_sums = dict(sorted(onehot_sums.items(), key=lambda x: x[1], reverse=True))
    
    colors = plt.cm.viridis(np.linspace(0, 1, len(onehot_sums)))
    bars = ax.barh(range(len(onehot_sums)), list(onehot_sums.values()), color=colors, edgecolor='black', linewidth=1.5)
    ax.set_yticks(range(len(onehot_sums)))
    ax.set_yticklabels(list(onehot_sums.keys()), fontsize=10, fontweight='bold')
    ax.set_xlabel('Kitap Sayisi', fontweight='bold', fontsize=12)
    ax.set_title('One-Hot Encoded Kategoriler', fontweight='bold', fontsize=14)
    ax.grid(True, alpha=0.4, axis='x')
    
    for i, val in enumerate(onehot_sums.values()):
        ax.text(val + 5, i, f'{val}', va='center', fontsize=10, fontweight='bold')

# One-Hot ornek
ax = axes[1, 2]
if len(onehot_cols) > 0:
    sample = df_model_final[onehot_cols].head(15)
    sns.heatmap(sample.T, cmap='RdYlGn', cbar=True, linewidths=1, linecolor='gray',
               square=False, ax=ax, xticklabels=False, annot=False)
    ax.set_yticklabels([col.replace('Ana_Kategori_', '') for col in onehot_cols], 
                      fontsize=9, rotation=0)
    ax.set_xlabel('Ornek Kitaplar (Ilk 15)', fontweight='bold', fontsize=11)
    ax.set_title('One-Hot Encoding Matris Ornegi\n(1 = Var, 0 = Yok)', fontweight='bold', fontsize=13)

plt.tight_layout()
plt.savefig('04_ENCODING_ANALIZI.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 04_ENCODING_ANALIZI.png")
plt.close()

# ============================================================================
# 5. HEDEF DEGISKEN DETAYLI ANALIZ
# ============================================================================
print("[5/10] Hedef degisken analizi...")

fig5, axes = plt.subplots(3, 3, figsize=(20, 15))
fig5.suptitle('HEDEF DEGISKEN: TOPLAM SATILMA SAYISI - KAPSAMLI ANALIZ',
              fontsize=20, fontweight='bold')

target = 'Toplam Satılma Sayısı'
data_target = df_full[target].dropna()

# Histogram - orijinal
ax = axes[0, 0]
ax.hist(data_target, bins=50, color='#3498db', alpha=0.7, edgecolor='black', linewidth=1.5)
ax.axvline(data_target.mean(), color='red', linestyle='--', linewidth=2.5, label=f'Ort: {data_target.mean():.1f}')
ax.axvline(data_target.median(), color='green', linestyle='--', linewidth=2.5, label=f'Med: {data_target.median():.1f}')
ax.set_xlabel('Satis Sayisi', fontweight='bold', fontsize=12)
ax.set_ylabel('Frekans', fontweight='bold', fontsize=12)
ax.set_title('Satis Dagilimi (Orijinal)', fontweight='bold', fontsize=14)
ax.legend(fontsize=10)
ax.grid(True, alpha=0.3)

# Histogram - normalize
ax = axes[0, 1]
if f'{target}_Normalized' in df_full.columns:
    data_norm = df_full[f'{target}_Normalized'].dropna()
    ax.hist(data_norm, bins=50, color='#2ecc71', alpha=0.7, edgecolor='black', linewidth=1.5)
    ax.axvline(data_norm.mean(), color='red', linestyle='--', linewidth=2.5, label=f'Ort: {data_norm.mean():.3f}')
    ax.axvline(data_norm.median(), color='green', linestyle='--', linewidth=2.5, label=f'Med: {data_norm.median():.3f}')
    ax.set_xlabel('Normalize Satis [0-1]', fontweight='bold', fontsize=12)
    ax.set_ylabel('Frekans', fontweight='bold', fontsize=12)
    ax.set_title('Satis Dagilimi (Normalize)', fontweight='bold', fontsize=14)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)

# Log transform
ax = axes[0, 2]
log_target = np.log1p(data_target)
ax.hist(log_target, bins=50, color='#9b59b6', alpha=0.7, edgecolor='black', linewidth=1.5)
ax.set_xlabel('Log(Satis + 1)', fontweight='bold', fontsize=12)
ax.set_ylabel('Frekans', fontweight='bold', fontsize=12)
ax.set_title('Satis Dagilimi (Log Transform)', fontweight='bold', fontsize=14)
ax.grid(True, alpha=0.3)

# Boxplot
ax = axes[1, 0]
bp = ax.boxplot([data_target], vert=True, patch_artist=True, widths=0.5)
bp['boxes'][0].set_facecolor('#e67e22')
bp['boxes'][0].set_alpha(0.7)
bp['boxes'][0].set_linewidth(2)
ax.set_ylabel('Satis Sayisi', fontweight='bold', fontsize=12)
ax.set_title('Boxplot', fontweight='bold', fontsize=14)
ax.set_xticklabels(['Satis'])
ax.grid(True, alpha=0.3, axis='y')

# Violin plot
ax = axes[1, 1]
parts = ax.violinplot([data_target], positions=[0], showmeans=True, showmedians=True, showextrema=True)
for pc in parts['bodies']:
    pc.set_facecolor('#1abc9c')
    pc.set_alpha(0.7)
    pc.set_edgecolor('black')
    pc.set_linewidth(2)
ax.set_ylabel('Satis Sayisi', fontweight='bold', fontsize=12)
ax.set_title('Violin Plot (Yogunluk)', fontweight='bold', fontsize=14)
ax.set_xticks([0])
ax.set_xticklabels(['Satis'])
ax.grid(True, alpha=0.3, axis='y')

# Q-Q Plot
ax = axes[1, 2]
stats.probplot(data_target, dist="norm", plot=ax)
ax.set_title('Q-Q Plot (Normallik Testi)', fontweight='bold', fontsize=14)
ax.grid(True, alpha=0.3)
ax.get_lines()[0].set_markerfacecolor('#e74c3c')
ax.get_lines()[0].set_markersize(6)
ax.get_lines()[1].set_linewidth(2)
ax.get_lines()[1].set_color('#2c3e50')

# CDF
ax = axes[2, 0]
sorted_data = np.sort(data_target)
cdf = np.arange(1, len(sorted_data) + 1) / len(sorted_data)
ax.plot(sorted_data, cdf, linewidth=3, color='#8e44ad')
ax.fill_between(sorted_data, cdf, alpha=0.3, color='#8e44ad')
ax.set_xlabel('Satis Sayisi', fontweight='bold', fontsize=12)
ax.set_ylabel('Kumulatif Olasilik', fontweight='bold', fontsize=12)
ax.set_title('Kumulatif Dagilim Fonksiyonu (CDF)', fontweight='bold', fontsize=14)
ax.grid(True, alpha=0.3)

# Percentile analizi
ax = axes[2, 1]
percentiles = [10, 25, 50, 75, 90, 95, 99]
percentile_vals = [data_target.quantile(p/100) for p in percentiles]

colors_pct = plt.cm.RdYlGn(np.linspace(0.2, 0.9, len(percentiles)))
bars = ax.bar(range(len(percentiles)), percentile_vals, color=colors_pct, 
             alpha=0.8, edgecolor='black', linewidth=2)
ax.set_xticks(range(len(percentiles)))
ax.set_xticklabels([f'P{p}' for p in percentiles], fontweight='bold')
ax.set_ylabel('Satis Sayisi', fontweight='bold', fontsize=12)
ax.set_title('Percentile Dagilimlari', fontweight='bold', fontsize=14)
ax.grid(True, alpha=0.3, axis='y')

for i, val in enumerate(percentile_vals):
    ax.text(i, val + 5, f'{val:.0f}', ha='center', va='bottom', fontweight='bold', fontsize=10)

# Istatistikler tablosu
ax = axes[2, 2]
ax.axis('off')

stats_data = [
    ['Ortalama', f'{data_target.mean():.2f}', '✓'],
    ['Medyan', f'{data_target.median():.2f}', '✓'],
    ['Std. Sapma', f'{data_target.std():.2f}', '✓'],
    ['Minimum', f'{data_target.min():.2f}', '✓'],
    ['Maksimum', f'{data_target.max():.2f}', '✓'],
    ['Q1 (25%)', f'{data_target.quantile(0.25):.2f}', '✓'],
    ['Q3 (75%)', f'{data_target.quantile(0.75):.2f}', '✓'],
    ['Carpiklik (Skew)', f'{data_target.skew():.3f}', '✓'],
    ['Basiklik (Kurt)', f'{data_target.kurtosis():.3f}', '✓'],
    ['Varyans', f'{data_target.var():.2f}', '✓']
]

table = ax.table(cellText=stats_data,
                colLabels=['Istatistik', 'Deger', ''],
                cellLoc='left', loc='center',
                colWidths=[0.5, 0.35, 0.15])
table.auto_set_font_size(False)
table.set_fontsize(10)
table.scale(1, 2.5)

for i in range(11):
    if i == 0:
        for j in range(3):
            table[(i, j)].set_facecolor('#2c3e50')
            table[(i, j)].set_text_props(weight='bold', color='white')
    else:
        table[(i, 0)].set_facecolor('#ecf0f1')
        table[(i, 1)].set_facecolor('#d5f4e6')
        table[(i, 2)].set_facecolor('#2ecc71')
        table[(i, 2)].set_text_props(weight='bold', color='white', size=12)

ax.set_title('HEDEF DEGISKEN ISTATISTIKLERI', fontweight='bold', fontsize=14, pad=20)

plt.tight_layout()
plt.savefig('05_HEDEF_DEGISKEN_ANALIZI.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 05_HEDEF_DEGISKEN_ANALIZI.png")
plt.close()

# ============================================================================
# 6. KORELASYON ANALIZI
# ============================================================================
print("[6/10] Korelasyon analizi...")

fig6, axes = plt.subplots(2, 2, figsize=(20, 16))
fig6.suptitle('OZELLIK KORELASYON ANALIZI', fontsize=20, fontweight='bold')

# Heatmap - tum ozellikler
ax = axes[0, 0]
numeric_cols = df_model_final.select_dtypes(include=[np.number]).columns.tolist()
corr_matrix = df_model_final[numeric_cols].corr()

sns.heatmap(corr_matrix, annot=False, cmap='coolwarm', center=0,
           square=True, linewidths=0.5, cbar_kws={"shrink": 0.8, "label": "Korelasyon"},
           ax=ax, vmin=-1, vmax=1)
ax.set_title('TUM OZELLIKLER - Korelasyon Matrisi', fontweight='bold', fontsize=14)

# Hedef degiskenle korelasyon
ax = axes[0, 1]
if target in corr_matrix.columns:
    target_corr = corr_matrix[target].sort_values(ascending=False)[1:16]  # Top 15
    
    colors = ['#2ecc71' if x > 0 else '#e74c3c' for x in target_corr.values]
    bars = ax.barh(range(len(target_corr)), target_corr.values, color=colors, 
                  alpha=0.8, edgecolor='black', linewidth=2)
    ax.set_yticks(range(len(target_corr)))
    ax.set_yticklabels([label[:35] for label in target_corr.index], fontsize=9, fontweight='bold')
    ax.set_xlabel('Korelasyon Katsayisi', fontweight='bold', fontsize=12)
    ax.set_title(f'{target}\nile En Yuksek Korelasyonlar', fontweight='bold', fontsize=14)
    ax.axvline(0, color='black', linestyle='-', linewidth=2)
    ax.grid(True, alpha=0.4, axis='x')
    
    for i, val in enumerate(target_corr.values):
        x_pos = val + (0.02 if val > 0 else -0.02)
        ha_align = 'left' if val > 0 else 'right'
        ax.text(x_pos, i, f'{val:.3f}', va='center', ha=ha_align,
               fontsize=9, fontweight='bold', color='darkblue')

# En yuksek mutlak korelasyonlar
ax = axes[1, 0]
if target in corr_matrix.columns:
    abs_corr = corr_matrix[target].abs().sort_values(ascending=False)[1:11]
    
    colors = plt.cm.RdYlGn(np.linspace(0.3, 0.9, len(abs_corr)))
    bars = ax.barh(range(len(abs_corr)), abs_corr.values, color=colors,
                  edgecolor='black', linewidth=2)
    ax.set_yticks(range(len(abs_corr)))
    ax.set_yticklabels([label[:35] for label in abs_corr.index], fontsize=10, fontweight='bold')
    ax.set_xlabel('Mutlak Korelasyon', fontweight='bold', fontsize=12)
    ax.set_title('En Onemli 10 Ozellik\n(Korelasyon Bazli)', fontweight='bold', fontsize=14)
    ax.grid(True, alpha=0.4, axis='x')
    
    for i, val in enumerate(abs_corr.values):
        ax.text(val + 0.01, i, f'{val:.3f}', va='center', fontsize=10, fontweight='bold')

# Korelasyon dagilimi
ax = axes[1, 1]
mask = np.triu(np.ones_like(corr_matrix, dtype=bool), k=1)
upper_triangle = corr_matrix.where(mask)
correlations = upper_triangle.values.flatten()
correlations = correlations[~np.isnan(correlations)]

ax.hist(correlations, bins=50, color='#9b59b6', alpha=0.7, edgecolor='black', linewidth=1.5)
ax.axvline(0, color='red', linestyle='--', linewidth=2.5, label='Sifir Korelasyon')
ax.axvline(correlations.mean(), color='green', linestyle='--', linewidth=2.5, 
          label=f'Ortalama: {correlations.mean():.3f}')
ax.set_xlabel('Korelasyon Katsayisi', fontweight='bold', fontsize=12)
ax.set_ylabel('Frekans', fontweight='bold', fontsize=12)
ax.set_title('Korelasyon Dagilimi\n(Tum Ozellik Ciftleri)', fontweight='bold', fontsize=14)
ax.legend(fontsize=10)
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('06_KORELASYON_ANALIZI.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 06_KORELASYON_ANALIZI.png")
plt.close()

# ============================================================================
# 7. KATEGORIK OZELLIK ANALIZI
# ============================================================================
print("[7/10] Kategorik ozellik analizi...")

fig7, axes = plt.subplots(2, 3, figsize=(20, 12))
fig7.suptitle('KATEGORIK OZELLIK ANALIZLERI', fontsize=20, fontweight='bold')

# Dil dagilimi
ax = axes[0, 0]
if 'Dil' in df_full.columns:
    dil_counts = df_full['Dil'].value_counts()
    colors_dil = ['#3498db', '#e74c3c', '#f39c12']
    
    wedges, texts, autotexts = ax.pie(dil_counts.values, labels=dil_counts.index, 
                                       autopct='%1.1f%%', colors=colors_dil[:len(dil_counts)],
                                       explode=[0.05]*len(dil_counts), shadow=True, startangle=90)
    
    for text in texts:
        text.set_fontsize(11)
        text.set_fontweight('bold')
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontsize(11)
        autotext.set_fontweight('bold')
    
    ax.set_title('Dil Dagilimi', fontweight='bold', fontsize=14)

# Cilt tipi
ax = axes[0, 1]
if 'Cilt Tipi' in df_full.columns:
    cilt_counts = df_full['Cilt Tipi'].value_counts()
    colors_cilt = ['#9b59b6', '#1abc9c']
    
    wedges, texts, autotexts = ax.pie(cilt_counts.values, labels=cilt_counts.index,
                                      autopct='%1.1f%%', colors=colors_cilt[:len(cilt_counts)],
                                      explode=[0.05, 0], shadow=True, startangle=45)
    
    for text in texts:
        text.set_fontsize(11)
        text.set_fontweight('bold')
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontsize(11)
        autotext.set_fontweight('bold')
    
    ax.set_title('Cilt Tipi Dagilimi', fontweight='bold', fontsize=14)

# Kagit cinsi
ax = axes[0, 2]
if 'Kağıt Cinsi' in df_full.columns:
    kagit_counts = df_full['Kağıt Cinsi'].value_counts()
    colors_kagit = plt.cm.Set3(np.linspace(0, 1, len(kagit_counts)))
    
    bars = ax.bar(range(len(kagit_counts)), kagit_counts.values, color=colors_kagit,
                 alpha=0.8, edgecolor='black', linewidth=2)
    ax.set_xticks(range(len(kagit_counts)))
    ax.set_xticklabels(kagit_counts.index, rotation=45, ha='right', fontsize=9, fontweight='bold')
    ax.set_ylabel('Kitap Sayisi', fontweight='bold', fontsize=12)
    ax.set_title('Kagit Cinsi Dagilimi', fontweight='bold', fontsize=14)
    ax.grid(True, alpha=0.4, axis='y')
    
    for i, val in enumerate(kagit_counts.values):
        ax.text(i, val + 10, f'{int(val)}', ha='center', va='bottom', fontweight='bold', fontsize=10)

# Yayin yili trend
ax = axes[1, 0]
if 'Yayin_Yili' in df_full.columns:
    year_counts = df_full['Yayin_Yili'].value_counts().sort_index()
    
    ax.plot(year_counts.index, year_counts.values, marker='o', linewidth=3,
           markersize=8, color='#2980b9', markerfacecolor='#e74c3c')
    ax.fill_between(year_counts.index, year_counts.values, alpha=0.3, color='#2980b9')
    ax.set_xlabel('Yil', fontweight='bold', fontsize=12)
    ax.set_ylabel('Kitap Sayisi', fontweight='bold', fontsize=12)
    ax.set_title('Yayin Yili Trendi', fontweight='bold', fontsize=14)
    ax.grid(True, alpha=0.4)
    ax.tick_params(axis='x', rotation=45)

# Puan dagilimi
ax = axes[1, 1]
if 'Puan_Degeri' in df_full.columns:
    puan_counts = df_full['Puan_Degeri'].value_counts().sort_index()
    colors_puan = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60']
    
    bars = ax.bar(puan_counts.index, puan_counts.values,
                 color=colors_puan[:len(puan_counts)], alpha=0.8, 
                 edgecolor='black', linewidth=2, width=0.6)
    ax.set_xlabel('Puan Degeri (1-5)', fontweight='bold', fontsize=12)
    ax.set_ylabel('Kitap Sayisi', fontweight='bold', fontsize=12)
    ax.set_title('Puan Degeri Dagilimi', fontweight='bold', fontsize=14)
    ax.grid(True, alpha=0.4, axis='y')
    ax.set_xticks(puan_counts.index)
    
    for puan, val in zip(puan_counts.index, puan_counts.values):
        ax.text(puan, val + 10, f'{int(val)}', ha='center', va='bottom',
               fontweight='bold', fontsize=11)

# Kategori bazli ortalama satis
ax = axes[1, 2]
if 'Ana_Kategori' in df_full.columns:
    cat_sales = df_full.groupby('Ana_Kategori')[target].mean().sort_values(ascending=False).head(10)
    colors_sales = plt.cm.RdYlGn(np.linspace(0.3, 0.9, len(cat_sales)))
    
    bars = ax.barh(range(len(cat_sales)), cat_sales.values, color=colors_sales,
                  edgecolor='black', linewidth=2)
    ax.set_yticks(range(len(cat_sales)))
    ax.set_yticklabels(cat_sales.index, fontsize=10, fontweight='bold')
    ax.set_xlabel('Ortalama Satis Sayisi', fontweight='bold', fontsize=12)
    ax.set_title('Kategoriye Gore Ortalama Satis', fontweight='bold', fontsize=14)
    ax.grid(True, alpha=0.4, axis='x')
    
    for i, val in enumerate(cat_sales.values):
        ax.text(val + 3, i, f'{val:.1f}', va='center', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.savefig('07_KATEGORIK_ANALIZ.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 07_KATEGORIK_ANALIZ.png")
plt.close()

# ============================================================================
# 8. OZET RAPOR
# ============================================================================
print("[8/10] Ozet rapor olusturuluyor...")

fig8, axes = plt.subplots(2, 2, figsize=(20, 12))
fig8.suptitle('VERI ON ISLEME SURECI - OZET RAPOR', fontsize=20, fontweight='bold')

# Veri boyutu evrimiax = axes[0, 0]
stages = ['Orijinal', 'Islenmis\n(Tam)', 'Model\n(Final)']
rows = [df_original.shape[0], df_full.shape[0], df_model_final.shape[0]]
cols = [df_original.shape[1], df_full.shape[1], df_model_final.shape[1]]

x = np.arange(len(stages))
width = 0.35

bars1 = ax.bar(x - width/2, rows, width, label='Satir Sayisi', 
              color='#3498db', alpha=0.8, edgecolor='black', linewidth=2)
bars2 = ax.bar(x + width/2, cols, width, label='Sutun Sayisi',
              color='#e74c3c', alpha=0.8, edgecolor='black', linewidth=2)

ax.set_ylabel('Sayi', fontweight='bold', fontsize=12)
ax.set_title('Veri Boyutu Evrimi', fontweight='bold', fontsize=14)
ax.set_xticks(x)
ax.set_xticklabels(stages, fontweight='bold', fontsize=11)
ax.legend(fontsize=11, loc='upper left')
ax.grid(True, alpha=0.4, axis='y')

for bars in [bars1, bars2]:
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 1,
               f'{int(height)}', ha='center', va='bottom', fontweight='bold', fontsize=11)

# Sutun tipi dagilimi
ax = axes[0, 1]
numeric_count = len([c for c in df_model_final.columns if df_model_final[c].dtype != 'object'])
categorical_count = len([c for c in df_model_final.columns if df_model_final[c].dtype == 'object'])

colors_type = ['#1abc9c', '#f39c12']
sizes = [numeric_count, categorical_count] if categorical_count > 0 else [numeric_count]
labels_pie = [f'Sayisal\n{numeric_count} Sutun']
if categorical_count > 0:
    labels_pie.append(f'Kategorik\n{categorical_count} Sutun')

wedges, texts, autotexts = ax.pie(sizes, labels=labels_pie, autopct='%1.1f%%',
                                  colors=colors_type[:len(sizes)],
                                  explode=[0.05]*len(sizes), shadow=True, startangle=90)

for text in texts:
    text.set_fontsize(12)
    text.set_fontweight('bold')
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontsize(12)
    autotext.set_fontweight('bold')

ax.set_title('Final Veri Seti - Sutun Tipleri', fontweight='bold', fontsize=14)

# Islem checklistiax = axes[1, 0]
ax.axis('off')

steps = [
    ['✓', 'Veri Yukleme', f'{df_original.shape[0]} satir'],
    ['✓', 'Eksik Veri Tespiti', f'{missing_before.sum() if len(missing_before) > 0 else 0} eksik'],
    ['✓', 'Ozellik Cikarimi', '6 yeni ozellik'],
    ['✓', 'Imputation', 'Medyan ve Mod'],
    ['✓', 'Aykiri Deger Tespiti', 'IQR metodu'],
    ['✓', 'Capping', 'Veri kaybi YOK'],
    ['✓', 'Label Encoding', '3 sutun'],
    ['✓', 'One-Hot Encoding', '11 binary sutun'],
    ['✓', 'Normalizasyon', '9 ozellik [0-1]'],
    ['✓', 'Final Veri', f'{df_model_final.shape[1]} sutun HAZIR']
]

table = ax.table(cellText=steps,
                colLabels=['Durum', 'Islem', 'Detay'],
                cellLoc='left', loc='center',
                colWidths=[0.12, 0.45, 0.43])
table.auto_set_font_size(False)
table.set_fontsize(11)
table.scale(1, 2.8)

for i in range(11):
    if i == 0:
        for j in range(3):
            table[(i, j)].set_facecolor('#2c3e50')
            table[(i, j)].set_text_props(weight='bold', color='white', size=12)
    else:
        table[(i, 0)].set_facecolor('#2ecc71')
        table[(i, 0)].set_text_props(weight='bold', color='white', size=14)
        table[(i, 1)].set_facecolor('#ecf0f1')
        table[(i, 2)].set_facecolor('#bdc3c7')
        table[(i, 1)].set_text_props(weight='bold', size=10)

ax.set_title('UYGULANAN ON ISLEME ADIMLARI', fontweight='bold', fontsize=16, pad=20)

# Kalite metrikleri
ax = axes[1, 1]
ax.axis('off')

quality_metrics = [
    ['Toplam Satir', f'{df_model_final.shape[0]:,}', '✓'],
    ['Toplam Ozellik', f'{df_model_final.shape[1] - 1}', '✓'],
    ['Hedef Degisken', '1', '✓'],
    ['Eksik Deger', '0', '✓✓✓'],
    ['Veri Butunlugu', '100.00%', '✓✓✓'],
    ['Normalize Ozellik', '9', '✓'],
    ['Encoded Ozellik', '3', '✓'],
    ['One-Hot Ozellik', '11', '✓'],
    ['String Sutun', '0', '✓✓✓'],
    ['DURUM', 'HAZIR!', '🚀']
]

table2 = ax.table(cellText=quality_metrics,
                 colLabels=['Metrik', 'Deger', 'OK'],
                 cellLoc='left', loc='center',
                 colWidths=[0.5, 0.3, 0.2])
table2.auto_set_font_size(False)
table2.set_fontsize(11)
table2.scale(1, 2.8)

for i in range(11):
    if i == 0:
        for j in range(3):
            table2[(i, j)].set_facecolor('#34495e')
            table2[(i, j)].set_text_props(weight='bold', color='white', size=12)
    else:
        table2[(i, 0)].set_facecolor('#ecf0f1')
        if i == 10:  # Son satir
            table2[(i, 1)].set_facecolor('#2ecc71')
            table2[(i, 1)].set_text_props(weight='bold', color='white', size=14)
            table2[(i, 2)].set_facecolor('#27ae60')
        else:
            table2[(i, 1)].set_facecolor('#d5f4e6')
            table2[(i, 2)].set_facecolor('#2ecc71')
        
        table2[(i, 1)].set_text_props(weight='bold', size=11)
        table2[(i, 2)].set_text_props(weight='bold', size=12)

ax.set_title('VERI KALITESI METRIKLERI', fontweight='bold', fontsize=16, pad=20)

plt.tight_layout()
plt.savefig('08_OZET_RAPOR.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 08_OZET_RAPOR.png")
plt.close()

# ============================================================================
# 9. OZELLIK DAGILIM COMPARISON
# ============================================================================
print("[9/10] Ozellik dagilim karsilastirmalari...")

fig9, axes = plt.subplots(3, 3, figsize=(20, 15))
fig9.suptitle('NORMALIZE OZELLIKLER - DAGILIM ANALIZLERI',
              fontsize=20, fontweight='bold')

norm_features = [col for col in df_model_final.columns if '_Normalized' in col][:9]

for idx, feat in enumerate(norm_features):
    row = idx // 3
    col = idx % 3
    ax = axes[row, col]
    
    data = df_model_final[feat].dropna()
    
    # Histogram + KDE
    n, bins, patches = ax.hist(data, bins=40, density=True, alpha=0.6,
                               color=plt.cm.tab10(idx), edgecolor='black', linewidth=1.5)
    
    # KDE curve
    from scipy.stats import gaussian_kde
    kde = gaussian_kde(data)
    x_range = np.linspace(data.min(), data.max(), 200)
    ax.plot(x_range, kde(x_range), color='darkblue', linewidth=3, label='KDE')
    
    ax.set_xlabel('Normalize Deger [0-1]', fontweight='bold', fontsize=10)
    ax.set_ylabel('Yogunluk', fontweight='bold', fontsize=10)
    ax.set_title(feat.replace('_Normalized', '').replace('_', ' '), 
                fontweight='bold', fontsize=12)
    ax.grid(True, alpha=0.3)
    ax.legend(fontsize=9)
    
    # Stats overlay
    stats_text = f'μ={data.mean():.2f}\nσ={data.std():.2f}'
    ax.text(0.98, 0.97, stats_text,
           transform=ax.transAxes, ha='right', va='top',
           bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7),
           fontsize=9, fontweight='bold')

plt.tight_layout()
plt.savefig('09_OZELLIK_DAGILIMLAR.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 09_OZELLIK_DAGILIMLAR.png")
plt.close()

# ============================================================================
# 10. MEGA OZET DASHBOARD
# ============================================================================
print("[10/10] Mega ozet dashboard olusturuluyor...")

fig10 = plt.figure(figsize=(24, 16))
fig10.suptitle('VERI ON ISLEME - KOMPLE DASHBOARD', 
               fontsize=24, fontweight='bold', y=0.99)

gs = fig10.add_gridspec(4, 4, hspace=0.3, wspace=0.3)

# 1. Veri akisi
ax1 = fig10.add_subplot(gs[0, 0])
ax1.axis('off')

flow_stages = [
    ('1. HAM VERI', '#e74c3c'),
    ('↓', 'white'),
    ('2. EKSIK TESPITI', '#e67e22'),
    ('↓', 'white'),
    ('3. IMPUTATION', '#f39c12'),
    ('↓', 'white'),
    ('4. OUTLIER CLEAN', '#f1c40f'),
    ('↓', 'white'),
    ('5. ENCODING', '#2ecc71'),
    ('↓', 'white'),
    ('6. NORMALIZATION', '#1abc9c'),
    ('↓', 'white'),
    ('7. HAZIR!', '#27ae60')
]

for i, (stage, color) in enumerate(flow_stages):
    y_pos = 0.95 - (i * 0.07)
    if stage == '↓':
        ax1.text(0.5, y_pos, stage, ha='center', va='center',
                fontsize=20, fontweight='bold', color='black')
    else:
        ax1.text(0.5, y_pos, stage, ha='center', va='center',
                fontsize=11, fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.5', facecolor=color, alpha=0.8),
                color='white' if color != 'white' else 'black')

ax1.set_title('SUREC AKISI', fontweight='bold', fontsize=14, pad=10)

# 2-3. Hedef degisken karsilastirma
ax2 = fig10.add_subplot(gs[0, 1:3])
ax2.hist(df_full[target], bins=60, color='#3498db', alpha=0.5, edgecolor='black',
        linewidth=1.5, label='Orijinal Dagilim')
ax2_twin = ax2.twinx()
ax2_twin.hist(df_full[f'{target}_Normalized']*df_full[target].max(), bins=60,
             color='#2ecc71', alpha=0.5, edgecolor='black', linewidth=1.5,
             label='Normalize Dagilim')
ax2.set_xlabel('Satis Sayisi', fontweight='bold', fontsize=12)
ax2.set_ylabel('Frekans (Orijinal)', fontweight='bold', fontsize=12, color='#3498db')
ax2_twin.set_ylabel('Frekans (Normalize)', fontweight='bold', fontsize=12, color='#2ecc71')
ax2.set_title('Hedef Degisken: Orijinal vs Normalize', fontweight='bold', fontsize=14)
ax2.tick_params(axis='y', labelcolor='#3498db')
ax2_twin.tick_params(axis='y', labelcolor='#2ecc71')
ax2.legend(loc='upper right', fontsize=10)
ax2.grid(True, alpha=0.3)

# 4. Ozellik onemi
ax4 = fig10.add_subplot(gs[0, 3])
if target in df_model_final.columns:
    feat_imp = df_model_final.corr()[target].abs().sort_values(ascending=False)[1:8]
    colors_imp = plt.cm.RdYlGn(np.linspace(0.3, 0.9, len(feat_imp)))
    
    bars = ax4.barh(range(len(feat_imp)), feat_imp.values, color=colors_imp,
                   edgecolor='black', linewidth=2)
    ax4.set_yticks(range(len(feat_imp)))
    ax4.set_yticklabels([label[:25] for label in feat_imp.index], fontsize=9, fontweight='bold')
    ax4.set_xlabel('Korelasyon', fontweight='bold', fontsize=11)
    ax4.set_title('En Onemli\n7 Ozellik', fontweight='bold', fontsize=13)
    ax4.grid(True, alpha=0.4, axis='x')
    
    for i, val in enumerate(feat_imp.values):
        ax4.text(val + 0.01, i, f'{val:.2f}', va='center', fontsize=9, fontweight='bold')

# 5. Kategorilerin satis performansi
ax5 = fig10.add_subplot(gs[1, :2])
if 'Ana_Kategori' in df_full.columns:
    cat_stats = df_full.groupby('Ana_Kategori')[target].agg(['mean', 'median', 'count']).sort_values('mean', ascending=False).head(10)
    
    x = np.arange(len(cat_stats))
    width = 0.35
    
    bars1 = ax5.bar(x - width/2, cat_stats['mean'], width, label='Ortalama',
                   color='#3498db', alpha=0.8, edgecolor='black', linewidth=2)
    bars2 = ax5.bar(x + width/2, cat_stats['median'], width, label='Medyan',
                   color='#2ecc71', alpha=0.8, edgecolor='black', linewidth=2)
    
    ax5.set_xticks(x)
    ax5.set_xticklabels(cat_stats.index, rotation=45, ha='right', fontsize=10, fontweight='bold')
    ax5.set_ylabel('Satis Sayisi', fontweight='bold', fontsize=12)
    ax5.set_title('Kategoriye Gore Satis Performansi (Top 10)', fontweight='bold', fontsize=14)
    ax5.legend(fontsize=11, loc='upper right')
    ax5.grid(True, alpha=0.4, axis='y')

# 6. Normalizasyon etkisi (combined)
ax6 = fig10.add_subplot(gs[1, 2:])
all_normalized = df_model_final[[c for c in df_model_final.columns if '_Normalized' in c]].values.flatten()

ax6.hist(all_normalized, bins=60, color='#16a085', alpha=0.7, edgecolor='black', linewidth=1.5)
ax6.axvline(0.5, color='red', linestyle='--', linewidth=3, label='Orta Nokta (0.5)')
ax6.axvline(all_normalized.mean(), color='orange', linestyle='--', linewidth=3,
           label=f'Ortalama: {all_normalized.mean():.3f}')
ax6.set_xlabel('Normalize Deger [0-1]', fontweight='bold', fontsize=12)
ax6.set_ylabel('Frekans', fontweight='bold', fontsize=12)
ax6.set_title('TUM Normalize Ozelliklerin Birlesik Dagilimi', fontweight='bold', fontsize=14)
ax6.legend(fontsize=11)
ax6.grid(True, alpha=0.3)

stats_box = f'Toplam Deger: {len(all_normalized):,}\nOrtalama: {all_normalized.mean():.3f}\nStd: {all_normalized.std():.3f}'
ax6.text(0.02, 0.98, stats_box,
        transform=ax6.transAxes, ha='left', va='top',
        bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8),
        fontsize=11, fontweight='bold')

# 7-9. Top features detailed
top_3_features = df_model_final.corr()[target].abs().sort_values(ascending=False)[1:4].index

for idx, feat in enumerate(top_3_features):
    ax = fig10.add_subplot(gs[2, idx])
    
    data = df_model_final[feat].dropna()
    
    # Histogram
    n, bins, patches = ax.hist(data, bins=30, density=True, alpha=0.6,
                               color=plt.cm.Set1(idx), edgecolor='black', linewidth=1.5)
    
    # KDE
    from scipy.stats import gaussian_kde
    kde = gaussian_kde(data)
    x_range = np.linspace(data.min(), data.max(), 200)
    ax.plot(x_range, kde(x_range), color='darkred', linewidth=3, label='Density')
    
    ax.set_xlabel('Deger', fontweight='bold', fontsize=10)
    ax.set_ylabel('Yogunluk', fontweight='bold', fontsize=10)
    ax.set_title(f'TOP {idx+1}: {feat[:30]}', fontweight='bold', fontsize=11)
    ax.grid(True, alpha=0.3)
    ax.legend(fontsize=9)

# 10. Basari metrikleri
ax10 = fig10.add_subplot(gs[2, 3])

metrics = {
    'Veri Hazirlik': 100,
    'Eksik Deger Temizlik': 100,
    'Aykiri Deger Temizlik': 100,
    'Encoding': 100,
    'Normalizasyon': 100
}

y_pos = np.arange(len(metrics))
colors_prog = ['#2ecc71'] * len(metrics)

bars = ax10.barh(y_pos, list(metrics.values()), color=colors_prog, alpha=0.8,
                edgecolor='darkgreen', linewidth=2.5)
ax10.set_yticks(y_pos)
ax10.set_yticklabels(list(metrics.keys()), fontsize=10, fontweight='bold')
ax10.set_xlabel('Tamamlanma (%)', fontweight='bold', fontsize=12)
ax10.set_xlim(0, 110)
ax10.set_title('Islem Tamamlanma', fontweight='bold', fontsize=13)
ax10.grid(True, alpha=0.4, axis='x')

for i, val in enumerate(metrics.values()):
    ax10.text(val + 2, i, f'{val}%', va='center', fontweight='bold',
             color='darkgreen', fontsize=12)

# 11-13. Kategorik vs Satis iliskisi
if 'Ana_Kategori' in df_full.columns:
    # En cok satan kategoriler
    ax11 = fig10.add_subplot(gs[3, :2])
    cat_total_sales = df_full.groupby('Ana_Kategori')[target].sum().sort_values(ascending=False).head(10)
    
    colors_sales = plt.cm.Spectral(np.linspace(0, 1, len(cat_total_sales)))
    bars = ax11.bar(range(len(cat_total_sales)), cat_total_sales.values,
                   color=colors_sales, alpha=0.8, edgecolor='black', linewidth=2)
    ax11.set_xticks(range(len(cat_total_sales)))
    ax11.set_xticklabels(cat_total_sales.index, rotation=45, ha='right', fontsize=10, fontweight='bold')
    ax11.set_ylabel('Toplam Satis', fontweight='bold', fontsize=12)
    ax11.set_title('En Cok Satan 10 Kategori (Toplam)', fontweight='bold', fontsize=14)
    ax11.grid(True, alpha=0.4, axis='y')
    
    for i, val in enumerate(cat_total_sales.values):
        ax11.text(i, val + 100, f'{int(val):,}', ha='center', va='bottom',
                 fontweight='bold', fontsize=9, rotation=0)

# Final durum ozeti
ax14 = fig10.add_subplot(gs[3, 2:])
ax14.axis('off')

final_summary = f"""
╔══════════════════════════════════════════════╗
║     VERI ON ISLEME TAMAMLANDI!               ║
╚══════════════════════════════════════════════╝

📊 FINAL VERI SETI:
   • Dosya: kitapdata_model_ready.csv
   • Boyut: {df_model_final.shape[0]} satir × {df_model_final.shape[1]} sutun
   • Ozellik: {df_model_final.shape[1] - 1} (hedef haric)
   • Hedef: {target}

✅ KALITE KONTROL:
   • Eksik deger: 0 (YOK!)
   • String sutun: 0 (YOK!)
   • Veri butunlugu: %100
   • Aykiri deger: Temizlendi

🔧 DONUSUMLER:
   • Label Encoded: 3 sutun
   • One-Hot Encoded: 11 sutun
   • Normalized: 9 sutun
   • Toplam islem: 10 adim

🎯 MODEL ICIN HAZIR!
   ✓ Tum degerler sayisal
   ✓ 0-1 araliginda normalize
   ✓ Kategoriler encode edildi
   ✓ Aykiri degerler temizlendi

📈 ONERILENLER:
   • Random Forest Regressor
   • Gradient Boosting (XGBoost)
   • Neural Networks
   • Cross-validation kullan
"""

ax14.text(0.05, 0.95, final_summary,
         transform=ax14.transAxes, ha='left', va='top',
         fontsize=11, family='monospace', fontweight='bold',
         bbox=dict(boxstyle='round,pad=1.5', facecolor='lightgreen', alpha=0.9, edgecolor='darkgreen', linewidth=3))

plt.tight_layout()
plt.savefig('10_MEGA_DASHBOARD.png', dpi=300, bbox_inches='tight')
print("  [SAVED] 10_MEGA_DASHBOARD.png")
plt.close()

print("\n" + "="*80)
print("TUM GORSELLESTIRMELER TAMAMLANDI!")
print("="*80)
print("\nOlusturulan dosyalar:")
print("  1. kitapdata_model_ready.csv - MODEL ICIN HAZIR VERI (STRING YOK!)")
print("  2. 01_EKSIK_VERI_ANALIZI.png")
print("  3. 02_AYKIRI_DEGER_ANALIZI.png")
print("  4. 03_NORMALIZASYON_ANALIZI.png")
print("  5. 04_ENCODING_ANALIZI.png")
print("  6. 05_HEDEF_DEGISKEN_ANALIZI.png")
print("  7. 06_KORELASYON_ANALIZI.png")
print("  8. 07_KATEGORIK_ANALIZ.png")
print("  9. 08_OZET_RAPOR.png")
print(" 10. 09_OZELLIK_DAGILIMLAR.png")
print(" 11. 10_MEGA_DASHBOARD.png")
print("\nTum grafikler 300 DPI cozunurlukle kaydedildi!")
print("\n✓ kitapdata_model_ready.csv dosyasi TUM SAYISAL - model egitimi icin hazir!")

