export async function registerUser(email, password) {
  const { createUserWithEmailAndPassword } = require('firebase/auth');
  const { auth } = require('@/firebase/firebaseConfig');
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function saveUserData(uid, data) {
  const { doc, setDoc } = require('firebase/firestore');
  const { db } = require('@/firebase/firebaseConfig');
  return setDoc(doc(db, 'users', uid), data);
}
