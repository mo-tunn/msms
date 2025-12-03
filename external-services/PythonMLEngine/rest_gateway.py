"""
REST to gRPC Gateway

Bu FastAPI uygulaması, REST API isteklerini alıp gRPC servisine yönlendirir.
Böylece hem REST hem de gRPC destekli bir yapı elde edilir.

Kullanım:
    uvicorn rest_gateway:app --host 0.0.0.0 --port 8000 --reload
    
Önce gRPC sunucusunun çalışıyor olması gerekir:
    python grpc_server.py
"""

import grpc
import os
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Proto'dan generate edilmiş dosyaları import et
import prediction_pb2
import prediction_pb2_grpc

# Konfigürasyon
GRPC_SERVER = os.getenv("GRPC_SERVER", "localhost:50051")


# Pydantic Modelleri
class PredictionInput(BaseModel):
    """Tahmin isteği için input modeli."""
    features: Dict[str, float] = Field(
        ...,
        description="Model özellikleri (feature adı -> değer)",
        example={
            "Favorilere Ekleyen Kişi Sayısı": 150.0,
            "Okuyacağım olarak işaretlenmiş sayısı": 200.0,
            "Okudum olarak işaretlenmiş sayısı": 100.0,
            "Liste Fiyatı": 89.0,
            "Sayfa Sayısı": 320.0,
            "Toplam Yorum Sayısı": 45.0,
            "Puan": 4.5,
            "Oy_Sayisi": 230.0,
            "Yayin_Yili": 2023.0,
            "En": 13.5,
            "Boy": 21.0,
            "Yazar_Kitap_Sayisi": 15.0
        }
    )


class PredictionOutput(BaseModel):
    """Tahmin yanıtı için output modeli."""
    success: bool
    predicted_sales: Optional[float] = None
    error_message: Optional[str] = None


class HealthOutput(BaseModel):
    """Sağlık kontrolü yanıtı."""
    healthy: bool
    model_status: str
    scaler_status: str
    grpc_connection: str


class FeaturesOutput(BaseModel):
    """Feature listesi yanıtı."""
    features: list[str]
    count: int


# gRPC Client Manager
class GRPCClient:
    """gRPC bağlantı yöneticisi."""
    
    def __init__(self, server_address: str):
        self.server_address = server_address
        self.channel = None
        self.stub = None
    
    def connect(self):
        """gRPC kanalını oluştur."""
        self.channel = grpc.insecure_channel(self.server_address)
        self.stub = prediction_pb2_grpc.PredictionServiceStub(self.channel)
    
    def close(self):
        """gRPC kanalını kapat."""
        if self.channel:
            self.channel.close()
    
    def is_connected(self) -> bool:
        """Bağlantı durumunu kontrol et."""
        return self.stub is not None


# Global gRPC client
grpc_client = GRPCClient(GRPC_SERVER)


# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Uygulama başlatma/kapatma işlemleri."""
    # Başlangıç
    grpc_client.connect()
    print(f"✓ gRPC bağlantısı kuruldu: {GRPC_SERVER}")
    yield
    # Kapatma
    grpc_client.close()
    print("✓ gRPC bağlantısı kapatıldı")


# FastAPI Uygulaması
app = FastAPI(
    title="Kitap Satış Tahmin REST Gateway",
    description="""
    Bu API, gRPC tabanlı Kitap Satış Tahmin Servisi'ne REST arayüzü sağlar.
    
    ## Özellikler
    - 📊 **Tahmin**: Kitap özelliklerine göre satış tahmini
    - 📋 **Features**: Model için gerekli özelliklerin listesi
    - 🏥 **Health Check**: Servis sağlık durumu
    
    ## Kullanım
    1. `/features` endpoint'inden gerekli özellikleri alın
    2. `/predict` endpoint'ine özellikleri gönderin
    """,
    version="2.0.0",
    lifespan=lifespan
)

# CORS ayarları (gerekirse)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- API Endpoints ---

@app.get("/", tags=["Info"])
async def root():
    """API bilgi endpoint'i."""
    return {
        "service": "Kitap Satış Tahmin REST Gateway",
        "version": "2.0.0",
        "grpc_backend": GRPC_SERVER,
        "endpoints": {
            "health": "/health",
            "features": "/features",
            "predict": "/predict"
        }
    }


@app.get("/health", response_model=HealthOutput, tags=["Health"])
async def health_check():
    """
    Servis sağlık kontrolü.
    
    gRPC backend'in ve modelin durumunu kontrol eder.
    """
    try:
        response = grpc_client.stub.HealthCheck(prediction_pb2.Empty())
        return HealthOutput(
            healthy=response.healthy,
            model_status=response.model_status,
            scaler_status=response.scaler_status,
            grpc_connection="connected"
        )
    except grpc.RpcError as e:
        return HealthOutput(
            healthy=False,
            model_status="unknown",
            scaler_status="unknown",
            grpc_connection=f"error: {e.code()}"
        )


@app.get("/features", response_model=FeaturesOutput, tags=["Model"])
async def get_features():
    """
    Modelin gerektirdiği özelliklerin listesini döndürür.
    
    Bu listedeki tüm özellikler tahmin isteğinde bulunmalıdır.
    """
    try:
        response = grpc_client.stub.GetFeatures(prediction_pb2.Empty())
        features_list = list(response.features)
        return FeaturesOutput(
            features=features_list,
            count=len(features_list)
        )
    except grpc.RpcError as e:
        raise HTTPException(
            status_code=503,
            detail=f"gRPC servisi erişilemez: {e.code()}"
        )


@app.post("/predict", response_model=PredictionOutput, tags=["Prediction"])
async def predict(input_data: PredictionInput):
    """
    Kitap satış tahmini yapar.
    
    Tüm gerekli özelliklerin (features) gönderilmesi gerekir.
    Özellik listesi için `/features` endpoint'ini kullanın.
    """
    try:
        # gRPC isteği oluştur
        request = prediction_pb2.PredictRequest(features=input_data.features)
        
        # Tahmin yap
        response = grpc_client.stub.Predict(request)
        
        return PredictionOutput(
            success=response.success,
            predicted_sales=response.predicted_sales if response.success else None,
            error_message=response.error_message if not response.success else None
        )
        
    except grpc.RpcError as e:
        raise HTTPException(
            status_code=503,
            detail=f"gRPC servisi erişilemez: {e.code()} - {e.details()}"
        )


# Doğrudan çalıştırma için
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



