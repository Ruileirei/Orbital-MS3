export async function signIn(email, password) {
  const { signInWithEmailAndPassword } = require('firebase/auth');
  const { auth } = require('@/firebase/firebaseConfig');
  return signInWithEmailAndPassword(auth, email, password);
}
