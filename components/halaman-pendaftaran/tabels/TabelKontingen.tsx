import { FormContext } from "@/context/FormContext";
import {
  KontingenState,
  OfficialState,
  PesertaState,
  TabelProps,
} from "@/utils/formTypes";
import TabelActionButtons from "./TabelActionButtons";
import {
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import InlineLoading from "@/components/loading/InlineLoading";

const TabelKontingen = ({ handleDelete, handleEdit }: TabelProps) => {
  const {
    kontingens,
    kontingensLoading,
  }: {
    kontingens: KontingenState[];
    kontingensLoading: boolean;
  } = FormContext();

  const tableHead = ["Nama Kontingen", "Official", "Peserta"];

  return (
    <>
      {kontingens.length ? (
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
              {kontingens.map((kontingen) => (
                <tr key={kontingen.id}>
                  <td>{kontingen.namaKontingen}</td>
                  <td>{kontingen.officials.length}</td>
                  <td>{kontingen.pesertas.length}</td>
                  {/* {handleDelete && handleEdit && (
                    <td>
                      <TabelActionButtons
                        handleDelete={() => handleDelete(kontingen)}
                        handleEdit={() => handleEdit(kontingen)}
                      />
                    </td>
                  )} */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : kontingensLoading ? (
        <p className="w-full bg-white rounded-md p-2">
          Memuat Data Kontingen <InlineLoading />
        </p>
      ) : (
        <p className="text-rose-500 font-bold">
          Belum ada kontingen yang terdaftar
        </p>
      )}
    </>
  );
};
export default TabelKontingen;
