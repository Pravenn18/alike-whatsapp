import { NextApiRequest, NextApiResponse } from 'next';
import Twilio from 'twilio';

const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function sendOtp(req: NextApiRequest, res: NextApiResponse) {
  const { phone, otp } = req.body;
  
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required.' });
  }

  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    res.status(200).json({ message: 'OTP sent successfully', sid: message.sid });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
}
