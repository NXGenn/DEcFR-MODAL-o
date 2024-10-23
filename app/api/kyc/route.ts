import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';

export async function POST(req: Request) {
  try {
    const { userId, documentType, documentFront, documentBack } = await req.json();

    // Verify that the user exists
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // In a real-world scenario, you would send these documents to a KYC provider
    // For this example, we'll just update the user's metadata to indicate KYC is complete
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        kycStatus: 'completed',
        kycCompletedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ message: 'KYC completed successfully' });
  } catch (error) {
    console.error('KYC processing error:', error);
    return NextResponse.json({ error: 'Failed to process KYC' }, { status: 500 });
  }
}