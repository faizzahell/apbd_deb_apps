export type JenisData = {
  id: number;
  nama: string;
  tanggalUpdate: string | null; 
  fileUrl?: string | null; 
};

export type StatusData = {
  status: "Anggaran" | "Realisasi";
  data: JenisData[];
};

export type TahunData = {
  tahun: number;
  status: StatusData[];
};

export const dataStatus: TahunData[] = [
  {
    tahun: 2023,
    status: [
      {
        status: "Anggaran",
        data: [
          {
            id: 1,
            nama: "Ringkasan",
            tanggalUpdate: "12 Mei 2023",
            fileUrl: "/dokumen/2023/anggaran/ringkasan.pdf",
          },
          {
            id: 2,
            nama: "Belanja per Fungsi",
            tanggalUpdate: "5 Juni 2023",
            fileUrl: "/dokumen/2023/anggaran/belanja.pdf",
          },
          {
            id: 3,
            nama: "Pendapatan per Jenis Pajak",
            tanggalUpdate: "12 Mei 2023",
            fileUrl: "/dokumen/2023/anggaran/pajak.pdf",
          },
          {
            id: 4,
            nama: "Pendapatan per Jenis Retribusi",
            tanggalUpdate: "12 Mei 2023",
            fileUrl: "/dokumen/2023/anggaran/retribusi.pdf",
          },
        ],
      },
      {
        status: "Realisasi",
        data: [
          {
            id: 1,
            nama: "Ringkasan",
            tanggalUpdate: "18 November 2024",
            fileUrl: "/dokumen/2023/realisasi/ringkasan.pdf",
          },
          {
            id: 2,
            nama: "Belanja per Fungsi",
            tanggalUpdate: "18 November 2024",
            fileUrl: "/dokumen/2023/realisasi/belanja.pdf",
          },
          {
            id: 3,
            nama: "Pendapatan per Jenis Pajak",
            tanggalUpdate: "18 November 2024",
            fileUrl: "/dokumen/2023/realisasi/pajak.pdf",
          },
          {
            id: 4,
            nama: "Pendapatan per Jenis Retribusi",
            tanggalUpdate: "18 November 2024",
            fileUrl: "/dokumen/2023/realisasi/retribusi.pdf",
          },
          {
            id: 5,
            nama: "Semester I",
            tanggalUpdate: null,
            fileUrl: null,
          },
          {
            id: 6,
            nama: "Neraca",
            tanggalUpdate: "05 Desember 2024",
            fileUrl: "/dokumen/2023/realisasi/neraca.pdf",
          },
        ],
      },
    ],
  },
  // isi tahun lain (2006–2025) dengan format sama
];
