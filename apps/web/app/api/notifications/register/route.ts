import { supabase } from '@/utils/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { expoPushToken, phone } = await req.body;
    console.log("entered");
    console.log("expoToken", JSON.stringify(expoPushToken));
    console.log("phone", JSON.stringify(phone));

    if (!phone || !expoPushToken) {
      return res.status(400).json({ error: 'Phone number and FCM token are required' });
    }

    // Store or update the expoPushToken in your database for the current user
    const { error } = await supabase
      .from('users')
      .upsert({ fcm: expoPushToken, phone }, { onConflict: 'phone' });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}