// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: applicationDefault(),
  });
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify the token
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Check if user is admin (implement your admin check logic)
    const isAdmin = decodedToken.admin === true; // Adjust based on your admin claims

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      uid: decodedToken.uid,
      isAdmin: true 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}