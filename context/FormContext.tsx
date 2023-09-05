"use client";
// import { kontingenInitialValue } from "@/utils/formConstants";
import { KontingenState, OfficialState, PesertaState } from "@/utils/formTypes";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { MyContext } from "./Context";
import { getKontingen, getOfficials, getPesertas } from "@/utils/formFunctions";
import { kontingenInitialValue } from "@/utils/formConstants";

const Context = createContext<any>(null);

export const FormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [kontingen, setKontingen] = useState<KontingenState>(
    kontingenInitialValue
  );
  const [error, setError] = useState<string | null>(null);
  const [pesertas, setPesertas] = useState<PesertaState[]>([]);
  const [officials, setOfficials] = useState<OfficialState[]>([]);
  const [kontingenLoading, setKontingenLoading] = useState(true);
  const [officialsLoading, setOfficialsLoading] = useState(true);
  const [pesertasLoading, setPesertasLoading] = useState(true);

  const { user } = MyContext();

  useEffect(() => {
    if (user) {
      refreshKontingen();
      refreshOfficials();
      refreshPesertas();
    }
  }, [user]);

  // GET KONTINGEN
  const refreshKontingen = () => {
    console.log("refreshKontingen");
    setKontingenLoading(true);
    getKontingen(user.uid)
      .then((res: any) => {
        res ? setKontingen(res) : setKontingen(kontingenInitialValue);
        setKontingenLoading(false);
      })
      .catch((error) => setError(error));
  };

  // GET OFFICIALS
  const refreshOfficials = () => {
    console.log("refreshOfficials");
    setOfficialsLoading(true);
    getOfficials(user.uid)
      .then((res: any) => {
        setOfficials(res);
        setOfficialsLoading(false);
      })
      .catch((error) => setError(error));
  };

  // GET PESERTA
  const refreshPesertas = () => {
    console.log("refreshPesertas");
    setPesertasLoading(true);
    getPesertas(user.uid)
      .then((res: any) => {
        setPesertas(res);
        setPesertasLoading(false);
      })
      .catch((error) => setError(error));
  };
  return (
    <Context.Provider
      value={{
        error,
        kontingen,
        kontingenLoading,
        setKontingen,
        kontingenInitialValue,
        refreshKontingen,
        pesertas,
        pesertasLoading,
        setPesertas,
        refreshPesertas,
        officials,
        officialsLoading,
        setOfficials,
        refreshOfficials,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const FormContext = () => {
  return useContext(Context);
};
