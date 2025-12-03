import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import GradientBoostingRegressor
import joblib
import json
import sys

# --- Ayarlar ---
# Normalize edilmemiş, SADECE capping (baskılama) yapılmış veri
INPUT_CAPPED_DATA = "C:/Users/metehan/Desktop/MLKitapSatisTahmini/datasetVersions/kitapyurdu_dataset_v3-nokagitcinsi.csv"
TARGET_COLUMN = "Toplam Satılma Sayısı"

# Kaydedilecek dosyaların adları
MODEL_FILE = "gbr_model.joblib"
SCALER_FILE = "scaler.joblib"
FEATURES_FILE = "model_features.json"

def train_and_save_production_model():
    """
    Modeli ve ön işleme (scaler) nesnelerini
    üretim (production) için eğitir ve kaydeder.
    """
    print("--- Üretim Modeli Eğitim Betiği Başlatıldı ---")
    
    # 1. Veriyi Yükle
    try:
        df = pd.read_csv(INPUT_CAPPED_DATA)
    except FileNotFoundError:
        print(f"HATA: '{INPUT_CAPPED_DATA}' dosyası bulunamadı!", file=sys.stderr)
        return
    
    print(f"Veri yüklendi: {len(df)} satır.")

    # 2. X (Özellikler) ve Y (Hedef) olarak ayır
    try:
        y = df[TARGET_COLUMN]
        # Hedef kolonu ve sayısal olmayanları (varsa) çıkar
        X = df.drop(columns=[TARGET_COLUMN]).select_dtypes(include='number')
    except KeyError:
        print(f"HATA: Hedef kolon '{TARGET_COLUMN}' bulunamadı!", file=sys.stderr)
        return
        
    # 3. Modelin ihtiyaç duyduğu kolon listesini kaydet
    feature_list = X.columns.tolist()
    with open(FEATURES_FILE, 'w') as f:
        json.dump(feature_list, f)
    print(f"✓ Model özellikleri (features) '{FEATURES_FILE}' dosyasına kaydedildi ({len(feature_list)} adet).")

    # 4. Scaler'ı (MinMaxScaler) eğit ve kaydet
    scaler = MinMaxScaler()
    scaler.fit(X) # Scaler'ı TÜM X verisine 'fit' ediyoruz
    joblib.dump(scaler, SCALER_FILE)
    print(f"✓ Scaler '{SCALER_FILE}' dosyasına kaydedildi.")

    # 5. Veriyi normalize et
    X_scaled = scaler.transform(X)

    # 6. Gradient Boosting modelini eğit ve kaydet
    print("Gradient Boosting Regressor eğitiliyor...")
    # 'n_estimators=100' gibi parametreleri kendi en iyi modelinizden alabilirsiniz
    model = GradientBoostingRegressor(
        n_estimators=100, 
        random_state=42,
        # Örn: max_depth=5, learning_rate=0.1
    )
    model.fit(X_scaled, y)
    joblib.dump(model, MODEL_FILE)
    print(f"✓ Model '{MODEL_FILE}' dosyasına kaydedildi.")
    print("\n--- Eğitim Tamamlandı ---")

if __name__ == "__main__":
    train_and_save_production_model()