import { useState } from "react";
import { Mail, Lock } from "lucide-react";

import loginSchema from "../../schemas/auth/loginSchema";
import type { LoginPayload } from "../../types/auth";
import { useNavigate } from 'react-router-dom';
import { useToken } from "../../hooks/useToken";

const logo = "/logo-ugm.png";

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginPayload>({ username: "", password: "" });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleLogin = useToken();

  const validate = (): boolean => {
    const { error } = loginSchema.validate(formData, { abortEarly: false });
    if (error) {
      const validationErrors: { [key: string]: string } = {};
      error.details.forEach((detail) => {
        const field = detail.path[0] as string;
        validationErrors[field] = detail.message;
      });
      setErrors(validationErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    try {
      setLoading(true);
      await handleLogin(formData);
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(https://simaster.ugm.ac.id/ugmfw-assets-metronics8/media/ugm/bg-1200.jpg)` }} />

      <div className="relative w-full max-w-5xl flex overflow-hidden rounded-2xl shadow-2xl bg-white">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-cyan-600 to-blue-800 p-12 flex-col justify-between text-white">
          <div>
            <img src={logo} alt="Logo UGM" className="h-16 mb-12" />
            <h1 className="text-3xl font-bold mb-6">APBD OpenSource <br /> untuk Mahasiswa dan Dosen</h1>
            <p className="text-lg opacity-90 mb-4">
              Sistem Informasi Penyaluran APBD <br />
              Departemen Ekonomika dan Bisnis - Sekolah Vokasi Universitas Gadjah Mada
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cyan-600 bg-opacity-30 flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6" />
                </div>
                <span>Pantau penyaluran APBD dengan mudah</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cyan-600 bg-opacity-30 flex items-center justify-center mr-4">
                  <Lock className="w-6 h-6" />
                </div>
                <span>Akses sistem secara aman</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cyan-600 bg-opacity-30 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <span>Dukungan akses dari mana saja</span>
              </div>
              <div className="mt-6"><p className="text-sm opacity-70">© 2025 Ekonomika dan Bisnis.</p></div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="md:hidden flex justify-center mb-8">
            <img src={logo} alt="Viaeight Logo" className="h-16" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">Selamat Datang Kembali</h2>
          <p className="text-gray-600 mb-8 text-center md:text-left">Masuk untuk mengakses sistem penyaluran APBD</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Email UGM
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="username"
                  type="email"
                  name="username"
                  placeholder="Masukkan email UGM"
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                    ${errors.username ? "border-red-500" : "border-gray-300"}`}
                  autoComplete="username"
                  disabled={loading}
                  required
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm font-medium text-cyan-600 hover:text-cyan-500">
                  Lupa password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                    ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none hover:cursor-pointer"
                  disabled={loading}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {serverError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors hover:cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Memuat...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum memiliki akun?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-sm font-medium text-cyan-600 hover:text-cyan-500 hover:cursor-pointer"
              >
                Daftar di sini
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <div className="mt-20 text-center text-sm text-gray-500"><p>© 2025 Ekonomika dan Bisnis. All rights reserved.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
