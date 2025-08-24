
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Secure redemption codes storage (in production, this should be in a database)
const VALID_REDEMPTION_CODES = new Set([
  'TEMPMAIL_PRO_2024',
  'PREMIUM_ACCESS_2024',
  'UPGRADE_NOW_2024'
]);

// Track used codes per user (in production, store in database)
const usedCodes = new Map<string, Set<string>>();

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized. Please sign in first.' }, { status: 401 });
        }

        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ message: 'Invalid code format' }, { status: 400 });
        }

        const normalizedCode = code.trim().toUpperCase();
        const userId = session.user.id;

        // Check if code is valid
        if (!VALID_REDEMPTION_CODES.has(normalizedCode)) {
            return NextResponse.json({ message: 'Invalid redemption code' }, { status: 400 });
        }

        // Check if user already used this code
        const userUsedCodes = usedCodes.get(userId) || new Set();
        if (userUsedCodes.has(normalizedCode)) {
            return NextResponse.json({ message: 'Code already redeemed by this account' }, { status: 400 });
        }

        // Mark code as used by this user
        userUsedCodes.add(normalizedCode);
        usedCodes.set(userId, userUsedCodes);

        return NextResponse.json({ 
            success: true, 
            message: 'Pro code redeemed successfully! Your account will be upgraded.',
            validCode: true
        });

    } catch (error) {
        console.error('Error redeeming code:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
