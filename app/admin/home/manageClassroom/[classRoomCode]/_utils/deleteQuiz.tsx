"use server";
import admin from "firebase-admin";

import { applicationDefault } from "firebase-admin/app";

if (!admin.apps.length) {
	admin.initializeApp({
		credential: applicationDefault(),
	});
}
const db = admin.firestore();

export async function deleteDocumentAndSubcollections(docPath: string) {
	try {
		const docRef = db.doc(docPath);

		const subcollections = await docRef.listCollections();

		for (const subcollection of subcollections) {
			const subcollectionRef = db.collection(subcollection.path);
			const snapshot = await subcollectionRef.get();

			for (const doc of snapshot.docs) {
				await deleteDocumentAndSubcollections(doc.ref.path);
			}
		}

		await docRef.delete();
		console.log(
			`Successfully deleted document and all subcollections: ${docPath}`
		);
	} catch (error) {
		console.error("Error deleting document and subcollections:", error);
	}
}
