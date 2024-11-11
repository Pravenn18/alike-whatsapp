import { supabase } from "./supabase";

export const sendMessage = async (sender: string, receiver: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ sender_id: sender, reciever_id: receiver, message: content, status: "Sent" }]);

  if (error) {
    console.error('Error sending message:', error);
  }
  
  return data;
};
// npm install --global eas-cli && eas init --id 4e1fe2f9-b8fc-4d3d-88ac-3281f702e4bd
// AC6E18ATLNR5LG7GJ2SVPQKR