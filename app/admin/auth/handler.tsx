"use server";
import admin from "firebase-admin";

import { applicationDefault } from "firebase-admin/app";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: applicationDefault(),
  });
}

export async function AdminAuthorizationSignUp(
  formdata: FormData
): Promise<{ setAdminState: boolean }> {
  let setAdminState = false;
  const adminEmail = formdata.get("adminEmail");

  if (typeof adminEmail !== "string") {
    console.error("Admin Email is not a valid string");
    return { setAdminState };
  }

  try {
    const response = await admin.auth().getUserByEmail(adminEmail);
    console.log("Found User");

    await admin.auth().setCustomUserClaims(response.uid, { admin: true });
    setAdminState = true;
  } catch (error: any) {
    console.error("Error setting custom claims:", error);

    if (error.code === "auth/user-not-found") {
      console.log("User not found");
    }

    setAdminState = false;
  }

  return { setAdminState };
}

export async function AdminAuthorizationLogin(
  formdata: FormData
): Promise<{ adminState: boolean }> {
  let adminState = false;

  const adminEmail = formdata.get("adminEmail");
  if (typeof adminEmail !== "string") {
    console.error("adminEmail is not a valid string");
    return { adminState };
  }

  try {
    const userRecord = await admin.auth().getUserByEmail(adminEmail);

    if (userRecord.customClaims && userRecord.customClaims.admin === true) {
      console.log("User is admin");
      adminState = true;
    } else {
      adminState = false;
    }
  } catch (error) {
    console.error("Error during login:", error);
    adminState = false;
  }

  return { adminState };
}
