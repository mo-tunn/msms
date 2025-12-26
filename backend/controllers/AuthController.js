const AuthService = require('../services/AuthService');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    async register(req, res) {
        try {
            console.log('Register Request Body:', req.body);
            const result = await AuthService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async verifyIdentity(req, res) {
        try {
            const { tckn, first_name, last_name, birth_year } = req.body;
            const IdentityVerificationService = require('../services/IdentityVerificationService');
            const result = await IdentityVerificationService.verifyTCKN(tckn, first_name, last_name, birth_year);
            res.json({ verified: result });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
