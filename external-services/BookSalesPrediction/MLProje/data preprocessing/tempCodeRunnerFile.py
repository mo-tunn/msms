# -*- coding: utf-8 -*-
"""
Kitap Satış Tahmini - Model Eğitim Örneği
==========================================

Bu script, ön işlenmiş veri setini kullanarak basit bir
makine öğrenmesi modeli eğitimi gösterir.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt

print("=" * 80)
print("KITAP SATIS TAHMINI - MODEL EGITIM ORNEGI")
print("=" * 80)

# ============================================================================
# 1. VERI YUKLE
# ============================================================================
print("\n[1] Islenmis veri seti yukleniyor...")

df = pd.read_csv('kitapdata_preprocessed.csv')

print(f"   Veri boyutu: {df.shape[0]} satir x {df.shape[1]} sutun")

# ============================================================================
# 2. OZELLIKLERI VE HEDEF DEGISKENI AYIR
# ============================================================================
print("\n[2] Ozellikler ve hedef degisken ayrilıyor...")

# 'Ana_Kategori_Grouped' string sütunu olduğu için çıkar
if 'Ana_Kategori_Grouped' in df.columns:
    df_model = df.drop('Ana_Kategori_Grouped', axis=1)
else:
    df_model = df.copy()

# Ozellikler (X) ve hedef degisken (y)
X = df_model.drop('Toplam Satılma Sayısı', axis=1)
y = df_model['Toplam Satılma Sayısı']

print(f"   Ozellik sayisi: {X.shape[1]}")
print(f"   Ornek sayisi: {X.shape[0]}")
print(f"   Hedef degisken: Toplam Satilma Sayisi")

# ============================================================================
# 3. TRAIN-TEST SPLIT
# ============================================================================
print("\n[3] Veri seti egitim ve test olarak ayrilıyor...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"   Egitim seti: {X_train.shape[0]} ornek")
print(f"   Test seti: {X_test.shape[0]} ornek")
print(f"   Oran: %80 egitim - %20 test")

# ============================================================================
# 4. MODEL 1: LINEAR REGRESSION (BASELINE)
# ============================================================================
print("\n[4] Model 1: Linear Regression egitiliyor...")

lr_model = LinearRegression()
lr_model.fit(X_train, y_train)

# Tahmin yap
y_pred_lr = lr_model.predict(X_test)

# Performans metrikleri
mae_lr = mean_absolute_error(y_test, y_pred_lr)
rmse_lr = np.sqrt(mean_squared_error(y_test, y_pred_lr))
r2_lr = r2_score(y_test, y_pred_lr)

print(f"\n   Linear Regression Sonuclari:")
print(f"   - MAE (Mean Absolute Error): {mae_lr:.2f}")
print(f"   - RMSE (Root Mean Squared Error): {rmse_lr:.2f}")
print(f"   - R2 Score: {r2_lr:.4f}")

# ============================================================================
# 5. MODEL 2: RANDOM FOREST (GELISMIS)
# ============================================================================
print("\n[5] Model 2: Random Forest egitiliyor...")

rf_model = RandomForestRegressor(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)
rf_model.fit(X_train, y_train)

# Tahmin yap
y_pred_rf = rf_model.predict(X_test)

# Performans metrikleri
mae_rf = mean_absolute_error(y_test, y_pred_rf)
rmse_rf = np.sqrt(mean_squared_error(y_test, y_pred_rf))
r2_rf = r2_score(y_test, y_pred_rf)

print(f"\n   Random Forest Sonuclari:")
print(f"   - MAE (Mean Absolute Error): {mae_rf:.2f}")
print(f"   - RMSE (Root Mean Squared Error): {rmse_rf:.2f}")
print(f"   - R2 Score: {r2_rf:.4f}")

# ============================================================================
# 6. OZELLIK ONEMLERI (RANDOM FOREST)
# ============================================================================
print("\n[6] En onemli 10 ozellik (Random Forest):")

feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': rf_model.feature_importances_
}).sort_values('Importance', ascending=False)

print("\n" + feature_importance.head(10).to_string(index=False))

# ============================================================================
# 7. MODEL KARSILASTIRMASI
# ============================================================================
print("\n" + "=" * 80)
print("MODEL PERFORMANS KARSILASTIRMASI")
print("=" * 80)

comparison = pd.DataFrame({
    'Model': ['Linear Regression', 'Random Forest'],
    'MAE': [mae_lr, mae_rf],
    'RMSE': [rmse_lr, rmse_rf],
    'R2 Score': [r2_lr, r2_rf]
})

print("\n" + comparison.to_string(index=False))

# En iyi modeli belirle
best_model_idx = comparison['R2 Score'].idxmax()
best_model_name = comparison.loc[best_model_idx, 'Model']
best_r2 = comparison.loc[best_model_idx, 'R2 Score']

print(f"\n[SONUC] En iyi model: {best_model_name} (R2: {best_r2:.4f})")

# ============================================================================
# 8. TAHMIN ORNEKLERI
# ============================================================================
print("\n" + "=" * 80)
print("ORNEK TAHMINLER")
print("=" * 80)

# Test setinden 5 ornek al
sample_indices = np.random.choice(X_test.index, size=5, replace=False)

print("\n Gercek vs Tahmin (Random Forest):")
print("-" * 60)
print(f"{'Gercek Deger':>15} | {'Tahmin':>15} | {'Fark':>15}")
print("-" * 60)

for idx in sample_indices:
    actual = y_test.loc[idx]
    predicted = rf_model.predict(X_test.loc[[idx]])[0]
    diff = abs(actual - predicted)
    print(f"{actual:>15.0f} | {predicted:>15.2f} | {diff:>15.2f}")

# ============================================================================
# 9. GORSELLESTIRME
# ============================================================================
print("\n[9] Tahmin gorsellestirmesi olusturuluyor...")

try:
    fig, axes = plt.subplots(1, 2, figsize=(15, 5))
    
    # 1. Gercek vs Tahmin (Scatter plot)
    axes[0].scatter(y_test, y_pred_rf, alpha=0.5, color='blue')
    axes[0].plot([y_test.min(), y_test.max()], 
                 [y_test.min(), y_test.max()], 
                 'r--', lw=2, label='Perfect Prediction')
    axes[0].set_xlabel('Gercek Deger')
    axes[0].set_ylabel('Tahmin')
    axes[0].set_title(f'Random Forest: Gercek vs Tahmin (R2={r2_rf:.4f})')
    axes[0].legend()
    axes[0].grid(True, alpha=0.3)
    
    # 2. Hata dagilimi
    errors = y_test - y_pred_rf
    axes[1].hist(errors, bins=30, color='coral', edgecolor='black', alpha=0.7)
    axes[1].set_xlabel('Tahmin Hatasi')
    axes[1].set_ylabel('Frekans')
    axes[1].set_title('Tahmin Hata Dagilimi')
    axes[1].axvline(x=0, color='red', linestyle='--', linewidth=2, label='Sifir Hata')
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('model_performance.png', dpi=300, bbox_inches='tight')
    print(f"   [OK] Gorsel kaydedildi: model_performance.png")
except Exception as e:
    print(f"   [WARNING] Gorsellestirme hatasi: {str(e)}")

# ============================================================================
# 10. SONUC RAPORU
# ============================================================================
print("\n" + "=" * 80)
print("SONUC RAPORU")
print("=" * 80)

report = f"""
MODEL EGITIMI TAMAMLANDI!

Kullanilan Veri:
  - Egitim ornegi: {X_train.shape[0]}
  - Test ornegi: {X_test.shape[0]}
  - Ozellik sayisi: {X_train.shape[1]}

Random Forest Performansi:
  - MAE: {mae_rf:.2f} kitap
  - RMSE: {rmse_rf:.2f} kitap
  - R2 Score: {r2_rf:.4f}
  
  Yorum: R2 Score {r2_rf*100:.2f}% varyans acikliyor

Linear Regression Performansi:
  - MAE: {mae_lr:.2f} kitap
  - RMSE: {rmse_lr:.2f} kitap
  - R2 Score: {r2_lr:.4f}
  
Ortalama tahmin hatasi: ±{mae_rf:.0f} kitap

SONRAKI ADIMLAR:
  1. Hiperparametre optimizasyonu (GridSearchCV)
  2. Cross-validation ile daha saglikli degerlendirme
  3. Farkli modeller deneme (XGBoost, LightGBM)
  4. Feature selection ile ozellik sayisini azaltma
  5. Model ensemble (birden fazla modeli birlestirme)
"""

print(report)

# Raporu kaydet
with open('model_training_report.txt', 'w', encoding='utf-8') as f:
    f.write(report)

print(f"[SAVE] Model egitim raporu kaydedildi: model_training_report.txt")

print("\n" + "=" * 80)
print("ORNEK MODEL EGITIMI TAMAMLANDI!")
print("=" * 80)
print()


