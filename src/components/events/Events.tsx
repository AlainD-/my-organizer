import { collection, DocumentData, onSnapshot, orderBy, query, QueryDocumentSnapshot, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Timeline, TimelineTemplateType } from 'primereact/timeline';
import { useEffect, useState } from 'react';
import { firestore } from '../../startup/firebase';
import './Events.css';

interface OrganizerEvent {
  date: Timestamp;
  title: string;
  description: string;
  icon: string;
  colour: string;
}

export default function Events({displayMode}: {displayMode: 'compact'|'large'}) {
  const [events, setEvents] = useState<OrganizerEvent[]>();

  const customizedMarker: TimelineTemplateType = (event: OrganizerEvent) => {
    const backgroundColor: string = `#${event.colour.replace('#', '')}`;
    return (
      <span className="custom-marker shadow-1" style={{ backgroundColor }}>
        <i className={event.icon}></i>
      </span>
    );
  };

  const formatDate = (date: Timestamp): string => {
    return date.toDate().toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
  };

  const customizedContent = (event: OrganizerEvent) => {
    return (
        <Card title={event.title} subTitle={formatDate(event.date)}>
            <p>{event.description}</p>
            <Button label="..." className="p-button-text p-button-sm"></Button>
        </Card>
    );
  };

  useEffect(() => {
    const unsubscribe = onSnapshot<DocumentData>(query(collection(firestore, "events"), orderBy('date', 'asc')), {includeMetadataChanges: true}, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const fetchedEvents: OrganizerEvent[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as OrganizerEvent);
      setEvents(() => fetchedEvents);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {displayMode === 'compact' ? (
        <Timeline
          value={events}
          opposite={(event: OrganizerEvent) => formatDate(event.date)}
          content={(event: OrganizerEvent) => <span><small className="p-text-secondary">{event.title}</small>: {event.description}</span>}
        />
      ) : (
        <Timeline
          value={events}
          align="alternate"
          className="customized-timeline"
          marker={customizedMarker}
          content={customizedContent}
        />
      )}
    </div>
  );
};
