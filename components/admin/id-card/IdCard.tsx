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
} from "@/utils/admin/adminFunctions";
import test_foto from "@/public/images/pas-foto.jpg";
import { compare, findNamaKontingen } from "@/utils/sharedFunctions";
import { ImGit } from "react-icons/im";

const IdCard = () => {
  const [pesertaFontSize, setPesertaFontSize] = useState("text-xl");
  const [kontingenFontSize, setKontingenFontSize] = useState("text-xl");
  const [officialFontSize, setOfficialFontSize] = useState("text-xl");
  const [selectedKontingen, setSelectedKontingen] = useState<KontingenState>(
    kontingenInitialValue
  );
  const [selectedPesertas, setSelectedPesertas] = useState<PesertaState[]>([]);
  const [selectedOfficials, setSelectedOfficials] = useState<OfficialState[]>(
    []
  );
  const [startNumber, setStartNumber] = useState(15);

  const { kontingens, officials, pesertas } = AdminContext();

  useEffect(() => {
    let pesertasContainer: PesertaState[] = [];
    let officialsContainer: OfficialState[] = [];
    // pesertas.map((peserta: PesertaState, i: number) => {
    //   if (i >= startNumber && i < startNumber + intervalNumber) {
    //     pesertasContainer.push(peserta);
    //   }
    // });
    // setSelectedPesertas(pesertasContainer);
    officials
      .sort(compare("namaLengkap", "asc"))
      .map((official: OfficialState, i: number) => {
        if (i >= startNumber && i < startNumber + intervalNumber) {
          officialsContainer.push(official);
        }
      });
    setSelectedOfficials(officialsContainer);
  }, [startNumber]);

  const intervalNumber = 45;
  // 1485 - 1515
  // 0 - 15

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${startNumber}-${intervalNumber}`,
    onPrintError: () => alert("error"),
  });

  return (
    <div>
      {/* <div className="flex gap-1 border border-black w-fit rounded-md px-2 py-1 mb-2">
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
          {kontingens
            .sort(compare("namaKontingen", "asc"))
            .map((kontingen: KontingenState) => (
              <option value={kontingen.id}>{kontingen.namaKontingen}</option>
            ))}
        </select>
      </div> */}

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
      <div className="flex gap-2 items-center mb-1">
        <button
          className="btn_green"
          onClick={() => setStartNumber((prev) => prev - intervalNumber)}
        >
          Prev
        </button>
        <p>
          {startNumber + 1515}-{startNumber + intervalNumber + 1515}
        </p>
        <button
          className="btn_green"
          onClick={() => setStartNumber((prev) => prev + intervalNumber)}
        >
          Next
        </button>
      </div>
      <div className="flex gap-2 mb-2">
        <button onClick={handlePrint} className="btn_green">
          Print
        </button>
        <button
          onClick={() => {
            setSelectedOfficials([]);
            setSelectedPesertas([]);
          }}
          className="btn_green"
        >
          Clear
        </button>
      </div>

      <div ref={printRef} className="w-[813px]">
        {/* ID CARD PESERTA */}
        {selectedPesertas.length
          ? selectedPesertas.map((peserta: PesertaState) => (
              <div className="w-[813px] h-[1150px] px-5 flex justify-center items-center border-2 border-red-500">
                <div className="w-full relative bg-white">
                  <Image
                    src={idCardPeserta}
                    alt="idcard"
                    className="w-full h-fit"
                  />
                  <div className="w-[163px] h-[214px] absolute left-[310px] top-[400px] z-[1]">
                    <div className="bg-green-500 bg-opacity-50 w-full h-full relative">
                      <img
                        src={peserta.downloadFotoUrl}
                        alt="pasfoto"
                        className="w-[163px] h-[214px] object-cover"
                      />
                    </div>
                  </div>
                  <p
                    className={`absolute left-1/2 -translate-x-[48%] bottom-[295px] w-[400px] h-[40px] leading-none flex items-center justify-center text-center ${pesertaFontSize} font-bold z-[2] uppercase`}
                  >
                    {peserta.namaLengkap}
                  </p>
                  <p
                    className={`absolute left-1/2 -translate-x-[48%] bottom-[223px] w-[500px] h-[40px] leading-none flex items-center justify-center text-center ${kontingenFontSize} font-bold z-[2] uppercase`}
                  >
                    {findNamaKontingen(kontingens, peserta.idKontingen)}
                    {/* {selectedKontingen.namaKontingen} */}
                  </p>
                  <p className="absolute left-1/2 -translate-x-[48%] bottom-[158px] text-3xl font-bold z-[2] uppercase whitespace-nowrap scale-[.8]">
                    {peserta.kategoriPertandingan
                      .split("(")[0]
                      .replace(/ Putra| Putri/g, "")}{" "}
                    | {peserta.jenisKelamin} | {peserta.tingkatanPertandingan}
                  </p>
                </div>
              </div>
            ))
          : null}
        {/* ID CARD PESERTA */}

        {/* ID CARD OFFICIAL */}
        {selectedOfficials.length
          ? selectedOfficials.map((official: OfficialState) => (
              <div className="w-[813px] h-[1150px] px-5 flex justify-center items-center border-2 border-red-500">
                <div className="w-full relative bg-white">
                  <Image
                    src={idCardOfficial}
                    alt="idcard"
                    className="w-full h-fit"
                  />
                  <div className="w-[163px] h-[214px] absolute left-[310px] top-[400px] z-[1]">
                    <div className="bg-green-500 w-full h-full relative">
                      <img
                        src={official.downloadFotoUrl}
                        alt="pasfoto"
                        className="w-[163px] h-[214px] object-cover"
                      />
                    </div>
                  </div>
                  <p
                    className={`absolute left-1/2 -translate-x-[48%] bottom-[255px] w-[400px] h-[40px] leading-none flex items-center justify-center text-center ${officialFontSize} font-bold z-[2] uppercase`}
                  >
                    {official.namaLengkap}
                  </p>
                  <p
                    className={`absolute left-1/2 -translate-x-[48%] bottom-[150px] w-[400px] h-[40px] leading-none flex items-center justify-center text-center ${kontingenFontSize} font-bold z-[2] uppercase`}
                  >
                    {findNamaKontingen(kontingens, official.idKontingen)}
                    {/* {selectedKontingen.namaKontingen} */}
                  </p>
                </div>
              </div>
            ))
          : null}
        {/* ID CARD OFFICIAL */}
      </div>
    </div>
  );
};
export default IdCard;
