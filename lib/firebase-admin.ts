import * as admin from "firebase-admin";

function getPrivateKey(): string {
  const key = process.env.FIREBASE_PRIVATE_KEY ?? "";
  return key
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
    }),
  });
}

export const adminAuth = admin.auth();