import { useEffect, useState } from "react";
import { Button, Modal, FlatList, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAtom } from "jotai";
import contactsAtom from "@/data";
import useManageContacts from "@/behaviours";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatsTopBar from "@/components/chats-top-bar";
import ChatsList from "@/components/chat-list";
import { Contact } from "@/data/atom/contactAtom";
import { phoneAtom } from "@/data/atom/userAtom";
import { addContactToDb, sendNotification } from "@/services/apiService";

export default function HomeScreen() {
  const [contacts, setContacts] = useAtom(contactsAtom);
  const { fetchContacts, fetchContact } = useManageContacts();
  const [contactList, setContactList] = useState<{ id: string | undefined; name: string; phone: string; }[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [phone] = useAtom(phoneAtom);

  console.log('phone:', JSON.stringify(phone));

  const handleOpenContacts = async () => {
    const fetchedContacts = await fetchContacts();
    setContactList(fetchedContacts);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchContact && fetchContact(phone);
  }, [phone]);

  const formatPhoneNumber = (phoneNumber: string): string => {
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    return cleanedNumber.slice(-10);
  };

  const handleAddContact = async (contact: Contact) => {
    const formattedPhone = formatPhoneNumber(contact.phone);
    const contactData = await addContactToDb(formattedPhone, contact.name, phone);
    console.log('Contact added:', JSON.stringify(contactData));
    setModalVisible(false);
  };
    const handleSendNotification = async () => {
      const response = await sendNotification(phone, 'Test Notification', 'This is a test notification');
      console.log('Notification sent:', JSON.stringify(response));
    }
  return (
    <SafeAreaView className="flex items-center bg-gray-900 h-full">
      <ChatsTopBar />
      <Button title="Add Contact" onPress={handleOpenContacts} />
      <FlatList
        className= "w-full p-2"
        data={contacts}
        renderItem={({ item }) => (
          <ChatsList name={item.name} message="" phone={item.phone} />
        )}
      />
      <Button title="send notification" onPress={handleSendNotification} />
      <Modal visible={isModalVisible} animationType="slide">
        <FlatList
          className="w-full p-4 bg-gray-500"
          data={contactList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAddContact({ ...item || '' })}>
              <Text className="bg-red-200 p-1 mb-1 h-10">{item.name} - {item.phone}</Text>
            </TouchableOpacity>
          )}
        />
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
}