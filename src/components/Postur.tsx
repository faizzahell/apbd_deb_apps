/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Download, Eye, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, BarChart3, Percent,
  ChevronDown, ChevronRight, RefreshCw, Calendar,
  type LucideIcon
} from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';
import * as Papa from 'papaparse';

import { regionOptions } from '../constants/regions';
import { periodOptions, months, yearOptions } from '../constants/periods';

import type { APBDItem, APBDData, CSVRow, CacheData, StatusType, APBDSummary } from '../types/apbd';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  color: "blue" | "red" | "green" | "slate";
  description?: string;
  isPercentage?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  color,
  description,
  isPercentage = false,
}) => {
  const colors: Record<string, { iconBg: string; iconText: string }> = {
    blue: { iconBg: "from-blue-100 to-cyan-100", iconText: "text-blue-700" },
    red: { iconBg: "from-red-100 to-rose-100", iconText: "text-red-600" },
    green: { iconBg: "from-green-100 to-emerald-100", iconText: "text-green-600" },
    slate: { iconBg: "from-gray-100 to-slate-100", iconText: "text-gray-600" },
  };
  const c = colors[color] || colors.slate;

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1000;
    const from = 0;
    const to = value;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = from + (to - from) * progress;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  const formatNumber = (num: number) => {
    if (isPercentage) {
      return `${num.toFixed(1)}%`;
    }
    return new Intl.NumberFormat("id-ID").format(Math.round(num));
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${c.iconBg} rounded-xl flex items-center justify-center shadow-sm`}
        >
          <Icon className={`w-6 h-6 ${c.iconText}`} />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-semibold mb-1 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 mb-2">
        {formatNumber(displayValue)}
      </p>
      {description && (
        <p className="text-xs text-gray-500 font-medium">{description}</p>
      )}
    </div>
  );
};

const PosturAPBD: React.FC = () => {
  const now = new Date();
  const currentMonth = (now.getMonth() + 1).toString();
  const currentYear = now.getFullYear().toString();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [selectedRegion, setSelectedRegion] = useState<string>('--');
  const [subRegionList, setSubRegionList] = useState<Record<string, string>>({});
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>('--');
  const [expandedSections, setExpandedSections] = useState<string[]>(['pendapatan', 'belanja', 'pembiayaan']);
  const [showOnlyAlert, setShowOnlyAlert] = useState<boolean>(false);
  const [apbdData, setApbdData] = useState<APBDData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [download, setDownload] = useState(false);

  const handleDownload = async () => {
    try {
      setDownload(true);

      const url =
        `https://djpk.kemenkeu.go.id/portal/csv_apbd?type=apbd&periode=${selectedPeriod}&tahun=${selectedYear}&provinsi=${selectedRegion}&pemda=${selectedSubRegion}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Gagal mengambil file CSV");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `apbd_${selectedPeriod}_${selectedYear}_${selectedRegion === "--" ? "provinsi" : selectedRegion}_${selectedSubRegion === "--" ? "pemda" : selectedSubRegion}.csv`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Terjadi kesalahan saat mendownload CSV");
    } finally {
      setDownload(false);
    }
  };

  const generateCacheKey = (periode: string, tahun: string, provinsi: string, pemda: string): string => {
    return `apbd_cache_${tahun}_${periode}_${provinsi}_${pemda}`;
  };

  const saveToCache = (data: APBDData, key: string): void => {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
        key
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };

   const getFromCache = (key: string): APBDData | null => {
    try {
      const cachedData = localStorage.getItem(key);
      if (!cachedData) return null;

      const parsed: CacheData = JSON.parse(cachedData);
      
      const CACHE_DURATION = 24 * 60 * 60 * 1000; 
      const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Failed to get from localStorage:', error);
      return null;
    }
  };

  const cleanupOldCache = (): void => {
    try {
      const keys = Object.keys(localStorage);
      const apbdKeys = keys.filter(key => key.startsWith('apbd_cache_'));
      
      apbdKeys.forEach(key => {
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
          try {
            const parsed: CacheData = JSON.parse(cachedData);
            const CACHE_DURATION = 24 * 60 * 60 * 1000;
            const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
            
            if (isExpired) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to cleanup cache:', error);
    }
  };

  const refrash = async () => {
    try {
      setRefreshing(true);          
      await fetchAPBDData(true);        
    } finally {
      setRefreshing(false);
    }
  };

  const parseCurrency = (currencyStr: string): number => {
    return parseFloat(currencyStr.replace(/[^\d,]/g, '').replace(',', '.'));
  };

  const determineStatus = (percentage: number): StatusType => {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 75) return 'good';
    if (percentage >= 50) return 'normal';
    if (percentage >= 25) return 'warning';
    if (percentage > 0) return 'alert';
    return 'critical';
  };

  const generateId = (kategori: string): string => {
    return kategori.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const buildHierarchy = (csvData: CSVRow[]): APBDItem[] => {
    const result: APBDItem[] = [];
    let currentParent: APBDItem | null = null;

    const parentNames = [
      "Pendapatan Daerah",
      "Belanja Daerah",
      "Pembiayaan Daerah"
    ];

    csvData.forEach((row, index) => {
      const kategori = row.akun.trim();

      const item: APBDItem = {
        id: `${generateId(kategori)}_${index}`,
        kategori,
        anggaran: parseCurrency(row.anggaran),
        realisasi: parseCurrency(row.realisasi),
        persentase: row.persentase,
        status: determineStatus(row.persentase),
        children: []
      };

      if (parentNames.includes(kategori)) {
        result.push(item);
        currentParent = item;
      } 
      else if (currentParent) {
        currentParent.children?.push(item);
      }
    });

    return result;
  };


  const fetchAPBDData = async (forceRefresh: boolean = false) => {
    setLoading(true);
    setError(null);

    const cacheKey = generateCacheKey(selectedPeriod, selectedYear, selectedRegion, selectedSubRegion);
    console.log(cacheKey)

    if (!forceRefresh) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        setApbdData(cachedData);
        setLoading(false);
        return;
      }
    }
    
    try {
      const url = `https://djpk.kemenkeu.go.id/portal/csv_apbd?type=apbd&periode=${selectedPeriod}&tahun=${selectedYear}&provinsi=${selectedRegion}&pemda=${selectedSubRegion}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvText = await response.text();
      
      const parsed = Papa.parse<CSVRow>(csvText, {
        header: true,
        delimiter: ',',
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header: string) => header.trim().toLowerCase()
      });

      if (parsed.errors.length > 0) {
        console.warn('CSV parsing errors:', parsed.errors);
      }

      const csvData = parsed.data as CSVRow[];
      
      const hierarchicalData = buildHierarchy(csvData);
      
      const selectedPeriodLabel = periodOptions.find(p => p.value === selectedPeriod)?.label || months[parseInt(selectedPeriod) - 1];
      
      const summary: APBDSummary = {
        totalPemda: csvData.length > 0 ? 546 : 0, 
        lastUpdate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        dataType: 'APBD Murni/Perubahan',
        period: `s.d ${selectedPeriodLabel} ${selectedYear}`
      };

      const newData: APBDData = {
        summary,
        mainData: hierarchicalData
      };

      setApbdData(newData);

      const existingCache = localStorage.getItem('apbd_cache_2025_9_--_--');

      if (!existingCache) {
        saveToCache(newData, cacheKey);
      }

    } catch (err) {
      setError(`Failed to fetch APBD data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error fetching APBD data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cleanupOldCache();
  }, []);

  useEffect(() => {
    if (!selectedRegion || selectedRegion === "--") return;

    const fetchRegionData = async () => {
      try {
        const res = await fetch(
          `https://djpk.kemenkeu.go.id/portal/pemda/${selectedRegion}/${selectedYear}`
        );
        const data = await res.json();
        setSubRegionList(data);
      } catch (err) {
        console.error("Error fetching region data:", err);
      }
    };

    fetchRegionData();
  }, [selectedRegion, selectedYear]);

  useEffect(() => {
      fetchAPBDData();
    }, [selectedPeriod, selectedYear, selectedRegion, selectedSubRegion]);

  const subRegionOptions = useMemo(
    () =>
      Object.entries(subRegionList).map(([kode, nama]) => ({
        value: kode,
        label: nama,
      })),
    [subRegionList]
  );
  
  const getStatusStyle = (status: StatusType) => {
    switch (status) {
      case 'excellent': return { bg: 'bg-gradient-to-r from-cyan-50 to-blue-50', text: 'text-cyan-700', dot: 'bg-cyan-500', border: 'border-cyan-200', icon: CheckCircle };
      case 'good': return { bg: 'bg-gradient-to-r from-emerald-50 to-green-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200', icon: TrendingUp };
      case 'normal': return { bg: 'bg-gradient-to-r from-gray-50 to-slate-50', text: 'text-gray-700', dot: 'bg-gray-500', border: 'border-gray-200', icon: Eye };
      case 'warning': return { bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200', icon: AlertTriangle };
      case 'alert': return { bg: 'bg-gradient-to-r from-orange-50 to-red-50', text: 'text-orange-700', dot: 'bg-orange-500', border: 'border-orange-200', icon: AlertTriangle };
      case 'critical': return { bg: 'bg-gradient-to-r from-red-50 to-rose-50', text: 'text-red-700', dot: 'bg-red-500', border: 'border-red-200', icon: TrendingDown };
      default: return { bg: 'bg-gradient-to-r from-gray-50 to-slate-50', text: 'text-gray-700', dot: 'bg-gray-500', border: 'border-gray-200', icon: Eye };
    }
  };

  const formatCurrency = (value: number): string => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) + ' M';
  const formatPercentage = (value: number): string => value.toFixed(2) + '%';
  const toggleSection = (sectionId: string): void => {
    setExpandedSections(prev => prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]);
  };

  const getAllItems = (items: APBDItem[]): APBDItem[] => {
    let result: APBDItem[] = [];
    items.forEach(item => {
      result.push(item);
      if (item.children) {
        result = result.concat(getAllItems(item.children));
      }
    });
    return result;
  };

  const filteredData = useMemo((): APBDItem[] => {
    if (!apbdData) return [];
    
    const dataToFilter: APBDItem[] = JSON.parse(JSON.stringify(apbdData.mainData));

    const filterRecursively = (items: APBDItem[]): APBDItem[] => {
      return items.reduce((acc: APBDItem[], item) => {
        let matches = item.kategori.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (showOnlyAlert) {
            matches = matches && ['warning', 'alert', 'critical'].includes(item.status);
        }

        if (item.children) {
          item.children = filterRecursively(item.children);
        }

        if (matches || (item.children && item.children.length > 0)) {
          acc.push(item);
        }
        
        return acc;
      }, []);
    };

    return filterRecursively(dataToFilter);
  }, [searchTerm, showOnlyAlert, apbdData]);

  const statistics = useMemo(() => {
    if (!apbdData) return { total: 0, alert: 0, excellent: 0, avgRealization: 0 };

    const allItems: APBDItem[] = getAllItems(apbdData.mainData);
    const alertItems = allItems.filter(item => ['warning', 'alert', 'critical'].includes(item.status));
    const excellentItems = allItems.filter(item => ['excellent', 'good'].includes(item.status));
    const totalRealization = allItems.reduce((sum, item) => sum + item.persentase, 0);
    return {
      total: allItems.length,
      alert: alertItems.length,
      excellent: excellentItems.length,
      avgRealization: allItems.length > 0 ? totalRealization / allItems.length : 0
    };
  }, [apbdData]);

  const renderDataRow = (item: APBDItem, level: number = 0) => {
    const statusStyle = getStatusStyle(item.status);
    const isExpanded = expandedSections.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <React.Fragment key={item.id}>
        <tr className={`group hover:bg-blue-50/30 transition-colors duration-200 ${level > 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
          <td className="p-4 align-top" style={{ paddingLeft: `${1 + level * 2}rem` }}>
            <div className="flex items-center">
              {hasChildren ? (
                <button onClick={() => toggleSection(item.id)} className="mr-3 p-1.5 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4 text-blue-600" />}
                </button>
              ) : (
                <div className="w-8 mr-3"></div>
              )}
              <div>
                <p className={`text-sm ${level === 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                  {item.kategori}
                </p>
                <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                  <div className={`w-2 h-2 mr-2 rounded-full ${statusStyle.dot} shadow-sm`}></div>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              </div>
            </div>
          </td>
          <td className="p-4 text-right align-top font-mono text-sm text-gray-700 font-semibold">{formatCurrency(item.anggaran)}</td>
          <td className="p-4 text-right align-top font-mono text-sm text-gray-700 font-semibold">{formatCurrency(item.realisasi)}</td>
          <td className="p-4 text-right align-top">
            <div className="flex items-center justify-end space-x-3">
              <span className={`font-bold text-sm w-16 text-right ${statusStyle.text}`}>{formatPercentage(item.persentase)}</span>
              <div className="w-24 bg-gray-200 rounded-full h-2 shadow-inner">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 shadow-sm ${statusStyle.dot}`}
                  style={{ width: `${Math.min(item.persentase, 100)}%` }}
                ></div>
              </div>
            </div>
          </td>
        </tr>
        {hasChildren && isExpanded && item.children?.map((child) => renderDataRow(child, level + 1))}
      </React.Fragment>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700 mb-2">Gagal memuat data</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => fetchAPBDData()}
            className="px-4 py-2 text-white bg-gradient-to-r from-blue-700 to-cyan-700  rounded-lg hover:from-blue-800 hover:to-cyan-800 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg transform"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!apbdData) return null;

  const selectedRegionLabel = regionOptions.find(r => r.value === selectedRegion)?.label || 'Semua Provinsi';

  return (
    <div className="min-h-screen bg-white sm:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl w-fit font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              POSTUR APBD
            </h1>
            <p className="mt-2 text-lg font-semibold text-gray-700">
              {selectedRegionLabel} 
              <span className="mx-2 text-gray-400">•</span> 
              Tahun Anggaran <span className="text-blue-600">{selectedYear}</span>
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-5 py-3 shadow-sm text-sm">
            <p className="flex items-center text-gray-600 font-medium">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              Data diterima:{" "}
              <span className="ml-1 text-gray-800 font-semibold">
                {apbdData.summary.lastUpdate ?? "-"}
              </span>
            </p>
            <p className="text-gray-500 mt-1">
              <span className="font-semibold text-blue-600">{apbdData.summary.totalPemda ?? 0}</span> Pemda 
              <span className="mx-1 text-gray-400">|</span>
              <span className="font-medium">{apbdData.summary.dataType ?? "-"}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={BarChart3} title="Total Item" value={statistics.total ?? 0} color="blue" description="Jumlah semua akun APBD" />
          <StatCard icon={AlertTriangle} title="Perlu Perhatian" value={statistics.alert ?? 0} color="red" description="Realisasi dibawah target" />
          <StatCard icon={CheckCircle} title="Kinerja Baik" value={statistics.excellent ?? 0} color="green" description="Realisasi diatas target" />
          <StatCard icon={Percent} title="Rata-rata Realisasi" value={statistics.avgRealization ?? 0} color="slate" description="Rata-rata nasional" isPercentage />
        </div>


        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6 shadow-lg flex flex-col gap-4">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-9 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[160px]">
                <SearchableDropdown
                  options={periodOptions}
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  placeholder={currentMonth}
                />
              </div>

              <div className="flex-1 min-w-[10px]">
                <SearchableDropdown
                  options={yearOptions}
                  value={selectedYear}
                  onChange={setSelectedYear}
                  placeholder={currentYear}
                />
              </div>

              <div className="flex-2">
                <SearchableDropdown
                  options={[{ value: '--', label: 'Semua Provinsi' }, ...regionOptions]}
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  placeholder="Semua Provinsi"
                />
              </div>

              <div className="flex-2">
                <SearchableDropdown
                  options={[{ value: '--', label: 'Semua Pemda' }, ...subRegionOptions]}
                  value={selectedSubRegion}
                  onChange={setSelectedSubRegion}
                  placeholder="Semua Pemda"
                />
              </div>
            </div>

            <div className="lg:col-span-3 flex items-center gap-3 justify-start lg:justify-end">
              <button
                onClick={() => setShowOnlyAlert(!showOnlyAlert)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all duration-200 font-semibold shadow-sm hover:shadow-md ${
                  showOnlyAlert
                    ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200"
                    : "bg-white/90 backdrop-blur-sm text-gray-700 border-gray-200/60 hover:bg-gray-50"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Perhatian</span>
              </button>

              <button 
                onClick={refrash}
                className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200/60 text-gray-700 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <div className="relative flex-grow w-full">
              <Search className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text" 
                placeholder="Cari kategori..." 
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200/60 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
            <button
              onClick={handleDownload}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-700 to-cyan-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform ${
                loading
                  ? "cursor-not-allowed"
                  : "hover:from-blue-800 hover:to-cyan-800 hover:scale-105"
              }`}
            >
              {download ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Export
                </span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                <tr>
                  <th className="p-4 text-left font-bold text-gray-700 uppercase tracking-wider">Akun</th>
                  <th className="p-4 text-right font-bold text-gray-700 uppercase tracking-wider">Anggaran</th>
                  <th className="p-4 text-right font-bold text-gray-700 uppercase tracking-wider">Realisasi</th>
                  <th className="p-4 text-right font-bold text-gray-700 uppercase tracking-wider">Realisasi (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <svg
                          className="animate-spin h-12 w-12 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>

                        <p className="text-lg font-semibold text-gray-700">Memuat data APBD...</p>
                        <p className="text-sm text-gray-500">Mengambil data dari server</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredData.map(item => renderDataRow(item))}
                    {filteredData.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-gray-500">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-slate-100 rounded-full flex items-center justify-center">
                              <Search className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="font-semibold text-gray-600">Data Tidak Ditemukan</p>
                            <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter Anda.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosturAPBD;