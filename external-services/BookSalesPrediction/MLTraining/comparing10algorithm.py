import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import time
import os
import sys
import warnings

# Sklearn metrikleri ve model seçimi
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    r2_score, 
    mean_absolute_error, 
    mean_squared_error, 
    median_absolute_error
)

# 1. Lineer Modeller
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet

# 2. Doğrusal Olmayan Modeller
from sklearn.neighbors import KNeighborsRegressor
from sklearn.tree import DecisionTreeRegressor

# 3. Ensemble (Topluluk) Modelleri
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
import xgboost as xgb
import lightgbm as lgb

# Uyarıları bastır (özellikle model yakınsama uyarıları için)
warnings.filterwarnings('ignore')
# Pandas float formatını ayarla (daha okunaklı olması için)
pd.set_option('display.float_format', '{:.4f}'.format)


def calculate_adj_r2(r2, n, p):
    """
    R-squared (R2) değerini kullanarak Düzeltilmiş R-squared (Adjusted R2)
    değerini hesaplar.
    
    Args:
        r2 (float): Modelin R-squared skoru.
        n (int): Örneklem sayısı (test setinin satır sayısı).
        p (int): Özellik (feature) sayısı.
    
    Returns:
        float: Hesaplanmış Adjusted R-squared skoru.
    """
    if (n - p - 1) == 0:
        return r2 # Bölme hatasını önle
    return 1 - (1 - r2) * (n - 1) / (n - p - 1)

def compare_regression_models(csv_file_path, target_column, output_viz_dir):
    """
    Bir CSV dosyasını yükler, 10 farklı regresyon modelini eğitir,
    kapsamlı metriklerle karşılaştırır ve sonuçları görselleştirip kaydeder.
    
    Args:
        csv_file_path (str): İşlenecek normalize edilmiş CSV dosyasının yolu.
        target_column (str): Tahmin edilecek hedef kolonun adı (Y).
        output_viz_dir (str): Görselleştirmelerin kaydedileceği klasör.
    """
    
    print(f"--- Model Karşılaştırma Analizi Başlatıldı ---")
    print(f"Veri Seti: {csv_file_path}")
    print(f"Hedef Kolon: {target_column}")
    
    # --- 1. Adım: Veri Yükleme ve Hazırlama ---
    try:
        df = pd.read_csv(csv_file_path)
    except FileNotFoundError:
        print(f"\nHATA: Dosya bulunamadı: {csv_file_path}", file=sys.stderr)
        return
    except Exception as e:
        print(f"\nHATA: Dosya okunurken bir hata oluştu: {e}", file=sys.stderr)
        return

    if df[target_column].isnull().any():
        print(f"Uyarı: Hedef kolonda ({target_column}) {df[target_column].isnull().sum()} adet boş değer bulundu. Bu satırlar analizden çıkarılıyor.")
        df = df.dropna(subset=[target_column])

    y = df[target_column]
    X = df.drop(columns=[target_column], errors='ignore')
    X = X.select_dtypes(include=np.number) 
    
    if X.empty:
        print("\nHATA: Model için kullanılabilir hiçbir özellik (feature) kolonu bulunamadı.", file=sys.stderr)
        return

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"\nVeri seti ayrıldı: {len(X_train)} eğitim, {len(X_test)} test satırı.")
    print(f"Kullanılan özellik (feature) sayısı: {len(X.columns)}")

    n_test = len(X_test)
    p_test = len(X.columns)

    # --- 2. Adım: Modelleri Tanımla ---
    models = {
        "Linear Regression": LinearRegression(),
        "Ridge": Ridge(random_state=42),
        "Lasso": Lasso(random_state=42),
        "ElasticNet": ElasticNet(random_state=42),
        "KNN Regressor": KNeighborsRegressor(),
        "Decision Tree": DecisionTreeRegressor(random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, random_state=42),
        "XGBoost": xgb.XGBRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        "LightGBM": lgb.LGBMRegressor(n_estimators=100, random_state=42, n_jobs=-1, verbose=-1)
    }
    
    # --- 3. Adım: Modelleri Eğit ve Değerlendir ---
    results = [] 
    print("\n--- Modeller Eğitiliyor ve Değerlendiriliyor ---")
    
    for model_name, model in models.items():
        print(f"  Eğitiliyor: {model_name}...")
        
        try:
            start_time = time.time()
            model.fit(X_train, y_train)
            end_time = time.time()
            
            y_pred = model.predict(X_test)
            
            r2 = r2_score(y_test, y_pred)
            adj_r2 = calculate_adj_r2(r2, n_test, p_test)
            mae = mean_absolute_error(y_test, y_pred)
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            medae = median_absolute_error(y_test, y_pred)
            train_time = end_time - start_time
            
            results.append({
                "Model": model_name,
                "R-squared": r2,
                "Adj. R-squared": adj_r2,
                "MAE": mae,
                "MSE": mse,
                "RMSE": rmse,
                "MedianAE": medae,
                "Eğitim Süresi (sn)": train_time
            })
            
        except Exception as e:
            print(f"    HATA: {model_name} eğitilirken bir hata oluştu: {e}", file=sys.stderr)
            
    if not results:
        print("\nHATA: Hiçbir model başarıyla eğitilemedi.", file=sys.stderr)
        return

    # --- 4. Adım: Sonuçları Raporla (DataFrame) ---
    results_df = pd.DataFrame(results)
    results_df = results_df.sort_values(by="R-squared", ascending=False).reset_index(drop=True)
    
    print("\n\n--- MODEL KARŞILAŞTIRMA RAPORU ---")
    print(results_df.to_markdown(index=False, floatfmt=".4f"))
    
    # --- 5. Adım: Sonuçları Görselleştir ve Kaydet ---
    print(f"\n\n--- Görseller Oluşturuluyor ve '{output_viz_dir}' Klasörüne Kaydediliyor ---")
    
    try:
        os.makedirs(output_viz_dir, exist_ok=True)
    except OSError as e:
        print(f"HATA: Çıktı klasörü oluşturulamadı: {e}", file=sys.stderr)
        return

    metrics_to_plot = ["R-squared", "Adj. R-squared", "RMSE", "MAE", "Eğitim Süresi (sn)"]
    
    for metric in metrics_to_plot:
        ascending_order = False if "R-squared" in metric else True
        
        # Veriyi sırala
        sorted_data = results_df.sort_values(by=metric, ascending=ascending_order)
        
        # <<! GÜNCELLENDİ !>> Figür boyutu etiketlere yer açmak için genişletildi
        plt.figure(figsize=(14, 8)) 
        
        # Sıralanmış veriyi bar plot'a aktar ve 'ax' değişkenine ata
        ax = sns.barplot(
            x=metric, 
            y="Model", 
            data=sorted_data
        )
        
        plt.title(f"Modellerin {metric} Değerine Göre Karşılaştırılması", fontsize=16)
        plt.xlabel(f"{metric} Değeri ({'Yüksek olan iyi' if not ascending_order else 'Düşük olan iyi'})", fontsize=12)
        plt.ylabel("Model", fontsize=12)
        
        # --- <<! YENİ EKLENDİ: Değer Etiketleri !>> ---
        # Barların üzerine sayısal değerleri ekle
        # ax.containers[0], yatay çubuk grubunu temsil eder
        # fmt='%.4f' -> 4 ondalık basamak göster
        # padding=5 -> etiketin bardan 5 piksel sağda durmasını sağlar
        ax.bar_label(ax.containers[0], fmt='%.4f', padding=5)
        
        # Etiketlerin sığması için x ekseni limitini (sağ tarafı) %15 genişlet
        current_xlim = ax.get_xlim()
        ax.set_xlim(current_xlim[0], current_xlim[1] * 1.15) 
        # --- <<! YENİ EKLEME BİTTİ !>> ---

        # Dosya adını oluştur
        filename = f"model_comparison_{metric.lower().replace(' ', '_').replace('-', '_').replace('(', '').replace(')', '')}.png"
        save_path = os.path.join(output_viz_dir, filename)
        
        try:
            plt.savefig(save_path, bbox_inches='tight')
            print(f"  ✓ Kaydedildi: {save_path}")
        except Exception as e:
            print(f"    ✗ HATA: {filename} kaydedilemedi: {e}", file=sys.stderr)
            
        # Grafiği Jupyter'da göster
        plt.show()
        plt.close()

    print("\n--- Analiz Tamamlandı ---")

# --- AYARLAR VE ÇALIŞTIRMA ---

# 1. Girdi Dosyası: Normalizasyon adımından gelen CSV'nin yolu
# <<!>> BU YOLU KENDİ VERİ SETİNİZE GÖRE DEĞİŞTİRİN
INPUT_CSV_PATH = ""

# 2. Hedef Kolon: Tahmin etmek istediğiniz kolonun adı
TARGET_COL_NAME = "Toplam Satılma Sayısı"

# 3. Çıktı Klasörü: Görsellerin kaydedileceği yer
# <<!>> İSTERSENİZ BU KLASÖR ADINI DEĞİŞTİREBİLİRSİNİZ
OUTPUT_VIZ_DIR = ""

# Analiz fonksiyonunu çağır
compare_regression_models(
    csv_file_path=INPUT_CSV_PATH,
    target_column=TARGET_COL_NAME,
    output_viz_dir=OUTPUT_VIZ_DIR
)