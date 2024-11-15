import { supabase } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST (req: NextRequest) {
  try {
    const { reciever_id, sender_id, reciever_name  } = await req.json();
    if (!reciever_id || !sender_id) {
      return NextResponse.json({ error: 'reciever_id and sender_id are required' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
    const { data } = await supabase
    .from('messages')
    .select('id')
    .eq('reciever_id', reciever_id)
    .eq('sender_id', sender_id)

    // Store or update the expoPushToken in your database for the current user
    if(data && data.length === 0) {
    await supabase
      .from('messages')
      .insert({ 'reciever_id': reciever_id, 'sender_id': sender_id, 'reciever_name': reciever_name });
    }

    return NextResponse.json({ success: true }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}

// Handle OPTIONS method for CORS preflight requests
export async function OPTIONS () {
  return NextResponse.json({}, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}