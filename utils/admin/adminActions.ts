"use server";

import { DocumentData, collection, getDocs } from "firebase/firestore";
import { KontingenState, OfficialState, PesertaState } from "../formTypes";
import { firestore } from "../firebase";
import { ServerAction } from "../constants";
import { action } from "../functions";

// GET KONTINGEN
export const getAllKontingen = async (): Promise<
  ServerAction<KontingenState[]>
> => {
  try {
    let result: DocumentData | KontingenState[] | [] = [];
    const querySnapshot = await getDocs(collection(firestore, "kontingens"));
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return action.success(result as KontingenState[]);
  } catch (error) {
    return action.error(error);
  }
};

// GET PESERTA
export const getAllPeserta = async (): Promise<
  ServerAction<PesertaState[]>
> => {
  try {
    let result: DocumentData | PesertaState[] | [] = [];
    const querySnapshot = await getDocs(collection(firestore, "pesertas"));
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return action.success(result as PesertaState[]);
  } catch (error) {
    return action.error(error);
  }
};

// GET OFFICIAL
export const getAllOfficial = async (): Promise<
  ServerAction<OfficialState[]>
> => {
  try {
    let result: DocumentData | OfficialState[] | [] = [];
    const querySnapshot = await getDocs(collection(firestore, "officials"));
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return action.success(result as OfficialState[]);
  } catch (error) {
    return action.error(error);
  }
};
