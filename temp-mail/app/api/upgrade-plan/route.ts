import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Store upgraded users (in production, use database)
const upgradedUsers = new Set<string>();

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { validCode } = await request.json();

        // Only upgrade if the user has a valid redeemed code
        if (validCode === true) {
            const userId = session.user.id;
            
            // Mark user as upgraded
            upgradedUsers.add(userId);
            
            return NextResponse.json({ 
                success: true, 
                message: 'Plan upgraded to Pro successfully!',
                plan: 'pro'
            });
        } else {
            return NextResponse.json({ message: 'Invalid upgrade request - valid code required' }, { status: 400 });
        }

    } catch (error) {
        console.error('Error upgrading plan:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// Helper function to check if user is upgraded
export function isUserUpgraded(userId: string): boolean {
    return upgradedUsers.has(userId);
}