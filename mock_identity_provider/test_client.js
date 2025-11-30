const soap = require('soap');

const url = 'http://localhost:8000/wsdl?wsdl';

const argsCorrect = {
    TCKimlikNo: 11111111111,
    Ad: 'AHMET',
    Soyad: 'YILMAZ',
    DogumYili: 1990
};

const argsIncorrect = {
    TCKimlikNo: 11111111111,
    Ad: 'AHMET',
    Soyad: 'YANLIS',
    DogumYili: 1990
};

soap.createClient(url, function (err, client) {
    if (err) {
        console.error('Error creating client:', err);
        return;
    }

    // Test with correct data
    client.TCKimlikNoDogrula(argsCorrect, function (err, result) {
        if (err) {
            console.error('Error in correct call:', err);
        } else {
            console.log('Correct Data Result:', result);
        }
    });

    // Test with incorrect data
    client.TCKimlikNoDogrula(argsIncorrect, function (err, result) {
        if (err) {
            console.error('Error in incorrect call:', err);
        } else {
            console.log('Incorrect Data Result:', result);
        }
    });
});
