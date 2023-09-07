import { FormContext } from "@/context/FormContext";
import { KontingenState, PesertaState, TabelProps } from "@/utils/formTypes";
import TabelActionButtons from "./TabelActionButtons";
import InlineLoading from "@/components/loading/InlineLoading";
import { jenisPertandingan } from "@/utils/formConstants";

const TabelPeserta = ({ handleDelete, handleEdit }: TabelProps) => {
  const {
    pesertas,
    kontingen,
    pesertasLoading,
  }: {
    pesertas: PesertaState[];
    kontingen: KontingenState;
    pesertasLoading: boolean;
  } = FormContext();

  const tableHead = [
    "No",
    "Nama Lengkap",
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
              {pesertas.map((peserta, i) => (
                <tr key={peserta.id}>
                  <td>{i + 1}</td>
                  <td>{peserta.namaLengkap}</td>
                  <td>{kontingen.namaKontingen}</td>
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
                      peserta.kategoriPertandingan.split(" ")[0] != "Tunggal" &&
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
                    <td>
                      {peserta.pembayaran
                        ? peserta.confirmedPembayaran
                          ? "Pembayaran sudah dikonfirmasi"
                          : "Menunggu konfirmasi dari admin"
                        : "Belum dibayar"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : pesertasLoading ? (
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
