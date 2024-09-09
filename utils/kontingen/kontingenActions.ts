"use server";

import {
  DocumentData,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { KontingenState } from "../formTypes";
import { firestore } from "../firebase";
import { ServerAction } from "../constants";
import { action } from "../functions";
import { kontingenInitialValue } from "../formConstants";

// GET KONTINGEN
export const getKontingenByEmail = async (
  email: string
): Promise<ServerAction<KontingenState[]>> => {
  try {
    let result: DocumentData | KontingenState[] = [];
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "kontingens"),
        where("creatorEmail", "==", email)
      )
    );
    querySnapshot.forEach((doc) => result.push(doc.data()));

    return action.success(result as KontingenState[]);
  } catch (error) {
    return action.error(error);
  }
};

export const getKontingenByIdPembayaran = async (
  idPembayaran: string
): Promise<ServerAction<KontingenState>> => {
  try {
    let kontingen: KontingenState | undefined = undefined;
    const snapshot = await getDocs(
      query(
        collection(firestore, "kontingens"),
        where("idPembayaran", "array-contains", idPembayaran)
      )
    );
    snapshot.forEach((doc) => (kontingen = doc.data() as KontingenState));

    if (!kontingen) throw { message: "Kontingen not found" };

    return action.success(kontingen);
  } catch (error) {
    return action.error(error);
  }
};

export const managePersonOnKontingen = async (
  kontingen: KontingenState,
  type: "peserta" | "official",
  personId: string,
  remove: boolean = false
): Promise<ServerAction<KontingenState>> => {
  try {
    let updatedKontingen = { ...kontingen };
    const key: "pesertas" | "officials" = `${type}s`;

    if (remove) {
      updatedKontingen[key] = updatedKontingen[key].filter(
        (item) => item != personId
      );
    } else {
      updatedKontingen[key] = [...updatedKontingen[key], personId];
      if (type == "peserta") updatedKontingen.pembayaran = false;
    }

    await updateDoc(doc(firestore, "kontingens", kontingen.id), {
      updatedKontingen,
    });

    return action.success(updatedKontingen);
  } catch (error) {
    return action.error(error);
  }
};
