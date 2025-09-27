import { X, Settings, Globe, Bell, Download, ArrowRight } from "lucide-react";
import { useEffect } from "react";

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const settingsOptions = [
    { icon: Globe, title: "Bahasa", value: "Indonesia", hasToggle: false },
    { icon: Bell, title: "Notifikasi Email", value: "Aktif", hasToggle: true, enabled: true },
    { icon: Download, title: "Download Otomatis", value: "Nonaktif", hasToggle: true, enabled: false },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl transform transition-all duration-300 ease-out">
        <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group"
          >
            <X className="w-5 h-5 text-gray-700 group-hover:text-black" />
          </button>

          <div className="flex items-center gap-4 mb-6 border-b border-gray-200/60 pb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
              <Settings className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Pengaturan Umum</h3>
              <p className="text-gray-500">Sesuaikan preferensi aplikasi Anda</p>
            </div>
          </div>

          <div className="space-y-4">
            {settingsOptions.map(({ icon: Icon, title, value, hasToggle, enabled }, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50/60 border border-gray-200/60"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-700">{title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{value}</span>
                  {hasToggle ? (
                    <div
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        enabled ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </div>
                  ) : (
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
