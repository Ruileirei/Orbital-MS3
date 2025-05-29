const admin = require('firebase-admin');
const serviceAccount = require("./foodfindr-183a6-firebase-adminsdk-fbsvc-50b6e5ecf9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const stalls = [
    


    



];

async function addStalls() {
    const batch = db.batch();

    for (let stall of stalls) {
        const stallRef = db.collection('stalls');
        const querySnapshot = await stallRef
            .where("name", "==", stall.name)
            .where("location", "==", stall.location)
            .get();
        
        if (querySnapshot.empty) {
            const docRef = db.collection('stalls').doc();
            batch.set(docRef, stall);
            console.log(`Adding new stall: ${stall.name}`);
        } else {
             console.log(`Stall already exists: ${stall.name}`);
        }
    }
    try {
        await batch.commit();
        console.log("success");
    } catch (error) {
        console.log(error);
    }
}

addStalls();