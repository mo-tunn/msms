const AIRecommendationService = require('./services/AIRecommendationService');

async function testPrediction() {
    console.log('Testing prediction with repeated FeatureEntry...');

    const specialKey = "Ana_Kategori_Felsefe-Düşünce";
    console.log(`Key: "${specialKey}"`);

    // Construct features as array of entries
    const featureEntries = [
        {
            key: Buffer.from(specialKey, 'utf8'),
            value: 1.0
        },
        {
            key: Buffer.from("Liste Fiyatı", 'utf8'),
            value: 100.0
        }
    ];

    try {
        console.log('Sending request...');
        const prediction = await AIRecommendationService.getPrediction(featureEntries);
        console.log('Prediction result:', prediction);
    } catch (error) {
        console.error('Prediction failed:', error.message);
        console.error(error);
    }
}

testPrediction();
