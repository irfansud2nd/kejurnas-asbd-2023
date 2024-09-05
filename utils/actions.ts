"use server";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { firestore, storage } from "./firebase";
import { action } from "./functions";
import {
  DocumentData,
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ServerAction } from "./constants";

export const uploadFile = async (
  formData: FormData
): Promise<ServerAction<string>> => {
  const file = formData.get("file") as File;
  const directory = formData.get("directory") as string;

  try {
    if (!file || !directory) throw new Error("Invalid identifier");

    const snapshot = await uploadBytes(ref(storage, directory), file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return action.success(downloadUrl);
  } catch (error) {
    return action.error(error);
  }
};

export const deleteFile = async (
  directory: string
): Promise<ServerAction<string>> => {
  try {
    if (!directory) throw new Error("Invalid identifier");

    await deleteObject(ref(storage, directory));

    return action.success("success");
  } catch (error) {
    return action.error(error);
  }
};

export const getNewDocRef = async (collectionName: string) => {
  return doc(collection(firestore, collectionName));
};

export const createData = async <T>(
  docRef: DocumentReference<DocumentData, DocumentData>,
  data: T
): Promise<ServerAction<T>> => {
  try {
    await setDoc(docRef, data as any);
    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const updateData = async <T>(
  collectionName: string,
  data: T
): Promise<ServerAction<T>> => {
  try {
    const { id } = data as { id: string };
    if (!id) action.error({ message: "No ID" });
    await updateDoc(doc(firestore, collectionName, id), data as any);
    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const deleteData = async (
  collectionName: string,
  docId: string
): Promise<ServerAction<string>> => {
  try {
    await deleteDoc(doc(firestore, collectionName, docId));
    return action.success("success");
  } catch (error) {
    return action.error(error);
  }
};
