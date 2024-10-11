"use server";
import admin from "firebase-admin";
import adminKey from "@/firebase/quizzr-4bdde-firebase-adminsdk-l3pg1-f0472c1195.json";

// Initialize Firebase Admin SDK only if it hasn't been initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(adminKey),
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
    
    // Set custom claims to make the user an admin
    await admin.auth().setCustomUserClaims(response.uid, { admin: true });
    setAdminState = true;
  } catch (error: any) {
    console.error("Error setting custom claims:", error);
    
    if (error.code === "auth/user-not-found") {
      console.log("User not found");
    }

    // Handle other possible errors
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

    // Check if the custom claim 'admin' is set to true
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
