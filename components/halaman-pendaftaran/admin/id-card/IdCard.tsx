import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import idCardPeserta from "@/public/images/idcard-peserta.png";
import idCardOfficial from "@/public/images/idcard-official.png";
import { kontingenInitialValue } from "@/utils/formConstants";
import { AdminContext } from "@/context/AdminContext";
import { KontingenState, OfficialState, PesertaState } from "@/utils/formTypes";
import {
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import test_foto from "@/public/images/pas-foto.jpg";

const IdCard = () => {
  const [pesertaFontSize, setPesertaFontSize] = useState("text-lg");
  const [kontingenFontSize, setKontingenFontSize] = useState("text-lg");
  const [officialFontSize, setOfficialFontSize] = useState("text-lg");
  const [selectedKontingen, setSelectedKontingen] = useState<KontingenState>(
    kontingenInitialValue
  );
  const [selectedPesertas, setSelectedPesertas] = useState<PesertaState[]>([]);
  const [selectedOfficials, setSelectedOfficials] = useState<OfficialState[]>(
    []
  );

  const { kontingens, officials, pesertas } = AdminContext();

  useEffect(() => {
    if (selectedKontingen.id) {
      setSelectedOfficials(
        getOfficialsByKontingen(officials, selectedKontingen.id)
      );
      setSelectedPesertas(
        getPesertasByKontingen(pesertas, selectedKontingen.id)
      );
    }
  }, [selectedKontingen.id]);

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${selectedKontingen.namaKontingen}`,
    onPrintError: () => alert("error"),
  });

  return (
    <div>
      <div className="flex gap-1 border border-black w-fit rounded-md px-2 py-1 mb-2">
        <p>Choose Kontingen</p>
        <select
          value={selectedKontingen.id}
          onChange={(e) => {
            if (e.target.value == "") {
              setSelectedKontingen(kontingenInitialValue);
            } else {
              setSelectedKontingen(
                kontingens[
                  kontingens.findIndex(
                    (kontingen: KontingenState) =>
                      kontingen.id == e.target.value
                  )
                ]
              );
            }
          }}
        >
          <option value=""></option>
          {kontingens.map((kontingen: KontingenState) => (
            <option value={kontingen.id}>{kontingen.namaKontingen}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-1">
        <div className="flex gap-1 border border-black w-fit rounded-md px-2 py-1">
          <p>Peserta Font Size</p>
          <select
            value={pesertaFontSize}
            onChange={(e) => setPesertaFontSize(e.target.value)}
          >
            <option value="text-xs">Extra Small</option>
            <option value="text-sm">Small</option>
            <option value="text-md">Medium</option>
            <option value="text-lg">Large</option>
            <option value="text-xl">Extra Large</option>
          </select>
        </div>
        <div className="flex gap-1 border border-black w-fit rounded-md px-2 py-1">
          <p>Kontingen Font Size</p>
          <select
            value={kontingenFontSize}
            onChange={(e) => setKontingenFontSize(e.target.value)}
          >
            <option value="text-xs">Extra Small</option>
            <option value="text-sm">Small</option>
            <option value="text-md">Medium</option>
            <option value="text-lg">Large</option>
            <option value="text-xl">Extra Large</option>
          </select>
        </div>
        <div className="flex gap-1 border border-black w-fit rounded-md px-2 py-1">
          <p>Official Font Size</p>
          <select
            value={officialFontSize}
            onChange={(e) => setOfficialFontSize(e.target.value)}
          >
            <option value="text-xs">Extra Small</option>
            <option value="text-sm">Small</option>
            <option value="text-md">Medium</option>
            <option value="text-lg">Large</option>
            <option value="text-xl">Extra Large</option>
          </select>
        </div>
      </div>
      {selectedKontingen.id && (
        <>
          <button onClick={handlePrint} className="btn_green mb-2">
            Print
          </button>

          <div
            ref={printRef}
            className="w-[818px] h-[1156px] grid grid-cols-2 place-items-center"
          >
            {/* ID CARD PESERTA */}
            {selectedPesertas.length
              ? selectedPesertas.map((peserta) => (
                  <div className="h-[576px] relative bg-green-500">
                    <Image
                      src={idCardPeserta}
                      alt="idcard"
                      className="w-fit h-full"
                    />
                    <div className="w-[96px] h-[127px] absolute left-[142px] top-[230px] z-[1]">
                      <div className="bg-green-500 bg-opacity-50 w-full h-full relative">
                        {/* <Image
                          src={peserta.downloadFotoUrl}
                          alt="pasfoto"
                          fill
                          className="object-cover"
                        /> */}
                        <img
                          src={peserta.downloadFotoUrl}
                          alt="pasfoto"
                          className="w-[96px] h-[127px] object-cover"
                        />
                      </div>
                    </div>
                    <p
                      className={`absolute left-1/2 -translate-x-[48%] bottom-[172px] w-[225px] h-[20px] leading-none flex items-center justify-center text-center ${pesertaFontSize} font-bold z-[2] uppercase`}
                    >
                      {peserta.namaLengkap}
                    </p>
                    <p
                      className={`absolute left-1/2 -translate-x-[48%] bottom-[130px] w-[290px] h-[20px] leading-none flex items-center justify-center text-center ${kontingenFontSize} font-bold z-[2] uppercase`}
                    >
                      {selectedKontingen.namaKontingen}
                    </p>
                    <p className="absolute left-1/2 -translate-x-[48%] bottom-[90px] text-sm font-bold z-[2] uppercase whitespace-nowrap">
                      {peserta.kategoriPertandingan
                        .split("(")[0]
                        .replace(/ Putra| Putri/g, "")}{" "}
                      | {peserta.jenisKelamin} | {peserta.tingkatanPertandingan}
                    </p>
                  </div>
                ))
              : null}
            {/* ID CARD PESERTA */}

            {/* ID CARD OFFICIAL */}
            {selectedOfficials.length
              ? selectedOfficials.map((official) => (
                  <div className="h-[576px] relative">
                    <Image
                      src={idCardOfficial}
                      alt="idcard"
                      className="w-fit h-full"
                    />
                    <div className="w-[97px] h-[128px] absolute left-[141px] top-[230px] z-[1]">
                      <div className="w-full h-full relative">
                        {/* <Image
                          src={official.downloadFotoUrl}
                          alt="pasfoto"
                          fill
                          className="object-cover"
                        /> */}
                        <img
                          src={official.downloadFotoUrl}
                          alt="pasfoto"
                          className="w-[97px] h-[128px] object-cover"
                        />
                      </div>
                    </div>
                    <p
                      className={`absolute left-1/2 -translate-x-[48%] bottom-[150px] w-[225px] h-[30px] leading-none flex items-center justify-center text-center ${officialFontSize} font-bold z-[2] uppercase`}
                    >
                      {official.namaLengkap}
                    </p>
                    <p
                      className={`absolute left-1/2 -translate-x-[48%] bottom-[90px] w-[290px] h-[30px] leading-none flex items-center justify-center text-center ${kontingenFontSize} font-bold z-[2] uppercase`}
                    >
                      {selectedKontingen.namaKontingen}
                    </p>
                  </div>
                ))
              : null}
            {/* ID CARD OFFICIAL */}
          </div>
        </>
      )}
    </div>
  );
};
export default IdCard;
