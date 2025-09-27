import React, { useState } from 'react';
import { FileText, Download, ArrowRight, BookMarked, Landmark, Search } from 'lucide-react';
import SourceDataCard from './SourceDataCard';

interface DataSource {
  id: string;
  title: string;
  type: 'UU APBN' | 'Perpres' | 'Nota Keuangan' | 'Lainnya';
  description: string;
  fileUrl: string;
}

const dataSources: Record<string, DataSource[]> = {
  '2025': [
    {
      id: '2025-uu',
      title: 'UU APBN 2025',
      type: 'UU APBN',
      description: 'Undang-Undang Anggaran Pendapatan dan Belanja Negara (APBN) untuk tahun fiskal 2025.',
      fileUrl: '#',
    },
    {
      id: '2025-perpres',
      title: 'Perpres No. 12 Tahun 2025',
      type: 'Perpres',
      description: 'Rincian Anggaran Pendapatan dan Belanja Negara (APBN) tahun anggaran 2025.',
      fileUrl: '#',
    },
    {
      id: '2025-nota',
      title: 'Nota Keuangan 2025',
      type: 'Nota Keuangan',
      description: 'Dokumen nota keuangan beserta APBN 2025 yang disampaikan oleh pemerintah kepada DPR.',
      fileUrl: '#',
    },
  ],
  '2024': [
    {
      id: '2024-uu',
      title: 'UU APBN 2024',
      type: 'UU APBN',
      description: 'Dokumen final Undang-Undang Anggaran Pendapatan dan Belanja Negara untuk tahun 2024.',
      fileUrl: '#',
    },
    {
      id: '2024-nota',
      title: 'Nota Keuangan 2024',
      type: 'Nota Keuangan',
      description: 'Analisis dan rincian lengkap mengenai postur APBN tahun anggaran 2024.',
      fileUrl: '#',
    },
     {
      id: '2024-lainnya',
      title: 'Laporan Semester I APBN 2024',
      type: 'Lainnya',
      description: 'Laporan realisasi anggaran semester pertama dan prognosis semester kedua tahun 2024.',
      fileUrl: '#',
    },
  ],
  '2023': [
    {
      id: '2023-uu',
      title: 'UU APBN 2023',
      type: 'UU APBN',
      description: 'Dasar hukum pelaksanaan Anggaran Pendapatan dan Belanja Negara untuk tahun 2023.',
      fileUrl: '#',
    },
    {
      id: '2023-perpres',
      title: 'Perpres Rincian APBN 2023',
      type: 'Perpres',
      description: 'Peraturan Presiden yang merinci alokasi anggaran dalam APBN tahun 2023.',
      fileUrl: '#',
    },
  ],
};

const SourceCard: React.FC<{ source: DataSource }> = ({ source }) => {
  
  const getTypeStyle = (type: DataSource['type']) => {
    switch (type) {
      case 'UU APBN':
        return { bg: 'from-blue-100 to-cyan-100', text: 'text-blue-700', border: 'border-blue-200', icon: Landmark };
      case 'Perpres':
        return { bg: 'from-green-100 to-emerald-100', text: 'text-green-700', border: 'border-green-200', icon: BookMarked };
      case 'Nota Keuangan':
        return { bg: 'from-amber-100 to-yellow-100', text: 'text-amber-700', border: 'border-amber-200', icon: FileText };
      default:
        return { bg: 'from-gray-100 to-slate-100', text: 'text-gray-700', border: 'border-gray-200', icon: FileText };
    }
  };

  const style = getTypeStyle(source.type);
  const Icon = style.icon;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-lg p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br ${style.bg} rounded-xl shadow-sm`}>
            <Icon className={`w-6 h-6 ${style.text}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{source.title}</h3>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}>
              {source.type}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-600 mt-4 text-sm flex-grow">
        {source.description}
      </p>
      <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center justify-end gap-3">
        <button className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold border border-gray-200/60 text-gray-700 bg-white/90 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 shadow-sm">
          <span>Lihat Detail</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <a
          href={source.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-xl hover:from-blue-800 hover:to-cyan-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Unduh</span>
        </a>
      </div>
    </div>
  );
};


const SumberInformasi: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('2025');

  const currentData = dataSources[selectedYear] || [];

  return (
    <div className="min-h-screen bg-white sm:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl w-fit font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              SUMBER INFORMASI          
            </h1>
            <p className="mt-1 text-md text-gray-600">
              Dokumen resmi yang menjadi landasan data Anggaran Pendapatan dan Belanja Daerah (APBD).
            </p>
          </div>
        </div>

        <div className="mb-8 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/60 shadow-lg flex items-center gap-4">
            <label htmlFor="year-select" className="font-semibold text-gray-700">
                Pilih Tahun Anggaran:
            </label>
            <select 
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2.5 border border-gray-200/60 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
            </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentData.length > 0 ? (
            currentData.map((source) => <SourceCard key={source.id} source={source} />)
          ) : (
            <div className="col-span-full text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-lg">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-slate-100 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-800">Data Tidak Tersedia</h3>
                  <p className="mt-1 text-sm text-gray-500">
                      Sumber informasi untuk tahun {selectedYear} tidak ditemukan.
                  </p>
                </div>
            </div>
          )}
        </div>
        <SourceDataCard />
      </div>
    </div>
  );
};

export default SumberInformasi;