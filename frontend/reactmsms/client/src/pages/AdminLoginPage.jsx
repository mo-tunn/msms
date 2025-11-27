import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'admin123') { // Mock secret password
            navigate('/admin/dashboard');
        } else {
            setError('Geçersiz yönetici şifresi.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-red-500/10 rounded-full mb-4">
                        <span className="material-symbols-outlined text-4xl text-red-500">admin_panel_settings</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Yönetici Erişimi</h1>
                    <p className="text-gray-400 text-sm mt-2">Lütfen gizli erişim kodunu giriniz.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white text-center text-2xl tracking-widest rounded-lg py-4 px-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-600"
                            placeholder="••••••••"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-red-600/20"
                    >
                        Giriş Yap
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
