const AIRecommendationService = require('../services/AIRecommendationService');

exports.predictSales = async (req, res) => {
    try {
        const features = req.body;

        if (!features || Object.keys(features).length === 0) {
            return res.status(400).json({ error: 'Features are required' });
        }

        // Convert features to repeated FeatureEntry format
        // Keys are sent as bytes (Buffer) to avoid gRPC encoding issues
        const featureEntries = [];
        for (const [key, value] of Object.entries(features)) {
            featureEntries.push({
                key: Buffer.from(key, 'utf8'),
                value: parseFloat(value)
            });
        }

        console.log('[AIController] Sending prediction request with features:', featureEntries.length);

        const prediction = await AIRecommendationService.getPrediction(featureEntries);

        res.json({
            success: true,
            predicted_sales: prediction
        });
    } catch (error) {
        console.error('AI Controller Error:', error);
        res.status(500).json({
            success: false,
            error: 'Prediction service unavailable or failed'
        });
    }
};
