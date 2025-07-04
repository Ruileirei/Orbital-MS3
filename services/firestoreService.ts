import { db } from "@/firebase/firebaseConfig";
import type { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

import type { Stall } from "@/src/types/Stall";

export function getStallDoc(id: string): Promise<DocumentSnapshot<DocumentData>> {
  const { doc, getDoc } = require("firebase/firestore");
  return getDoc(doc(db, "stalls", id));
}

export function getUserDoc(uid: string): Promise<DocumentSnapshot<DocumentData>> {
  const { doc, getDoc } = require("firebase/firestore");
  return getDoc(doc(db, "users", uid));
}

export function getStallReviewDoc(id: string): Promise<DocumentSnapshot<DocumentData>> {
  const { doc, getDoc } = require("firebase/firestore");
  return getDoc(doc(db, "stalls", id, "reviews"));
}

export function getUserReviewDoc(uid: string): Promise<DocumentSnapshot<DocumentData>> {
  const { doc, getDoc } = require("firebase/firestore");
  return getDoc(doc(db, "users", uid, "reviews"));
}

export function updateUserDoc(uid: string, data: any): Promise<void> {
  const { doc, updateDoc } = require("firebase/firestore");
  return updateDoc(doc(db, "users", uid), data);
}

export function arrayRemove(...args: any[]): any {
  return require("firebase/firestore").arrayRemove(...args);
}

export function arrayUnion(...args: any[]): any {
  return require("firebase/firestore").arrayUnion(...args);
}

export async function fetchUserData(uid: string): Promise<DocumentSnapshot<DocumentData>> {
  const { doc, getDoc } = require("firebase/firestore");
  const userRef = doc(db, 'users', uid);
  return getDoc(userRef);
}

export async function fetchAllStalls(): Promise<Stall[]> {
  const { collection, getDocs } = require("firebase/firestore");
  const snap = await getDocs(collection(db, 'stalls'));
  return snap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  })) as Stall[];
}





