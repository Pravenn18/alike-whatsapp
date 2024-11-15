import { supabase } from '@/utils/supabase';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, title, body } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Fetch the Expo push token from your database
  const { data: userToken, error } = await supabase
    .from('user_tokens')
    .select('expoPushToken')
    .eq('userId', userId)
    .single();

  if (error || !userToken?.expoPushToken) {
    return res.status(404).json({ error: 'Expo push token not found for the user' });
  }

  try {
    const response = await axios.post(
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

    console.log("Notification sent:", response.data);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error sending notification:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
}
