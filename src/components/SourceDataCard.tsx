import React from "react";
import {
  Calendar,
  FileText,
  Download,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { dataStatus } from "../constants/sourceData";

const SourceDataCard: React.FC = () => {
  return (
    <div className="space-y-8">
      {dataStatus.map((tahunItem) => (
        <div
          key={tahunItem.tahun}
          className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-lg p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-sm">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Tahun {tahunItem.tahun}
                </h3>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Data Anggaran & Realisasi
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {tahunItem.status.map((status) => (
              <div key={status.status} className="flex flex-col">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  {status.status}
                </h4>
                <div className="space-y-3">
                  {status.data.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center justify-between bg-white/70 border border-gray-200/60 rounded-xl p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">
                          {item.nama}
                        </span>
                        <span className="flex items-center gap-1 text-sm mt-1">
                          {item.tanggalUpdate ? (
                            <>
                              <Calendar size={14} className="text-green-600" />
                              <span className="text-green-700">
                                {item.tanggalUpdate}
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle size={14} className="text-red-500" />
                              <span className="text-red-500">Belum ada</span>
                            </>
                          )}
                        </span>
                      </div>

                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 md:mt-0 flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-xl hover:from-blue-800 hover:to-cyan-800 transition-all duration-200 shadow-sm hover:shadow-lg transform hover:scale-105"
                        >
                          <Download className="w-4 h-4" />
                          <span>Unduh</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center justify-end">
            <button className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold border border-gray-200/60 text-gray-700 bg-white/90 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 shadow-sm">
              <span>Lihat Detail</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SourceDataCard;
