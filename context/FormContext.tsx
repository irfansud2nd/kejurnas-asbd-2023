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
  const [kontingens, setKontingens] = useState<KontingenState[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pesertas, setPesertas] = useState<PesertaState[]>([]);
  const [officials, setOfficials] = useState<OfficialState[]>([]);
  const [kontingensLoading, setkontingensLoading] = useState(true);
  const [officialsLoading, setOfficialsLoading] = useState(true);
  const [pesertasLoading, setPesertasLoading] = useState(true);

  const { user } = MyContext();

  useEffect(() => {
    if (user) {
      refreshKontingens();
      refreshOfficials();
      refreshPesertas();
    }
  }, [user]);

  // GET KONTINGEN
  const refreshKontingens = () => {
    console.log("refreshKontingen");
    setkontingensLoading(true);
    getKontingen(user.uid)
      .then((res: any) => {
        setKontingens(res);
        setkontingensLoading(false);
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
        kontingens,
        kontingensLoading,
        setKontingens,
        kontingenInitialValue,
        refreshKontingens,
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
