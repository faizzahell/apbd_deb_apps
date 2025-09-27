import { useState, useRef, useEffect } from "react";
import { X, Shield } from "lucide-react";
import Notification from "../../components/Notifications";
import { useVerifyCode } from "../../hooks/useVerifyCode";
import { useNotification } from "../../hooks/useNotifications";

interface VerifyModalProps {
  email: string;
  onClose: () => void;
  onSuccessVerify: () => void;
}

const VerifyModal = ({ email, onClose, onSuccessVerify }: VerifyModalProps) => {
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { notifications, showError, hideNotification } = useNotification();

  const handleVerifyCode = useVerifyCode();

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value.slice(-1);
    setCodes(newCodes);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const pastedCode = text.replace(/\D/g, "").slice(0, 6);
        const newCodes = [...codes];
        for (let i = 0; i < 6; i++) {
          newCodes[i] = pastedCode[i] || "";
        }
        setCodes(newCodes);
        const lastFilledIndex = pastedCode.length - 1;
        const focusIndex = Math.min(lastFilledIndex + 1, 5);
        inputRefs.current[focusIndex]?.focus();
      });
    }
  };

  const handleVerify = async () => {
    setError("");

    const fullCode = codes.join("");
    if (fullCode.length !== 6) {
      setError("Kode verifikasi harus 6 digit.");
      return;
    }

    try {
      setLoading(true);
      const payload = { email, code: fullCode };
      await handleVerifyCode(payload)
      onClose();
      onSuccessVerify();
    } catch {
      showError(
        "Verifikasi Gagal!",
        "Kode verifikasi salah atau telah kadaluarsa. Silahkan coba lagi."
      );
      setError("Kode verifikasi salah atau server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleResendCode = () => {
    console.log("Resending code to:", email);
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md transform transition-all duration-300 ease-out">
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white group-hover:text-gray-200" />
          </button>

          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifikasi Email</h2>
            <p className="text-white/90 text-sm leading-relaxed">
              Kami telah mengirimkan kode verifikasi ke
            </p>
            <p className="text-cyan-200 font-semibold text-sm mt-1 break-all">{email}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/90 text-center">
                Masukkan Kode Verifikasi
              </label>
              
              <div className="flex justify-center gap-3">
                {codes.map((code, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    value={code}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                    maxLength={1}
                    disabled={loading}
                    placeholder="•"
                  />
                ))}
              </div>
              
              {error && (
                <div className="flex items-center justify-center space-x-2 text-red-300 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                Batal
              </button>
              <button
                onClick={handleVerify}
                disabled={loading || codes.join("").length !== 6}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  "Verifikasi"
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 text-center">
            <p className="text-white/70 text-xs">
              Tidak menerima kode?{' '}
              <button 
                onClick={handleResendCode}
                className="text-cyan-300 hover:text-cyan-200 font-medium underline transition-colors duration-200"
              >
                Kirim ulang
              </button>
            </p>
          </div>
        </div>

        <div className="absolute -top-4 -left-4 w-8 h-8 bg-cyan-400/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-blue-500/10 rounded-full animate-pulse delay-1000"></div>
      </div>
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
  );
};

export default VerifyModal;