import { FormContext } from "@/context/FormContext";
import { KontingenState, OfficialState, TabelProps } from "@/utils/formTypes";
import TabelActionButtons from "./TabelActionButtons";
import { useEffect } from "react";
import InlineLoading from "@/components/loading/InlineLoading";
import { compare, findNamaKontingen } from "@/utils/sharedFunctions";

const TabelOfficial = ({ handleDelete, handleEdit }: TabelProps) => {
  const {
    officials,
    kontingens,
    officialsLoading,
    kontingensLoading,
  }: {
    officials: OfficialState[];
    kontingens: KontingenState[];
    officialsLoading: boolean;
    kontingensLoading: boolean;
  } = FormContext();

  const tableHead = [
    "No",
    "Nama Lengkap",
    "Jenis Kelamin",
    "Jabatan",
    "Nama Kontingen",
  ];

  return (
    <>
      {officials.length ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {tableHead.map((item) => (
                  <th key={item} scope="col" className="text-start">
                    {item}
                  </th>
                ))}
                {/* {handleDelete && handleEdit && (
                  <th className="text-start">Aksi</th>
                )} */}
              </tr>
            </thead>
            <tbody>
              {officials
                .sort(compare("waktuPendaftaran", "asc"))
                .sort(compare("idKontingen", "asc"))
                .map((official, i) => (
                  <tr key={official.id}>
                    <td>{i + 1}</td>
                    <td>{official.namaLengkap}</td>
                    <td>{official.jenisKelamin}</td>
                    <td>{official.jabatan}</td>
                    <td className="whitespace-nowrap">
                      {findNamaKontingen(kontingens, official.idKontingen)}
                    </td>
                    {/* {handleDelete && handleEdit && (
                        <td>
                          <TabelActionButtons
                            handleDelete={() => handleDelete(official)}
                            handleEdit={() => handleEdit(official)}
                          />
                        </td>
                    )} */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : officialsLoading || kontingensLoading ? (
        <p className="w-full bg-white rounded-md p-2">
          Memuat Data Official <InlineLoading />
        </p>
      ) : (
        <p className="text-rose-500 font-bold">
          Belum ada official yang terdaftar
        </p>
      )}
    </>
  );
};
export default TabelOfficial;
