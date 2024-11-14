import * as Contacts from 'expo-contacts';
import { useAtom } from "jotai";
import contactsAtom from "../../data";
import { Contact } from "../../data/atom/contactAtom";

export const useManageContacts = () => {
  const [contacts, setContacts] = useAtom(contactsAtom);

  const fetchContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      if (data.length > 0) {
        return data.map((contact) => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phoneNumbers?.[0]?.number || "",
        }));
      }
    }
    return [];
  };

  const addContact = (contact: Contact) => {
    setContacts((prevContacts) => [...prevContacts, contact]);
  };

  return { contacts, fetchContacts, addContact };
};
