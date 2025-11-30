const soap = require('soap');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const Citizen = require('./models/Citizen');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nvi_mock').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Define the service
const service = {
    IdentityService: {
        IdentityServiceSoap: {
            TCKimlikNoDogrula: async function (args) {
                console.log('TCKimlikNoDogrula called with:', args);

                try {

                    const tc = args.TCKimlikNo || args.tckimlikno;
                    const ad = args.Ad || args.ad;
                    const soyad = args.Soyad || args.soyad;
                    const yil = args.DogumYili || args.dogumyili;

                    if (!tc || !ad || !soyad || !yil) {
                        return { TCKimlikNoDogrulaResult: false };
                    }

                    const citizen = await Citizen.findOne({
                        tcKimlikNo: tc.toString(),
                        ad: ad.toUpperCase(),
                        soyad: soyad.toUpperCase(),
                        dogumYili: parseInt(yil)
                    });

                    if (citizen) {
                        return { TCKimlikNoDogrulaResult: true };
                    } else {
                        return { TCKimlikNoDogrulaResult: false };
                    }
                } catch (error) {
                    console.error('Error in TCKimlikNoDogrula:', error);
                    return { TCKimlikNoDogrulaResult: false };
                }
            }
        }
    }
};

// Load WSDL
const xml = fs.readFileSync('service.wsdl', 'utf8');

// Create Express app
const app = express();
app.use(bodyParser.raw({ type: function () { return true; }, limit: '5mb' }));

// Launch server
const port = 8000;
app.listen(port, function () {
    console.log('Listening on port ' + port);

    // Initialize SOAP Server
    soap.listen(app, '/wsdl', service, xml, function () {
        console.log('SOAP server initialized at http://localhost:' + port + '/wsdl?wsdl');
    });
});
