import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network request
        setTimeout(() => {
            // Get credentials from environment variables
            const validEmail = import.meta.env.VITE_LOGIN_EMAIL;
            const validPassword = import.meta.env.VITE_LOGIN_PASSWORD;

            if (email === validEmail && password === validPassword) {
                onLogin(email);
            } else {
                setError('Credenciales inválidas. Verifique su email y contraseña.');
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-100 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg p-12 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                        SaaS-SIACLI
                    </h1>
                    <p className="text-slate-400 text-lg">Acceso Seguro a la Plataforma</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Correo Electrónico</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={20} className="text-slate-500" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-500 text-lg"
                                placeholder="admin@empresa.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={20} className="text-slate-500" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-500 text-lg"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-red-400 text-sm text-center bg-red-400/10 py-3 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Iniciar Sesión <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        Sistema protegido. Todos los accesos son monitoreados.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
