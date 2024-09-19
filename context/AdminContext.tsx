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
import { reduceData } from "@/utils/functions";

const Context = createContext<any>(null);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState<string | null>(null);

  const [kontingens, setKontingens] = useState<KontingenState[]>([]);
  const [selectedKontingen, setSelectedKontingen] = useState<
    KontingenState | undefined
  >(undefined);
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

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    refreshKontingens();
    refreshOfficials();
    refreshPesertas();
  };

  // GET KONTINGEN
  const refreshKontingens = async () => {
    setSelectedKontingen(undefined);
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
    if (selectedKontingen) {
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

  // ADD
  const addKontingens = (newKontingens: KontingenState[]) => {
    const data = reduceData([
      ...kontingens,
      ...newKontingens,
    ]) as KontingenState[];
    setKontingens(data);
  };

  // DELETE
  const deleteKontingen = (id: string) => {
    setKontingens(kontingens.filter((item) => item.id != id));
  };

  // PESERTA
  // ADD
  const addPesertas = (newPesertas: PesertaState[]) => {
    const data = reduceData([...pesertas, ...newPesertas]) as PesertaState[];
    setPesertas(data);
  };
  // DELETE
  const deletePeserta = (id: string) => {
    setPesertas(pesertas.filter((item) => item.id != id));
  };

  // OFFICIAL
  // ADD
  const addOfficials = (newOfficials: OfficialState[]) => {
    const data = reduceData([...officials, ...newOfficials]) as OfficialState[];
    setOfficials(data);
  };
  // DELETE
  const deleteOfficial = (id: string) => {
    setOfficials(officials.filter((item) => item.id != id));
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
        addKontingens,
        deleteKontingen,
        pesertas,
        pesertasLoading,
        setPesertas,
        addPesertas,
        deletePeserta,
        officials,
        officialsLoading,
        setOfficials,
        addOfficials,
        deleteOfficial,
        fetchAll,
        mode,
        setMode,
        selectedKontingen,
        setSelectedKontingen,
        cekKuota,
        selectedKategori,
        setSelectedKategori,
        resetKategori,
        selectedPesertas,
        setSelectedPesertas,
        selectedOfficials,
        setSelectedOfficials,
        getUnconfirmedKontingens,
        unconfirmedKongtingens,
        setUncofirmedKontingens,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const AdminContext = () => {
  return useContext(Context) as {
    error: string;
    kontingens: KontingenState[];
    fetchKontingens: () => void;
    kontingensLoading: boolean;
    setKontingens: (kontingens: KontingenState[]) => void;
    addKontingens: (kontingens: KontingenState[]) => void;
    deleteKontingen: (id: string) => void;
    pesertas: PesertaState[];
    fetchPesertas: () => void;
    pesertasLoading: boolean;
    setPesertas: (pesertas: PesertaState[]) => void;
    addPesertas: (pesertas: PesertaState[]) => void;
    deletePeserta: (id: string) => void;
    officials: OfficialState[];
    fetchOfficials: () => void;
    officialsLoading: boolean;
    setOfficials: (officials: OfficialState[]) => void;
    addOfficials: (officials: OfficialState[]) => void;
    deleteOfficial: (id: string) => void;
    fetchAll: () => void;
    mode: string;
    setMode: (mode: string) => void;
    selectedKontingen: KontingenState | undefined;
    setSelectedKontingen: (kontingen: KontingenState | undefined) => void;
    cekKuota: (
      tingkatanPertandingan: string,
      kategoriPertandingan: string,
      jenisKelamin: string
    ) => JSX.Element;
    selectedKategori: {
      tingkatan: string;
      jenis: string;
      sabuk: string;
      jurus: string;
      kategori: string;
      gender: string;
    };
    setSelectedKategori: (value: {
      tingkatan: string;
      jenis: string;
      sabuk: string;
      jurus: string;
      kategori: string;
      gender: string;
    }) => void;
    resetKategori: () => void;
    selectedPesertas: PesertaState[];
    setSelectedPesertas: (pesertas: PesertaState[]) => void;
    selectedOfficials: OfficialState[];
    setSelectedOfficials: (officials: OfficialState[]) => void;
    getUnconfirmedKontingens: () => void;
    unconfirmedKongtingens: KontingenState[];
    setUncofirmedKontingens: (kontingens: KontingenState[]) => void;
  };
};
