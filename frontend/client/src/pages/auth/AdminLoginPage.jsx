import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuth, getAuth } from '../../utils/authUtils';
import { login } from '../../services/api';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const auth = getAuth();
        if (auth) {
            try {
                const { user } = auth;
                if (user.role_id === 1) navigate('/admin/dashboard');
            } catch (e) {
                // Invalid user data
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);

            if (data.user.role_id === 1) { // Admin role check
                setAuth(data.token, data.user, true); // Admin defaults to persistent login for now
                navigate('/admin/dashboard');
            } else {
                setError('Bu hesaba yönetici erişim yetkisi yok.');
            }
        } catch (err) {
            setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-red-500/10 rounded-full mb-4">
                        <span className="material-symbols-outlined text-4xl text-red-500">admin_panel_settings</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Yönetici Girişi</h1>
                    <p className="text-gray-400 text-sm mt-2">Yönetici hesabınızla giriş yapın.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">E-posta Adresi</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-600"
                            placeholder="admin@msms.com"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                Giriş Yapılıyor...
                            </>
                        ) : (
                            'Giriş Yap'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                        Öğrenci Girişine Dön
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
