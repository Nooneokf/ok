
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const VALID_PRO_CODE = 'FREEPRO2024';

export async function POST(request: Request) {
    try {
        const { code } = await request.json();
        const session = await getServerSession(authOptions);

        if (!code) {
            return NextResponse.json({ message: 'Redeem code is required' }, { status: 400 });
        }

        // Check if the provided code matches our specific pro code
        if (code.toUpperCase() === VALID_PRO_CODE) {
            // If user is signed in, we can potentially update their session
            // For now, we'll store the redemption and let them sign in
            
            // You could store this in a database here for persistence
            // For now, we'll rely on the session callback to check
            
            return NextResponse.json({ 
                success: true, 
                message: 'Code redeemed successfully! Please sign in with Discord to activate your pro plan.',
                hasProAccess: true
            });
        } else {
            return NextResponse.json({ message: 'Invalid redeem code' }, { status: 400 });
        }

    } catch (error) {
        console.error('Error processing redeem code:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
