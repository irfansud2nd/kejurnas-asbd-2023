import { FormContext } from "@/context/FormContext";
import { KontingenState, OfficialState, PesertaState } from "@/utils/formTypes";
import TabelOfficial from "../tabels/TabelOfficial";
import TabelPeserta from "../tabels/TabelPeserta";
import { getOfficialsByKontingen } from "@/utils/admin/adminFunctions";
import TabelKontingen from "../tabels/TabelKontingen";

const InfoTerdaftar = () => {
  const {
    kontingens,
    pesertas,
    officials,
  }: {
    kontingens: KontingenState[];
    pesertas: PesertaState[];
    officials: OfficialState[];
  } = FormContext();

  return (
    <div className="w-full bg-white rounded-md p-2 mb-2">
      <h1 className="text-xl sm:text-2xl font-extrabold border-b-2 border-black">
        Ringkasan Data
      </h1>
      {!kontingens.length ? (
        <p className="text-red-500">Belum Ada Kontingen Terdaftar</p>
      ) : (
        <>
          {/* <h1 className="text-xl font-bold">
              Kontingen {kontingen.namaKontingen}
            </h1> */}
          {kontingens.length ? (
            <div className="border-b-2 pb-2 border-gray-300">
              <h2 className="text-lg font-semibold">
                Kontingen{" "}
                <span className="text-base text-gray-700">
                  ({kontingens.length} kontingen)
                </span>
              </h2>
              <TabelKontingen />
            </div>
          ) : (
            <p className="text-red-500">Belum Ada Official Terdaftar</p>
          )}
          {officials.length ? (
            <div className="border-b-2 pb-2 border-gray-300">
              <h2 className="text-lg font-semibold">
                Official{" "}
                <span className="text-base text-gray-700">
                  ({officials.length} Orang)
                </span>
              </h2>
              <TabelOfficial />
            </div>
          ) : (
            <p className="text-red-500">Belum Ada Official Terdaftar</p>
          )}
          {pesertas.length ? (
            <div className="border-b-2 pb-2 border-gray-300">
              <h2 className="text-lg font-semibold">
                Peserta{" "}
                <span className="text-base text-gray-700">
                  ({pesertas.length} Orang)
                </span>
              </h2>
              <TabelPeserta />
            </div>
          ) : (
            <p className="text-red-500">Belum Ada Peserta Terdaftar</p>
          )}
        </>
      )}
    </div>
  );
};
export default InfoTerdaftar;
