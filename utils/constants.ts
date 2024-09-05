import { FirebaseError } from "firebase/app";
import { Id } from "react-toastify";

export const navs = ["kontingen", "official", "peserta", "pembayaran"];

export type ServerAction<T> =
  | { result: T; error: null }
  | { result: null; error: FirebaseError };

export type ToastId = React.MutableRefObject<Id | null>;
