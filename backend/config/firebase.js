const admin = require("firebase-admin");
require("dotenv").config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is missing.");
}

let serviceAccount;

try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
    throw new Error(
        "FIREBASE_SERVICE_ACCOUNT contains invalid JSON."
    );
}

if (!serviceAccount.project_id) {
    throw new Error("Firebase service account is missing project_id.");
}

if (!serviceAccount.client_email) {
    throw new Error("Firebase service account is missing client_email.");
}

if (!serviceAccount.private_key) {
    throw new Error("Firebase service account is missing private_key.");
}

serviceAccount.private_key = serviceAccount.private_key.replace(
    /\\n/g,
    "\n"
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log("Firebase Admin connected successfully.");

module.exports = db;