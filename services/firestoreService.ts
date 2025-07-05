import { db } from "@/firebase/firebaseConfig";
import type { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

import type { Stall } from "@/src/types/Stall";
<<<<<<< HEAD
import type { Review } from "@/src/types/reviewItem";
=======
>>>>>>> main

export function getStallDoc(id: string): Promise<DocumentSnapshot<DocumentData>> {
  const { doc, getDoc } = require("firebase/firestore");
  return getDoc(doc(db, "stalls", id));
}

export function getUserDoc(uid: string): Promise<DocumentSnapshot<DocumentData>> {
  const { doc, getDoc } = require("firebase/firestore");
  return getDoc(doc(db, "users", uid));
}

export async function getStallReviewDoc(id: string): Promise<Review[]> {
  const { doc, getDoc, collection, query, orderBy } = require("firebase/firestore");
  const reviewsRef = query(collection(db, "stalls", id, "reviews"), orderBy("timestamp", "desc"));
  const snapshot = getDoc(reviewsRef);
  const reviews = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),

  })) as Review[];
  return reviews;
}

export async function getUserReviewDoc(uid: string): Promise<Review[]> {
  const { doc, getDoc, collection, query, orderBy } = require("firebase/firestore");
  const reviewsRef = query(collection(db, "users", uid, "reviews"), orderBy("timestamp", "desc"));
  const snapshot = getDoc(reviewsRef);
  const reviews = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),

  })) as Review[];
  return reviews;
  
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





