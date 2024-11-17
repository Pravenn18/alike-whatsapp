import axios from 'axios';

const API_BASE_URL = "https://alike-whatsapp.vercel.app";
// localIP :http://192.168.0.104:3000

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendNotification = async (userId: string, title: string, body: string) => {
  try {
    const response = await apiClient.post('/api/notifications/send', {
      userId,
      title,
      body,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

export const addContactToDb = async (formatPhoneNumber: string, recieverName: string, phone: string) => {
  try {
    const response = await apiClient.post('/api/user/add-user-from-contact', {
      reciever_id: formatPhoneNumber,
      sender_id: phone,
      reciever_name: recieverName,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
};


export const addExpoTokenToDb = async (expoPushToken: string, phone: string) => {
  try {
    const response = await apiClient.post('/api/notifications/register', {
      expoPushToken,
      phone,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding expo token:', error);
    throw error;
  }
};