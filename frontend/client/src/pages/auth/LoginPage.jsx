import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { login } from '../../services/api';
import { setAuth, getAuth } from '../../utils/authUtils';

const LoginPage = () => {
    const navigate = useNavigate();

    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const auth = getAuth();
        if (auth) {
            const { user } = auth;
            if (user.role_id === 1) navigate('/admin/dashboard');
            else if (user.role_id === 2) navigate('/mentor/ana-sayfa');
            else navigate('/student/ana-sayfa');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;
        const rememberMe = e.target['remember-me'].checked;

        try {
            const data = await login(email, password);
            setAuth(data.token, data.user, rememberMe);

            if (data.user.role_id === 1) { // Assuming 1 is Admin
                navigate('/admin/dashboard');
            } else if (data.user.role_id === 2) { // Mentor
                navigate('/mentor/ana-sayfa');
            } else {
                navigate('/student/ana-sayfa');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col md:flex-row bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Admin Login Link */}
            <div className="absolute top-4 right-4 z-10">
                <Link
                    to="/admin/login"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                    Yönetici Girişi
                </Link>
            </div>

            {/* Left Side - Image & Branding */}
            <div className="relative hidden w-full md:flex md:w-1/2 lg:w-2/3 flex-col justify-between overflow-hidden bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        alt="Education Background"
                        className="h-full w-full object-cover opacity-60"
                        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                </div>

                <div className="relative z-10 p-12">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                            <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">MSMS</span>
                    </div>
                </div>

                <div className="relative z-10 p-12">
                    <h2 className="mb-4 text-4xl font-bold text-white leading-tight">
                        Geleceğini Şansa Bırakma,<br />
                        <span className="text-primary">Planla ve Başar!</span>
                    </h2>
                    <p className="max-w-md text-lg text-gray-300 leading-relaxed">
                        Yapay zeka destekli analizler, kişiselleştirilmiş çalışma programları ve uzman mentor desteği ile hedeflerine ulaşmak artık çok daha kolay.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full items-center justify-center p-8 md:w-1/2 lg:w-1/3">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Hoş Geldiniz</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Hesabınıza giriş yaparak çalışmalarınıza devam edin.
                        </p>
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    E-posta Adresi
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 text-xl">mail</span>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-colors"
                                        placeholder="ornek@ogrenci.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Şifre
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                                            Beni hatırla
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                            Şifremi unuttum?
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-primary/30"
                            >
                                Giriş Yap
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                                    Henüz hesabınız yok mu?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                Hemen kayıt olun
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
