import { useState } from "react";
import { Mail, Lock } from "lucide-react";

import registerSchema from "../../schemas/auth/registerSchema";
import type { RegisterPayload } from "../../types/auth";
import { useNavigate } from 'react-router-dom';
import { useRegister } from "../../hooks/useRegister";
import { useNotification } from "../../hooks/useNotifications";
import VerifyModal from "./VerifyModal";
import Notification from "../../components/Notifications";

const logo = "/logo-ugm.png";

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const navigate = useNavigate();
  const handleRegister = useRegister();
  const { notifications, showSuccess, hideNotification } = useNotification();

  const validate = (): boolean => {
    const { error } = registerSchema.validate(formData, { abortEarly: false });
    if (error) {
      const validationErrors: Record<string, string> = {};
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
      await handleRegister(formData);
      setRegisteredEmail(formData.email);
      setShowVerifyModal(true);
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
            <img src={logo} alt="Viaeight Logo" className="h-16 mb-12" />
            <h1 className="text-3xl font-bold mb-6">Buat Akun Pengguna Baru</h1>
            <p className="text-lg opacity-90 mb-4">
              Akses Sistem Informasi Penyaluran APBD <br />
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

          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">Daftar Akun Baru</h2>
          <p className="text-gray-600 mb-8 text-center md:text-left">Pastikan menggunakan email UGM untuk registrasi</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                    ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  autoComplete="name"
                  disabled={loading}
                  required
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

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
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Masukkan email UGM"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                    ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={"password"}
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
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Konfirmasi Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type={"password"}
                  name="confirmPassword"
                  placeholder="Masukkan konfirmasi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                    ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
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
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-cyan-600 hover:text-cyan-500 hover:cursor-pointer"
              >
                Masuk di sini
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <div className="text-center text-sm text-gray-500"><p>© 2025 Ekonomika dan Bisnis. All rights reserved.</p></div>
          </div>

          {showVerifyModal && (
            <VerifyModal
              email={registeredEmail}
              onClose={() => setShowVerifyModal(false)}
              onSuccessVerify={() => {
              showSuccess(
                "Verifikasi Berhasil!",
                "Pendaftaran berhasil. Silahkan login untuk melanjutkan ke dashboard."
              );
              setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
            }}
            />
          )}

          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              show={notification.show}
              onClose={() => hideNotification(notification.id)}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              duration={notification.duration}
              position={notification.position}
            />
          ))}

          <style>{`
            @keyframes shrink {
              0% { transform: scaleX(1); }
              100% { transform: scaleX(0); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
