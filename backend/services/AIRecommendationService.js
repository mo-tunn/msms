const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../protos/prediction.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const predictionProto = grpc.loadPackageDefinition(packageDefinition).prediction;

// Python ML Engine address (assuming it runs on localhost:50051)
const ML_ENGINE_ADDRESS = 'localhost:50051';

class AIRecommendationService {
    constructor() {
        this.client = new predictionProto.PredictionService(
            ML_ENGINE_ADDRESS,
            grpc.credentials.createInsecure()
        );
    }

    getPrediction(features) {
        return new Promise((resolve, reject) => {
            this.client.Predict({ features }, (error, response) => {
                if (error) {
                    console.error('gRPC Error:', error);
                    return reject(error);
                }
                if (!response.success) {
                    console.error('Prediction Error:', response.error_message);
                    return reject(new Error(response.error_message));
                }
                resolve(response.predicted_sales);
            });
        });
    }
}

module.exports = new AIRecommendationService();
