import React, { useState, useContext } from 'react';
import { 
  User, Settings, Shield, Camera, Edit3, Save, X, Mail, Phone, MapPin, 
  Building, UserCheck, Key, Bell, Globe, Download, Activity, Eye, Calendar, ArrowRight
} from 'lucide-react';
import { AuthContext } from "../contexts/AuthContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  avatar: string;
  totalVisits: number;
  status: 'aktif' | 'nonaktif';
  lastSeen: string;
  joinDate: string;
}

const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string; color: 'blue' | 'green' | 'amber';}> = ({ icon: Icon, title, value, color }) => {
    const colors: Record<string, { bg: string, text: string }> = {
        'blue': { bg: 'from-blue-100 to-cyan-100', text: 'text-blue-700' },
        'green': { bg: 'from-green-100 to-emerald-100', text: 'text-green-600' },
        'amber': { bg: 'from-amber-100 to-yellow-100', text: 'text-amber-600' },
    };
    const c = colors[color] || { bg: 'from-gray-100 to-slate-100', text: 'text-gray-600'};

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${c.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className={`w-6 h-6 ${c.text}`} />
                </div>
            </div>
        </div>
    );
};

const AccountProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { auth } = useContext(AuthContext);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'USR-2025-001',
    name: auth.user?.name || "Guest",
    email: auth.user?.email || "Guest",
    phone: '+62 812-3456-7890',
    position: auth.user?.role === 'student' ? 'Mahasiswa' : 'Dosen',
    department: 'Universitas Gadjah Mada',
    location: 'Banda Aceh, Provinsi Aceh',
    avatar: 'https://placehold.co/128x128/e2e8f0/64748b?text=FJA',
    totalVisits: 1247,
    status: 'aktif',
    lastSeen: '2025-09-18T14:30:25Z',
    joinDate: '2023-01-15'
  });

  const [editForm, setEditForm] = useState<Omit<UserProfile, 'id' | 'avatar' | 'totalVisits' | 'status' | 'lastSeen' | 'joinDate'>>({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    position: userProfile.position,
    department: userProfile.department,
    location: userProfile.location
  });

  const handleSaveProfile = () => {
    setUserProfile(prev => ({ ...prev, ...editForm }));
    setIsEditing(false);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const ProfileSection: React.FC = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/60 shadow-lg text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <img src={userProfile.avatar} alt="User Avatar" className="rounded-full w-full h-full object-cover border-4 border-white shadow-md" />
            <button className="absolute bottom-1 right-1 p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition shadow-sm transform hover:scale-110">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{userProfile.name}</h2>
          <p className="text-gray-600">{userProfile.position}</p>
          <p className="text-sm text-gray-500">{userProfile.department}</p>
          <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            userProfile.status === 'aktif' 
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200' 
            : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200'
          }`}>
            <div className={`w-2 h-2 rounded-full shadow-sm ${userProfile.status === 'aktif' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            {userProfile.status.charAt(0).toUpperCase() + userProfile.status.slice(1)}
          </div>
        </div>
        <div className="space-y-6">
            <StatCard icon={Activity} title="Total Kunjungan" value={userProfile.totalVisits.toLocaleString('id-ID')} color="blue"/>
            <StatCard icon={Eye} title="Terakhir Dilihat" value={formatDate(userProfile.lastSeen)} color="green"/>
            <StatCard icon={Calendar} title="Tanggal Bergabung" value={formatDate(userProfile.joinDate)} color="amber"/>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/60 shadow-lg">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200/60 pb-4">
          <h3 className="text-xl font-bold text-gray-800">Detail Profil</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 shadow-sm"
          >
            {isEditing ? <X className="w-4 h-4 text-red-500"/> : <Edit3 className="w-4 h-4 text-blue-600" />}
            <span>{isEditing ? 'Batal' : 'Edit Profil'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: UserCheck, label: 'Nama Lengkap', key: 'name' },
            { icon: Mail, label: 'Email', key: 'email' },
            { icon: Phone, label: 'Nomor Telepon', key: 'phone' },
            { icon: Building, label: 'Jabatan', key: 'position' },
            { icon: Shield, label: 'Departemen', key: 'department' },
            { icon: MapPin, label: 'Lokasi', key: 'location' }
          ].map(({ icon: Icon, label, key }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                <Icon className="w-4 h-4 text-gray-500" />
                <span>{label}</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm[key as keyof typeof editForm]}
                  onChange={(e) => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200/60 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                />
              ) : (
                <p className="w-full px-4 py-2.5 bg-gray-50/60 text-gray-800 border border-gray-200/60 rounded-xl">
                  {userProfile[key as keyof typeof editForm]}
                </p>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200/60">
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-5 py-2.5 font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-xl hover:from-blue-800 hover:to-cyan-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const SettingsSection: React.FC = () => (
     <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/60 shadow-lg max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200/60 pb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl"><Settings className="w-6 h-6 text-blue-700" /></div>
            <div>
                <h3 className="text-xl font-bold text-gray-800">Pengaturan Umum</h3>
                <p className="text-gray-500">Sesuaikan preferensi aplikasi Anda</p>
            </div>
        </div>
        <div className="space-y-4">
          {[
            { icon: Globe, title: 'Bahasa', value: 'Indonesia', hasToggle: false },
            { icon: Bell, title: 'Notifikasi Email', value: 'Aktif', hasToggle: true, enabled: true },
            { icon: Download, title: 'Download Otomatis', value: 'Nonaktif', hasToggle: true, enabled: false },
          ].map(({ icon: Icon, title, value, hasToggle, enabled }, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/60 border border-gray-200/60">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold text-gray-700">{title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{value}</span>
                    {hasToggle ? (
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                    ) : <ArrowRight className="w-5 h-5 text-gray-400"/>}
                </div>
            </div>
          ))}
        </div>
     </div>
  );

  const SecuritySection: React.FC = () => (
     <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/60 shadow-lg max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200/60 pb-4">
            <div className="p-3 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl"><Shield className="w-6 h-6 text-red-600" /></div>
            <div>
                <h3 className="text-xl font-bold text-gray-800">Keamanan & Login</h3>
                <p className="text-gray-500">Kelola password dan keamanan akun Anda</p>
            </div>
        </div>
        <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gray-50/60 border border-gray-200/60">
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Ubah Password</label>
                <div className="space-y-3 mt-2">
                    <input type="password" placeholder="Password Saat Ini" className="w-full px-4 py-2.5 border border-gray-200/60 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm" />
                    <input type="password" placeholder="Password Baru" className="w-full px-4 py-2.5 border border-gray-200/60 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm" />
                    <input type="password" placeholder="Konfirmasi Password Baru" className="w-full px-4 py-2.5 border border-gray-200/60 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm" />
                </div>
                 <button className="mt-4 flex items-center gap-2 px-5 py-2.5 font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-xl hover:from-blue-800 hover:to-cyan-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                    <Key className="w-4 h-4"/>
                    <span>Update Password</span>
                </button>
            </div>
             <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
                <h4 className="font-semibold text-red-800">Hapus Akun</h4>
                <p className="text-sm text-red-700 mt-1">Tindakan ini tidak dapat diurungkan. Semua data Anda akan dihapus secara permanen.</p>
                <button className="mt-3 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition shadow-md">
                    Hapus Akun Saya
                </button>
            </div>
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-white sm:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="mb-8">
          <h1 className="text-3xl w-fit font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
            PROFIL AKUN
          </h1>
          <p className="mt-1 text-md text-gray-600">
            Kelola informasi profil, pengaturan, dan keamanan akun Anda.
          </p>
        </header>
        
        <div className="mb-8 flex items-center border-b border-gray-200/60">
          {[
            { id: 'profile', label: 'Profil', icon: User },
            { id: 'settings', label: 'Pengaturan', icon: Settings },
            { id: 'security', label: 'Keamanan', icon: Shield }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'profile' | 'settings' | 'security')}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors -mb-px ${
                activeTab === id
                  ? 'border-b-2 border-blue-700 text-blue-700'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'settings' && <SettingsSection />}
          {activeTab === 'security' && <SecuritySection />}
        </div>
        
      </div>
    </div>
  );
};

export default AccountProfile;