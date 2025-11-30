const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const wsdlUrl = 'http://localhost:8000/wsdl?wsdl';

app.use(bodyParser.json());

app.post('/verify', async (req, res) => {
    const { TCKimlikNo, Ad, Soyad, DogumYili } = req.body;

    if (!TCKimlikNo || !Ad || !Soyad || !DogumYili) {
        return res.status(400).json({ error: 'Missing required fields: TCKimlikNo, Ad, Soyad, DogumYili' });
    }

    try {
        const client = await soap.createClientAsync(wsdlUrl);

        const args = {
            TCKimlikNo: TCKimlikNo,
            Ad: Ad,
            Soyad: Soyad,
            DogumYili: DogumYili
        };

        // The method name in WSDL is TCKimlikNoDogrula
        // soap package usually exposes methods as properties of the client
        // We can also use client.TCKimlikNoDogrulaAsync if promisified, but createClientAsync returns a client that supports Async suffix methods? 
        // Actually, createClientAsync returns a client. The client methods usually have Async suffix if we use `soap` v0.x or v1.x?
        // Let's check `soap` documentation or just use the callback version wrapped in promise or try Async suffix.
        // Modern `soap` package supports Async suffix for all methods.

        const [result] = await client.TCKimlikNoDogrulaAsync(args);

        // Result structure depends on WSDL. 
        // WSDL says output is TCKimlikNoDogrulaResponse -> TCKimlikNoDogrulaResult (boolean)

        res.json({
            success: result.TCKimlikNoDogrulaResult
        });

    } catch (error) {
        console.error('SOAP Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Wrapper service listening at http://localhost:${port}`);
});
