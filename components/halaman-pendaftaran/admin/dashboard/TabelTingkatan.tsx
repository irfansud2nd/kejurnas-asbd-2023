import { AdminContext } from "@/context/AdminContext";
import { jenisKelamin } from "@/utils/formConstants";
import { PesertaState } from "@/utils/formTypes";

const TabelTingkatan = () => {
  const { pesertas }: { pesertas: PesertaState[] } = AdminContext();

  const groupPeserta = () => {
    let sdIPutri = 0;
    let sdIPutra = 0;
    let sdIIPutri = 0;
    let sdIIPutra = 0;
    let sdIIIPutri = 0;
    let sdIIIPutra = 0;
    let smpPutri = 0;
    let smpPutra = 0;
    let smaPutri = 0;
    let smaPutra = 0;
    let dewasaPutri = 0;
    let dewasaPutra = 0;

    pesertas.map((peserta) => {
      switch (peserta.tingkatanPertandingan) {
        case "SD I":
          peserta.jenisKelamin == jenisKelamin[0]
            ? (sdIPutra += 1)
            : (sdIPutri += 1);
          break;
        case "SD II":
          peserta.jenisKelamin == jenisKelamin[0]
            ? (sdIIPutra += 1)
            : (sdIIPutri += 1);
          break;
        case "SD III":
          peserta.jenisKelamin == jenisKelamin[0]
            ? (sdIIIPutra += 1)
            : (sdIIIPutri += 1);
          break;
        case "SMP":
          peserta.jenisKelamin == jenisKelamin[0]
            ? (smpPutra += 1)
            : (smpPutri += 1);
          break;
        case "SMA":
          peserta.jenisKelamin == jenisKelamin[0]
            ? (smaPutra += 1)
            : (smaPutri += 1);
          break;
        case "Dewasa":
          peserta.jenisKelamin == jenisKelamin[0]
            ? (dewasaPutra += 1)
            : (dewasaPutri += 1);
          break;
      }
    });
    return {
      sdIPutri,
      sdIPutra,
      sdIIPutri,
      sdIIPutra,
      sdIIIPutri,
      sdIIIPutra,
      smpPutri,
      smpPutra,
      smaPutri,
      smaPutra,
      dewasaPutri,
      dewasaPutra,
    };
  };
  return (
    <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md w-fit min-w-[500px] mt-2">
      <p className="font-semibold text-lg">Peserta Per Tingkatan</p>
      <div className="grid grid-rows-[repeat(4,_auto)] grid-cols-[repeat(4,_auto)] ">
        <p className="text-lg font-semibold tracking-wide border-r-2 border-white border-b-2 border-b-green-500">
          Tingkatan
        </p>
        <p className="text-lg font-semibold tracking-wide border-r-2 border-white border-b-2 border-b-green-500 px-2">
          Putra
        </p>
        <p className="text-lg font-semibold tracking-wide border-r-2 border-white border-b-2 border-b-green-500 px-2">
          Putri
        </p>
        <p className="text-lg font-semibold tracking-wide border-white border-b-2 border-b-green-500">
          Jumlah
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          SD I
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().sdIPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().sdIPutri}
        </p>
        <p className=" border-white border-b-2 border-b-green-500">
          {groupPeserta().sdIPutri + groupPeserta().sdIPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          SD II
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().sdIIPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().sdIIPutri}
        </p>
        <p className=" border-white border-b-2 border-b-green-500">
          {groupPeserta().sdIIPutri + groupPeserta().sdIIPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          SD III
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().sdIIIPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().sdIIIPutri}
        </p>
        <p className=" border-white border-b-2 border-b-green-500">
          {groupPeserta().sdIIIPutri + groupPeserta().sdIIIPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          SMP
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().smpPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().smpPutri}
        </p>
        <p className=" border-white border-b-2 border-b-green-500">
          {groupPeserta().smpPutri + groupPeserta().smpPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          SMA
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().smaPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().smaPutri}
        </p>
        <p className=" border-white border-b-2 border-b-green-500">
          {groupPeserta().smaPutri + groupPeserta().smaPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          Dewasa
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().dewasaPutra}
        </p>
        <p className="border-r-2 border-white border-b-2 border-b-green-500">
          {groupPeserta().dewasaPutri}
        </p>
        <p className=" border-white border-b-2 border-b-green-500">
          {groupPeserta().dewasaPutri + groupPeserta().dewasaPutra}
        </p>
      </div>
    </div>
  );
};
export default TabelTingkatan;
