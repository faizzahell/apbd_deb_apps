import { useState } from 'react';
import { 
  TrendingUp, DollarSign, MapPin, Building2, Users, 
  Calendar, Download, RefreshCw, BarChart3, PieChart,
  ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle2,
  Building, School, Heart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedProvince, setSelectedProvince] = useState('all');

  const overviewData = [
    { title: 'Total APBD Nasional', value: 'Rp 2.847 T', change: '+12.5%', trend: 'up', icon: DollarSign },
    { title: 'Jumlah Provinsi', value: '34', change: '0%', trend: 'neutral', icon: MapPin },
    { title: 'Kabupaten/Kota', value: '514', change: '+2', trend: 'up', icon: Building2 },
    { title: 'Realisasi Rata-rata', value: '87.3%', change: '+2.1%', trend: 'up', icon: TrendingUp }
  ];

  const trendData = [
    { year: '2019', total: 2150, belanja: 1980, pendapatan: 2100 },
    { year: '2020', total: 2280, belanja: 2120, pendapatan: 2250 },
    { year: '2021', total: 2450, belanja: 2280, pendapatan: 2400 },
    { year: '2022', total: 2620, belanja: 2450, pendapatan: 2580 },
    { year: '2023', total: 2750, belanja: 2580, pendapatan: 2720 },
    { year: '2024', total: 2847, belanja: 2680, pendapatan: 2820 }
  ];

  const provinceData = [
    { name: 'Jawa Barat', apbd: 89.2, realisasi: 92.1, color: '#1e40af' },
    { name: 'Jawa Timur', apbd: 76.8, realisasi: 88.5, color: '#1d4ed8' },
    { name: 'Jawa Tengah', apbd: 68.5, realisasi: 85.2, color: '#2563eb' },
    { name: 'Sumatera Utara', apbd: 52.3, realisasi: 81.7, color: '#3b82f6' },
    { name: 'DKI Jakarta', apbd: 82.7, realisasi: 94.3, color: '#1e3a8a' },
    { name: 'Sulawesi Selatan', apbd: 38.9, realisasi: 78.4, color: '#312e81' }
  ];

  const allocationData = [
    { name: 'Pendidikan', value: 28.5, amount: 812, color: '#1e40af', icon: School },
    { name: 'Kesehatan', value: 18.2, amount: 518, color: '#1d4ed8', icon: Heart },
    { name: 'Infrastruktur', value: 22.8, amount: 649, color: '#2563eb', icon: Building },
    { name: 'Sosial', value: 15.3, amount: 436, color: '#3b82f6', icon: Users },
  ];

  const recentActivities = [
    { province: 'DKI Jakarta', action: 'Realisasi Q3 mencapai 78.5%', time: '2 jam lalu', status: 'success' },
    { province: 'Jawa Barat', action: 'Penyesuaian alokasi sektor pendidikan', time: '4 jam lalu', status: 'info' },
    { province: 'Sumatera Barat', action: 'Keterlambatan realisasi infrastruktur', time: '6 jam lalu', status: 'warning' },
    { province: 'Bali', action: 'Target Q3 tercapai 95.2%', time: '8 jam lalu', status: 'success' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(value * 1000000000000);
  };

  return (
    <div className="min-h-screen bg-white sm:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl w-fit font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              DASHBOARD MONITORING APBD
            </h1>
            <p className="text-gray-600 mt-2 font-medium">Monitoring penyebaran dan realisasi APBD di seluruh Indonesia</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2.5 border border-gray-200/60 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            
            <select 
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="px-4 py-2.5 border border-gray-200/60 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <option value="all">Semua Provinsi</option>
              <option value="jawa">Pulau Jawa</option>
              <option value="sumatera">Pulau Sumatera</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-xl hover:from-blue-800 hover:to-cyan-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
              <Download className="w-4 h-4" />
              <span className="font-medium">Export</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200/60 text-gray-700 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 shadow-sm">
              <RefreshCw className="w-4 h-4" />
              <span className="font-medium">Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-semibold px-2 py-1 rounded-lg ${
                    item.trend === 'up' ? 'text-green-700 bg-green-50' : 
                    item.trend === 'down' ? 'text-red-700 bg-red-50' : 'text-gray-600 bg-gray-50'
                  }`}>
                    {item.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                    {item.trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
                    <span>{item.change}</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-semibold mb-1 uppercase tracking-wide">{item.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Trend APBD Nasional</h3>
                <p className="text-gray-600 text-sm font-medium">Perkembangan APBD dari tahun ke tahun</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} fontWeight={500} />
                  <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${formatCurrency(value)}`, 'Total APBD']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#1e40af" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Alokasi per Sektor</h3>
                <p className="text-gray-600 text-sm font-medium">Distribusi anggaran berdasarkan sektor</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            
            <div className="space-y-4">
              {allocationData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200/60">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: `${item.color}15` }}>
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600 font-medium">{formatCurrency(item.amount)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{item.value}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Performa Provinsi</h3>
                <p className="text-gray-600 text-sm font-medium">Realisasi APBD per provinsi</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            
            <div className="space-y-4">
              {provinceData.map((province, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-200/60 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-blue-800 font-bold text-sm shadow-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{province.name}</p>
                      <p className="text-sm text-gray-600 font-medium">APBD: {formatCurrency(province.apbd)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 mb-1">{province.realisasi}%</p>
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full rounded-full transition-all duration-300 shadow-sm"
                        style={{ 
                          width: `${province.realisasi}%`,
                          background: `linear-gradient(90deg, ${province.color}, ${province.color}dd)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Aktivitas Terkini</h3>
                <p className="text-gray-600 text-sm font-medium">Update terbaru sistem</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 shadow-sm ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{activity.province}</p>
                    <p className="text-gray-600 text-sm font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-xs mt-1 font-medium">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-2.5 text-blue-700 hover:bg-blue-50 rounded-xl transition-colors duration-200 text-sm font-semibold border border-blue-100 hover:border-blue-200">
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm rounded-xl border border-blue-100/60 p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-cyan-800 bg-clip-text text-transparent">
              Statistik Cepat
            </h3>
            <p className="text-gray-600 mt-2 font-medium">Ringkasan data APBD Indonesia tahun {selectedYear}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <TrendingUp className="w-8 h-8 text-blue-700" />
              </div>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
              <p className="text-gray-600 text-sm font-semibold">Avg Realisasi</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">87%</p>
              <p className="text-gray-600 text-sm font-semibold">Target Tercapai</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">13%</p>
              <p className="text-gray-600 text-sm font-semibold">Perlu Perhatian</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Q3</p>
              <p className="text-gray-600 text-sm font-semibold">Periode Aktif</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;