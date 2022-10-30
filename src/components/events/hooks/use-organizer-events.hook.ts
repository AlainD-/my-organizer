import { collection, DocumentData, onSnapshot, orderBy, query, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { firestore } from '../../../startup/firebase';
import { OrganizerEvent } from '../models/organizer-event';

export function useOrganizerEvents(): {organizerEvents: OrganizerEvent[]} {
  const [organizerEvents, setOrganizerEvents] = useState<OrganizerEvent[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot<DocumentData>(query(collection(firestore, 'events'), orderBy('date', 'asc')), {includeMetadataChanges: true}, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const fetchedEvents: OrganizerEvent[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({id: doc.id, ...doc.data()} as OrganizerEvent));
      setOrganizerEvents(() => fetchedEvents);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {organizerEvents};
}
