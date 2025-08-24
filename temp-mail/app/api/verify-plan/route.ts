import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { isUserUpgraded } from '../upgrade-plan/route';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { userId } = await request.json();

        // Verify the user ID matches the session
        if (userId !== session.user.id) {
            return NextResponse.json({ message: 'Invalid user verification' }, { status: 403 });
        }

        // Check if user has upgraded status
        const isUpgraded = isUserUpgraded(userId);
        
        return NextResponse.json({
            plan: isUpgraded ? 'pro' : 'free',
            hasProCode: isUpgraded,
            verified: true
        });

    } catch (error) {
        console.error('Error verifying plan:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}