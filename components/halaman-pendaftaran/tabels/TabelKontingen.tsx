import { FormContext } from "@/context/FormContext";
import {
  KontingenState,
  OfficialState,
  PesertaState,
  TabelProps,
} from "@/utils/formTypes";
import TabelActionButtons from "./TabelActionButtons";
import { useEffect } from "react";

const TabelKontingen = ({ handleDelete, handleEdit }: TabelProps) => {
  const {
    kontingen,
    officials,
    pesertas,
  }: {
    kontingen: KontingenState;
    officials: OfficialState[];
    pesertas: PesertaState[];
  } = FormContext();

  const tableHead = ["Nama Kontingen", "Official", "Peserta"];

  return (
    <>
      {kontingen.id ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {tableHead.map((item) => (
                  <th key={item} scope="col" className="text-start">
                    {item}
                  </th>
                ))}
                {handleDelete && handleEdit && (
                  <th className="text-start">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{kontingen.namaKontingen}</td>
                <td>{officials.length}</td>
                <td>{pesertas.length}</td>
                <td>
                  {handleDelete && handleEdit && (
                    <TabelActionButtons
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-rose-500 font-bold">
          Belum ada kontingen yang terdaftar
        </p>
      )}
    </>
  );
};
export default TabelKontingen;
