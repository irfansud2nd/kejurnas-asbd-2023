"use client";

import { firestore } from "@/utils/firebase";
import { kontingenInitialValue } from "@/utils/formConstants";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const KontingenPage = ({ params }: { params: { id: string } }) => {
  const [kontingen, setKontingen] = useState<KontingenState>(
    kontingenInitialValue
  );
  const [pesertas, setPesertas] = useState<PesertaState[]>([]);
  const idKontingen = params.id;
  const getKontingen = () => {
    getDocs(
      query(collection(firestore, "kontingens"), where("id", "==", idKontingen))
    ).then((res) =>
      res.forEach((doc) => setKontingen(doc.data() as KontingenState))
    );
  };
  useEffect(() => {
    getKontingen();
  }, []);
  return (
    <div className="p-2 m-2 bg-white rounded-md">
      <h1 className="text-xl font-bold">Kontingen {kontingen.namaKontingen}</h1>
    </div>
  );
};
export default KontingenPage;
