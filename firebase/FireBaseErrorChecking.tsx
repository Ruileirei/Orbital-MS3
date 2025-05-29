import { FirebaseError } from "firebase/app";

export function isFirebaseError(error: any): error is FirebaseError {
  return error && typeof error.code === "string" && typeof error.message === "string";
}