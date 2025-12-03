"""
Kitap Satış Tahmin gRPC Servisi

Bu servis, Gradient Boosting modelini kullanarak kitap satış tahminleri yapar.
gRPC protokolü üzerinden diğer servislerle iletişim kurar.

Kullanım:
    python grpc_server.py

Servis varsayılan olarak 50051 portunda çalışır.
"""

import grpc
from concurrent import futures
import json
import os
import sys
import pandas as pd
import joblib
import logging
import urllib.parse

# Proto'dan generate edilmiş dosyaları import et
from protos import prediction_pb2
from protos import prediction_pb2_grpc

# Logging ayarları
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Konfigürasyon
GRPC_PORT = os.getenv("GRPC_PORT", "50051")
MAX_WORKERS = int(os.getenv("MAX_WORKERS", "10"))

# Model dosyalarının yolu (bu dosya ile aynı dizinde)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(BASE_DIR, "gbr_model.joblib")
SCALER_FILE = os.path.join(BASE_DIR, "scaler.joblib")
FEATURES_FILE = os.path.join(BASE_DIR, "model_features.json")


class PredictionServicer(prediction_pb2_grpc.PredictionServiceServicer):
    """
    gRPC Prediction Service implementasyonu.
    Kitap satış tahminlerini gerçekleştirir.
    """
    
    def __init__(self):
        """Model, scaler ve feature listesini yükle."""
        self.model = None
        self.scaler = None
        self.model_features = []
        self._load_model_artifacts()
    
    def _load_model_artifacts(self):
        """Model dosyalarını yükle."""
        try:
            self.model = joblib.load(MODEL_FILE)
            logger.info(f"✓ Model yüklendi: {MODEL_FILE}")
        except FileNotFoundError:
            logger.error(f"✗ Model dosyası bulunamadı: {MODEL_FILE}")
        except Exception as e:
            logger.error(f"✗ Model yüklenirken hata: {e}")
        
        try:
            self.scaler = joblib.load(SCALER_FILE)
            logger.info(f"✓ Scaler yüklendi: {SCALER_FILE}")
        except FileNotFoundError:
            logger.error(f"✗ Scaler dosyası bulunamadı: {SCALER_FILE}")
        except Exception as e:
            logger.error(f"✗ Scaler yüklenirken hata: {e}")
        
        try:
            with open(FEATURES_FILE, 'r', encoding='utf-8') as f:
                self.model_features = json.load(f)
            logger.info(f"✓ Feature listesi yüklendi: {len(self.model_features)} özellik")
        except FileNotFoundError:
            logger.error(f"✗ Feature dosyası bulunamadı: {FEATURES_FILE}")
        except Exception as e:
            logger.error(f"✗ Feature listesi yüklenirken hata: {e}")
    
    def Predict(self, request, context):
        """
        Tahmin isteğini işle ve sonucu döndür.
        
        Args:
            request: PredictRequest - feature'ları içeren istek
            context: gRPC context
            
        Returns:
            PredictResponse: Tahmin sonucu veya hata mesajı
        """
        logger.info("Tahmin isteği alındı")
        
        # Model kontrolü
        if self.model is None or self.scaler is None:
            logger.error("Model veya Scaler yüklenememiş")
            return prediction_pb2.PredictResponse(
                success=False,
                predicted_sales=0.0,
                error_message="Model veya Scaler yüklenemedi. Lütfen model dosyalarını kontrol edin."
            )
        
        try:
            # Convert repeated FeatureEntry to dict
            # Keys are bytes, so we decode them to utf-8
            features_dict = {}
            for entry in request.features:
                try:
                    # Try decoding as utf-8
                    decoded_key = entry.key.decode('utf-8')
                    features_dict[decoded_key] = entry.value
                except UnicodeDecodeError:
                    # Fallback to latin-1 if utf-8 fails (shouldn't happen with correct client)
                    logger.warning(f"UTF-8 decode failed for key: {entry.key}, trying latin-1")
                    decoded_key = entry.key.decode('latin-1')
                    features_dict[decoded_key] = entry.value
                except Exception as e:
                    logger.error(f"Error decoding key {entry.key}: {e}")
                    continue
            
            # Eksik feature kontrolü
            missing_features = set(self.model_features) - set(features_dict.keys())
            if missing_features:
                error_msg = f"Eksik özellikler: {', '.join(missing_features)}"
                logger.warning(error_msg)
                return prediction_pb2.PredictResponse(
                    success=False,
                    predicted_sales=0.0,
                    error_message=error_msg
                )
            
            # DataFrame'e dönüştür (doğru sırayla)
            input_df = pd.DataFrame([features_dict])
            input_df = input_df[self.model_features]
            
            # Normalize et
            scaled_data = self.scaler.transform(input_df)
            
            # Tahmin yap
            prediction = self.model.predict(scaled_data)
            predicted_sales = float(prediction[0])
            
            logger.info(f"Tahmin başarılı: {predicted_sales:.2f}")
            
            return prediction_pb2.PredictResponse(
                success=True,
                predicted_sales=predicted_sales,
                error_message=""
            )
            
        except KeyError as e:
            error_msg = f"Geçersiz özellik adı: {e}"
            logger.error(error_msg)
            return prediction_pb2.PredictResponse(
                success=False,
                predicted_sales=0.0,
                error_message=error_msg
            )
        except Exception as e:
            error_msg = f"Tahmin sırasında beklenmeyen hata: {str(e)}"
            logger.error(error_msg)
            return prediction_pb2.PredictResponse(
                success=False,
                predicted_sales=0.0,
                error_message=error_msg
            )
    
    def GetFeatures(self, request, context):
        """
        Modelin gerektirdiği özelliklerin listesini döndür.
        
        Returns:
            FeaturesResponse: Feature listesi
        """
        logger.info("Feature listesi istendi")
        return prediction_pb2.FeaturesResponse(features=self.model_features)
    
    def HealthCheck(self, request, context):
        """
        Servis sağlık kontrolü.
        
        Returns:
            HealthResponse: Model ve scaler durumu
        """
        model_status = "loaded" if self.model is not None else "not_loaded"
        scaler_status = "loaded" if self.scaler is not None else "not_loaded"
        healthy = self.model is not None and self.scaler is not None
        
        logger.info(f"Health check: model={model_status}, scaler={scaler_status}")
        
        return prediction_pb2.HealthResponse(
            healthy=healthy,
            model_status=model_status,
            scaler_status=scaler_status
        )


def serve():
    """gRPC sunucusunu başlat."""
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=MAX_WORKERS))
    prediction_pb2_grpc.add_PredictionServiceServicer_to_server(
        PredictionServicer(), server
    )
    
    server_address = f"[::]:{GRPC_PORT}"
    server.add_insecure_port(server_address)
    
    logger.info("=" * 50)
    logger.info("Kitap Satış Tahmin gRPC Servisi")
    logger.info("=" * 50)
    logger.info(f"Sunucu başlatılıyor: {server_address}")
    logger.info(f"Max workers: {MAX_WORKERS}")
    logger.info("=" * 50)
    
    server.start()
    logger.info("Sunucu çalışıyor. Durdurmak için Ctrl+C")
    
    try:
        server.wait_for_termination()
    except KeyboardInterrupt:
        logger.info("Sunucu kapatılıyor...")
        server.stop(grace=5)
        logger.info("Sunucu kapatıldı.")


if __name__ == "__main__":
    serve()



