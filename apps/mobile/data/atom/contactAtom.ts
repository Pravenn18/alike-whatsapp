import { atom } from "jotai";

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export const contactsAtom = atom<Contact[]>([]);
