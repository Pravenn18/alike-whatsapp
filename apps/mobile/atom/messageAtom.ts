import { atom } from 'jotai';

export const messagesAtom = atom<{ sender: string; receiver: string; message: string; created_at: string }[]>([]);
