"use client";
// import { kontingenInitialValue } from "@/utils/formConstants";
import { KontingenState, OfficialState, PesertaState } from "@/utils/formTypes";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { MyContext } from "./Context";
import { kontingenInitialValue } from "@/utils/formConstants";
import {
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/admin/adminFunctions";
import InlineLoading from "@/components/loading/InlineLoading";
import {
  getAllKontingen,
  getAllOfficial,
  getAllPeserta,
} from "@/utils/admin/adminActions";

const Context = createContext<any>(null);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState<string | null>(null);

  const [kontingens, setKontingens] = useState<KontingenState[]>([]);
  const [selectedKontingen, setSelectedKontingen] = useState<KontingenState>(
    kontingenInitialValue
  );
  const [unconfirmedKongtingens, setUncofirmedKontingens] = useState<
    KontingenState[]
  >([]);
  const [kontingensLoading, setKontingensLoading] = useState(true);

  const [pesertas, setPesertas] = useState<PesertaState[]>([]);
  const [selectedPesertas, setSelectedPesertas] = useState<PesertaState[]>([]);
  const [pesertasLoading, setPesertasLoading] = useState(true);

  const [officials, setOfficials] = useState<OfficialState[]>([]);
  const [selectedOfficials, setSelectedOfficials] = useState<OfficialState[]>(
    []
  );
  const [officialsLoading, setOfficialsLoading] = useState(true);

  const [mode, setMode] = useState("");
  const [selectedKategori, setSelectedKategori] = useState({
    tingkatan: "",
    jenis: "",
    sabuk: "",
    jurus: "",
    kategori: "",
    gender: "",
  });

  const { user } = MyContext();

  useEffect(() => {
    refreshKontingens();
    refreshOfficials();
    refreshPesertas();
  }, []);

  const refreshAll = () => {
    refreshKontingens();
    refreshOfficials();
    refreshPesertas();
  };

  // GET KONTINGEN
  const refreshKontingens = async () => {
    setSelectedKontingen(kontingenInitialValue);
    setKontingensLoading(true);
    try {
      const { result, error } = await getAllKontingen();
      if (error) throw error;

      setKontingens(result);
      setKontingensLoading(false);
    } catch (error) {
      setError((error as { message: string }).message);
    }
  };

  // GET PESERTAS
  const refreshPesertas = async () => {
    setSelectedKontingen(kontingenInitialValue);
    setPesertasLoading(true);
    try {
      const { result, error } = await getAllPeserta();
      if (error) throw error;

      setPesertas(result);
      setPesertasLoading(false);
    } catch (error) {
      setError((error as { message: string }).message);
    }
  };

  // GET OFFICIALS
  const refreshOfficials = async () => {
    setSelectedKontingen(kontingenInitialValue);
    setOfficialsLoading(true);
    try {
      const { result, error } = await getAllOfficial();
      if (error) throw error;

      setOfficials(result);
      setOfficialsLoading(false);
    } catch (error) {
      setError((error as { message: string }).message);
    }
  };

  useEffect(() => {
    if (selectedKontingen.id) {
      resetKategori();
      setUncofirmedKontingens([]);
      setSelectedOfficials(
        getOfficialsByKontingen(officials, selectedKontingen.id)
      );
      setSelectedPesertas(
        getPesertasByKontingen(pesertas, selectedKontingen.id)
      );
    } else {
      setSelectedOfficials([]);
      setSelectedPesertas([]);
    }
  }, [selectedKontingen]);

  const getUnconfirmedKontingens = () => {
    setMode("kontingen");
    let selected: KontingenState[] = [];
    kontingens.map((kontingen) => {
      if (kontingen.unconfirmedPembayaranIds.length) selected.push(kontingen);
    });
    setUncofirmedKontingens(selected);
  };

  // CEK KUOTA
  const cekKuota = (
    tingkatanPertandingan: string,
    kategoriPertandingan: string,
    jenisKelamin: string
  ) => {
    let kuota = 32;
    let kuotaGanda = kuota * 2;
    let kuotaRegu = kuota * 3;
    if (!pesertasLoading) {
      pesertas.map((peserta) => {
        if (
          peserta.jenisKelamin == jenisKelamin &&
          peserta.kategoriPertandingan == kategoriPertandingan &&
          peserta.tingkatanPertandingan == tingkatanPertandingan
        ) {
          if (kategoriPertandingan.includes("Regu")) {
            kuotaRegu -= 1;
          } else if (kategoriPertandingan.includes("Ganda")) {
            kuotaGanda -= 1;
          } else {
            kuota -= 1;
          }
        }
      });
      return (
        <span>
          {kategoriPertandingan.includes("Regu")
            ? kuotaRegu
            : kategoriPertandingan.includes("Ganda")
            ? kuotaGanda
            : kuota}
        </span>
      );
    }
    return <InlineLoading />;
  };

  // RESET KATEGORI
  const resetKategori = () => {
    setSelectedKategori({
      tingkatan: "",
      jenis: "",
      sabuk: "",
      jurus: "",
      kategori: "",
      gender: "",
    });
  };

  // GET PESERTAS BASED ON KATEGORI
  useEffect(() => {
    if (selectedKategori.tingkatan) {
      let result: PesertaState[] = [];
      pesertas.map((peserta) => {
        if (selectedKategori.sabuk && selectedKategori.jurus) {
          if (
            peserta.jenisPertandingan == selectedKategori.jenis &&
            peserta.tingkatanPertandingan == selectedKategori.tingkatan &&
            peserta.kategoriPertandingan == selectedKategori.kategori &&
            peserta.jenisKelamin == selectedKategori.gender &&
            peserta.sabuk == selectedKategori.sabuk &&
            peserta.jurus == selectedKategori.jurus
          ) {
            result.push(peserta);
          }
        } else {
          if (
            peserta.jenisPertandingan == selectedKategori.jenis &&
            peserta.tingkatanPertandingan == selectedKategori.tingkatan &&
            peserta.kategoriPertandingan == selectedKategori.kategori &&
            peserta.jenisKelamin == selectedKategori.gender
          ) {
            result.push(peserta);
          }
        }
      });
      setSelectedPesertas(result);
    }
  }, [selectedKategori]);

  return (
    <Context.Provider
      value={{
        error,
        kontingens,
        kontingensLoading,
        setKontingens,
        refreshKontingens,
        pesertas,
        pesertasLoading,
        setPesertas,
        refreshPesertas,
        officials,
        officialsLoading,
        setOfficials,
        refreshOfficials,
        refreshAll,
        mode,
        setMode,
        selectedKontingen,
        setSelectedKontingen,
        cekKuota,
        selectedKategori,
        setSelectedKategori,
        selectedPesertas,
        setSelectedPesertas,
        selectedOfficials,
        setSelectedOfficials,
        getUnconfirmedKontingens,
        unconfirmedKongtingens,
        setUncofirmedKontingens,
        resetKategori,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const AdminContext = () => {
  return useContext(Context);
};
