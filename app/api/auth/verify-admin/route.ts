// app/api/auth/verify-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import { applicationDefault } from "firebase-admin/app";
import { checkAdmin } from '@/utils/checkAdmin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: applicationDefault(),
  });
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json(
      { error: 'No token provided' },
      { status: 401 }
    );
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const isAdmin = await checkAdmin(token);

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