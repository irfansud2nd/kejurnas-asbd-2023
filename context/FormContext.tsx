"use client";

import { KontingenState, OfficialState, PesertaState } from "@/utils/formTypes";
import { useState, useEffect, createContext, useContext } from "react";
import { MyContext } from "./Context";
import { getKontingenByEmail } from "@/utils/kontingen/kontingenActions";
import { getPesertasByEmail } from "@/utils/peserta/pesertaActions";
import { getOfficialsByEmail } from "@/utils/official/officialActions";
import { FirebaseError } from "firebase/app";
import { reduceData } from "@/utils/functions";

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
  const [kontingensLoading, setKontingensLoading] = useState(true);
  const [officialsLoading, setOfficialsLoading] = useState(true);
  const [pesertasLoading, setPesertasLoading] = useState(true);

  const { user } = MyContext();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchPesertas = async () => {
    try {
      setPesertasLoading(true);

      const { result, error } = await getPesertasByEmail(user.email);

      if (error) throw error;

      setPesertas(result);
      setPesertasLoading(false);
    } catch (error: any) {
      setError((error as FirebaseError).message);
    }
  };

  const fetchOfficials = async () => {
    try {
      setOfficialsLoading(true);

      const { result, error } = await getOfficialsByEmail(user.email);

      if (error) throw error;

      setOfficials(result);
      setOfficialsLoading(false);
    } catch (error: any) {
      setError((error as FirebaseError).message);
    }
  };

  const fetchData = async () => {
    fetchKontingen();
    fetchPesertas();
    fetchOfficials();
  };

  // KONTINGEN
  // FETCH

  const fetchKontingen = async () => {
    try {
      setKontingensLoading(true);

      const { result, error } = await getKontingenByEmail(user.email);

      if (error) throw error;

      setKontingens(result);
      setKontingensLoading(false);
    } catch (error: any) {
      setError((error as FirebaseError).message);
    }
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

  return (
    <Context.Provider
      value={{
        error,
        addKontingens,
        deleteKontingen,
        kontingens,
        kontingensLoading,
        addPesertas,
        deletePeserta,
        pesertas,
        pesertasLoading,
        addOfficials,
        deleteOfficial,
        officials,
        officialsLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const FormContext = () => {
  return useContext(Context) as {
    error: string;
    addKontingens: (kontingen: KontingenState[]) => void;
    deleteKontingen: (id: string) => void;
    kontingens: KontingenState[];
    kontingensLoading: boolean;
    addPesertas: (peserta: PesertaState[]) => void;
    deletePeserta: (id: string) => void;
    pesertas: PesertaState[];
    pesertasLoading: boolean;
    addOfficials: (official: OfficialState[]) => void;
    deleteOfficial: (id: string) => void;
    officials: OfficialState[];
    officialsLoading: boolean;
  };
};
