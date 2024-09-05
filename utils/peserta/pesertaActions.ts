"use server";

import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { PesertaState } from "../formTypes";
import { firestore } from "../firebase";
import { ServerAction } from "../constants";
import { action } from "../functions";

// GET PESERTAS
export const getPesertasByEmail = async (
  userEmail: string
): Promise<ServerAction<PesertaState[]>> => {
  try {
    let result: DocumentData | PesertaState[] | [] = [];
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "pesertas"),
        where("creatorEmail", "==", userEmail)
      )
    );

    querySnapshot.forEach((doc) => result.push(doc.data()));

    return action.success(result as PesertaState[]);
  } catch (error) {
    return action.error(error);
  }
};
