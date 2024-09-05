"use server";

import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { OfficialState } from "../formTypes";
import { firestore } from "../firebase";
import { ServerAction } from "../constants";
import { action } from "../functions";

// GET OFFICIAL
export const getOfficialsByEmail = async (
  email: string
): Promise<ServerAction<OfficialState[]>> => {
  try {
    let result: DocumentData | OfficialState[] = [];
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "officials"),
        where("creatorEmail", "==", email)
      )
    );
    querySnapshot.forEach((doc) => result.push(doc.data()));

    return action.success(result as OfficialState[]);
  } catch (error) {
    return action.error(error);
  }
};
