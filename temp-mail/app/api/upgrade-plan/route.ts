import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { hasProCode } = await request.json();

        if (hasProCode) {
            // Here you could store the upgrade in a database
            // For now, we'll rely on the session callback to handle this
            
            return NextResponse.json({ 
                success: true, 
                message: 'Plan upgraded to Pro successfully!',
                plan: 'pro'
            });
        } else {
            return NextResponse.json({ message: 'Invalid upgrade request' }, { status: 400 });
        }

    } catch (error) {
        console.error('Error upgrading plan:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}