import IsAuthorized from "@/components/halaman-pendaftaran/admin/IsAuthorized";
import { firestore } from "@/utils/firebase";
import { kontingenInitialValue } from "@/utils/formConstants";
import { KontingenState, OfficialState, PesertaState } from "@/utils/formTypes";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";

const KonfirmasiPembayaranPage = ({
  params,
}: {
  params: { idPembayaran: string };
}) => {
  const { idPembayaran } = params;
  const [kontingen, setKontingen] = useState(kontingenInitialValue);
  const [pesertas, setPesertas] = useState<PesertaState[]>([]);

  const getKontingen = () => {
    getDocs(
      query(
        collection(firestore, "kontingens"),
        where("idPembayaran", "array-contains", idPembayaran)
      )
    ).then((res) =>
      res.forEach((doc) => setKontingen(doc.data() as KontingenState))
    );
  };

  const getPesertas = () => {
    let result: any[] = [];
    getDocs(
      query(
        collection(firestore, "pesertas"),
        where("idPembayaran", "==", idPembayaran)
      )
    )
      .then((res) => res.forEach((doc) => result.push(doc.data())))
      .finally(() => setPesertas(result));
  };

  useEffect(() => {
    getKontingen();
    getPesertas();
  }, []);

  return (
    <div className="bg-white m-2 p-2">
      <IsAuthorized>
        <h1>Konfirmasi Pembayaran</h1>
      </IsAuthorized>
    </div>
  );
};
export default KonfirmasiPembayaranPage;
