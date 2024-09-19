import { AdminContext } from "@/context/AdminContext";
import { tingkatanKategori } from "@/utils/formConstants";

const TabelKuota = () => {
  const { cekKuota } = AdminContext();
  return (
    <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md w-fit min-w-[500px] mt-2">
      <p className="font-semibold text-lg">Sisa Kuota</p>
      <table>
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Putra</th>
            <th>Putri</th>
          </tr>
        </thead>
        <tbody>
          {tingkatanKategori.map((item) =>
            item.tingkatan.includes("SMA") ? (
              <>
                <tr className="border-y-2 border-green-500 text-green-500 font-bold">
                  <td className="col-span-5" colSpan={3}>
                    SMA Tanding
                  </td>
                </tr>
                {item.kategoriTanding.map((item) => (
                  <tr key={item}>
                    <td className="border-b border-white">{item}</td>
                    <td className="border-b border-white">
                      {cekKuota("SMA", item, "Putra")}
                    </td>
                    <td className="border-b border-white">
                      {cekKuota("SMA", item, "Putri")}
                    </td>
                  </tr>
                ))}
                <tr className="border-y-2 border-green-500 text-green-500 font-bold">
                  <td className="col-span-5" colSpan={3}>
                    SMA Seni
                  </td>
                </tr>
                {item.kategoriSeni.putra.map((item) => (
                  <tr key={item}>
                    <td className="border-b border-white">
                      {item.replace(" Putra", "")}
                    </td>
                    <td className="border-b border-white">
                      {cekKuota("SMA", item, "Putra")}
                    </td>
                    <td className="border-b border-white">
                      {cekKuota("SMA", item, "Putri")}
                    </td>
                  </tr>
                ))}
              </>
            ) : item.tingkatan.includes("Dewasa") ? (
              <>
                <tr className="border-y-2 border-green-500 text-green-500 font-bold">
                  <td className="col-span-5" colSpan={3}>
                    Dewasa Tanding
                  </td>
                </tr>
                {item.kategoriTanding.map((item) => (
                  <tr key={item}>
                    <td className="border-b border-white">{item}</td>
                    <td className="border-b border-white">
                      {cekKuota("Dewasa", item, "Putra")}
                    </td>
                    <td className="border-b border-white">
                      {cekKuota("Dewasa", item, "Putri")}
                    </td>
                  </tr>
                ))}
                <tr className="border-y-2 border-green-500 text-green-500 font-bold">
                  <td className="col-span-5" colSpan={3}>
                    Dewasa Seni
                  </td>
                </tr>
                {item.kategoriSeni.putra.map((item) => (
                  <tr key={item}>
                    <td className="border-b border-white">
                      {item.replace(" Putra", "")}
                    </td>
                    <td className="border-b border-white">
                      {cekKuota("Dewasa", item, "Putra")}
                    </td>
                    <td className="border-b border-white">
                      {cekKuota("Dewasa", item, "Putri")}
                    </td>
                  </tr>
                ))}
              </>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
};
export default TabelKuota;
