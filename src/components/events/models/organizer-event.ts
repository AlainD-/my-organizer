import { Timestamp } from 'firebase/firestore';

export interface OrganizerEvent {
  id: string;
  date: Timestamp;
  title: string;
  description: string;
  icon: string;
  colour: string;
}
