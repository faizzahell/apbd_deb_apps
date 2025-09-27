export type StatusType = 'excellent' | 'good' | 'normal' | 'warning' | 'alert' | 'critical';

export interface APBDItem {
  id: string;
  kategori: string;
  anggaran: number;
  realisasi: number;
  persentase: number;
  status: StatusType;
  children?: APBDItem[];
}

export interface APBDSummary {
  totalPemda: number;
  lastUpdate: string;
  dataType: string;
  period: string;
}

export interface APBDData {
  summary: APBDSummary;
  mainData: APBDItem[];
}

export interface CSVRow {
  akun: string;
  anggaran: string;
  realisasi: string;
  persentase: number;
}

export interface CacheData {
  data: APBDData;
  timestamp: number;
  key: string;
}
