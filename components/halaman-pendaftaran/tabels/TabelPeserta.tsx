import { FormContext } from "@/context/FormContext";
import { KontingenState, PesertaState, TabelProps } from "@/utils/formTypes";
import TabelActionButtons from "./TabelActionButtons";
import InlineLoading from "@/components/loading/InlineLoading";
import { jenisPertandingan } from "@/utils/formConstants";
import { compare } from "@/utils/functions";
import { findNamaKontingen } from "@/utils/kontingen/kontingenFunctions";

const TabelPeserta = ({ handleDelete, handleEdit }: TabelProps) => {
  const {
    pesertas,
    kontingens,
    pesertasLoading,
    kontingensLoading,
  }: {
    pesertas: PesertaState[];
    kontingens: KontingenState[];
    pesertasLoading: boolean;
    kontingensLoading: boolean;
  } = FormContext();

  const tableHead = [
    "No",
    "Nama Lengkap",
    "Jenis Kelamin",
    "Nama Kontingen",
    "Tingkatan",
    "Jenis Pertandingan",
    "Kategori Tanding",
  ];

  return (
    <>
      {pesertas.length ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {tableHead.map((item) => (
                  <th key={item} scope="col" className="text-start">
                    {item}
                  </th>
                ))}
                {handleDelete && handleEdit ? (
                  <th className="text-start">Aksi</th>
                ) : (
                  <th>Status Pembayaran</th>
                )}
              </tr>
            </thead>
            <tbody>
              {pesertas
                .sort(compare("waktuPendaftaran", "asc"))
                .sort(compare("idKontingen", "asc"))
                .map((peserta, i) => (
                  <tr key={peserta.id}>
                    <td>{i + 1}</td>
                    <td className="uppercase">{peserta.namaLengkap}</td>
                    <td>{peserta.jenisKelamin}</td>
                    <td className="whitespace-nowrap">
                      {findNamaKontingen(kontingens, peserta.idKontingen)}
                    </td>
                    <td>{peserta.tingkatanPertandingan}</td>
                    <td>{peserta.jenisPertandingan}</td>
                    <td className="whitespace-nowrap">
                      {peserta.jenisPertandingan === jenisPertandingan[2]
                        ? "Sabuk " +
                          peserta.sabuk +
                          " | " +
                          peserta.jurus +
                          " | " +
                          peserta.kategoriPertandingan
                        : peserta.kategoriPertandingan}
                      {peserta.jenisPertandingan === jenisPertandingan[2] &&
                        peserta.kategoriPertandingan.split(" ")[0] !=
                          "Tunggal" &&
                        ` | Tim ${peserta.namaTim}`}
                    </td>
                    {handleDelete && handleEdit ? (
                      <td>
                        <TabelActionButtons
                          handleDelete={() => handleDelete(peserta)}
                          handleEdit={() => handleEdit(peserta)}
                        />
                      </td>
                    ) : (
                      <td className="whitespace-nowrap">
                        {peserta.pembayaran ? (
                          peserta.confirmedPembayaran ? (
                            <span className="text-green-500">
                              Pembayaran sudah dikonfirmasi
                            </span>
                          ) : (
                            <span className="text-yellow-500">
                              Menunggu konfirmasi dari admin
                            </span>
                          )
                        ) : (
                          <span className="text-red-500">Belum dibayar</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : pesertasLoading || kontingensLoading ? (
        <p className="w-full bg-white rounded-md p-2">
          Memuat Data Peserta <InlineLoading />
        </p>
      ) : (
        <p className="text-rose-500 font-bold">
          Belum ada peserta yang terdaftar
        </p>
      )}
    </>
  );
};
export default TabelPeserta;
