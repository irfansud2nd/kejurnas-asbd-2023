"use client";
// import { kontingenInitialValue } from "@/utils/formConstants";
import { KontingenState, OfficialState, PesertaState } from "@/utils/formTypes";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { MyContext } from "./Context";
import { kontingenInitialValue } from "@/utils/formConstants";
import {
  getAllKontingen,
  getAllOfficial,
  getAllPeserta,
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";

const Context = createContext<any>(null);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [kontingens, setKontingens] = useState<KontingenState[]>([]);
  const [pesertas, setPesertas] = useState<PesertaState[]>([]);
  const [officials, setOfficials] = useState<OfficialState[]>([]);
  const [kontingensLoading, setKontingensLoading] = useState(true);
  const [officialsLoading, setOfficialsLoading] = useState(true);
  const [pesertasLoading, setPesertasLoading] = useState(true);
  const [mode, setMode] = useState("");
  const [selectedKontingen, setSelectedKontingen] = useState<KontingenState>(
    kontingenInitialValue
  );

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
  const refreshKontingens = () => {
    setSelectedKontingen(kontingenInitialValue);
    console.log("refreshKontingen");
    setKontingensLoading(true);
    getAllKontingen()
      .then((res: any) => {
        setKontingens(res);
        setKontingensLoading(false);
      })
      .catch((error) => setError(error));
  };

  // GET OFFICIALS
  const refreshOfficials = () => {
    setSelectedKontingen(kontingenInitialValue);
    console.log("refreshOfficials");
    setOfficialsLoading(true);
    getAllOfficial()
      .then((res: any) => {
        setOfficials(res);
        setOfficialsLoading(false);
      })
      .catch((error) => setError(error));
  };

  // GET PESERTA
  const refreshPesertas = () => {
    setSelectedKontingen(kontingenInitialValue);
    console.log("refreshPesertas");
    setPesertasLoading(true);
    getAllPeserta()
      .then((res: any) => {
        setPesertas(res);
        setPesertasLoading(false);
      })
      .catch((error) => setError(error));
  };

  useEffect(() => {
    if (selectedKontingen.id) {
      setKontingens([selectedKontingen]);
      setOfficials(getOfficialsByKontingen(selectedKontingen.id, officials));
      setPesertas(getPesertasByKontingen(selectedKontingen.id, pesertas));
    } else {
      refreshAll();
    }
  }, [selectedKontingen]);

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
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const AdminContext = () => {
  return useContext(Context);
};
