import { useState } from "react";
import { Button, Modal, FlatList, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAtom } from "jotai";
import contactsAtom from "@/data";
import useManageContacts from "@/behaviours";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatsTopBar from "@/components/chats-top-bar";
import ChatsList from "@/components/chat-list";

export default function HomeScreen() {
  const [contacts] = useAtom(contactsAtom);
  const { fetchContacts, addContact } = useManageContacts();
  const [contactList, setContactList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     const setupPushNotifications = async () => {
//       const expoPushToken = await registerForPushNotificationsAsync();
//       console.log("Expo Push Token:", JSON.stringify(expoPushToken));
//     };
//     setupPushNotifications();
//   }, []);

  const handleOpenContacts = async () => {
    const fetchedContacts = await fetchContacts();
    setContactList(fetchedContacts);
    setModalVisible(true);
  };

  const handleAddContact = (contact) => {
    addContact(contact);
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex items-center bg-gray-900 h-full">
      <ChatsTopBar />
      <Button title="Add Contact" onPress={handleOpenContacts} />
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatsList name={item.name} message="" phone={item.phone} />
        )}
      />
      <Modal visible={isModalVisible} animationType="slide">
        <FlatList
          data={contactList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAddContact(item)}>
              <Text>{item.name} - {item.phone}</Text>
            </TouchableOpacity>
          )}
        />
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
}