const soap = require('soap');

class IdentityVerificationService {
    constructor() {
        this.wsdlUrl = process.env.MOCK_IDP_URL || 'http://localhost:3001/mernis?wsdl';
    }

    async verifyTCKN(tckn, firstName, lastName, birthYear) {
        try {
            const client = await soap.createClientAsync(this.wsdlUrl);

            const args = {
                TCKimlikNo: tckn,
                Ad: firstName,
                Soyad: lastName,
                DogumYili: birthYear
            };

            const result = await client.TCKimlikNoDogrulaAsync(args);
            // Result structure depends on the SOAP service, usually result[0].TCKimlikNoDogrulaResult
            return result[0].TCKimlikNoDogrulaResult;
        } catch (error) {
            console.error('Identity Verification Error:', error);
            throw new Error('Identity verification failed');
        }
    }
}

module.exports = new IdentityVerificationService();
