import { supabase } from '@/utils/supabase';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const { userId, title, body } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' });
  }

  // Fetch the Expo push token from your database
  const { data: userToken, error } = await supabase
    .from('user_tokens')
    .select('expoPushToken')
    .eq('userId', userId)
    .single();

  if (error || !userToken?.expoPushToken) {
    return NextResponse.json({ error: 'Expo push token not found for the user' });
  }

  try {
    await axios.post(
      'https://exp.host/--/api/v2/push/send',
      {
        to: userToken.expoPushToken,
        title,
        body,
        sound: 'default',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

  }
}
