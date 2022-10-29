import { collection, DocumentData, onSnapshot, orderBy, query, QueryDocumentSnapshot, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { Card } from 'primereact/card';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Timeline, TimelineTemplateType } from 'primereact/timeline';
import { useEffect, useState } from 'react';
import { firestore } from '../../startup/firebase';
import { OrganizerEvent } from './models/organizer-event';
import EventActions from './EventActions';
import './Events.css';

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

  const customizedContent = (organizerEvent: OrganizerEvent, index: number) => {
    const rowDirectionClass = index % 2 === 0 ? 'flex-row' : 'flex-row-reverse';
    const classes = `flex justify-content-between ${rowDirectionClass}`;
    const title = (
      <div className={classes}>
        {organizerEvent.title}
        <EventActions organizerEvent={organizerEvent} />
      </div>
    );
    return (
      <Card title={title} subTitle={formatDate(organizerEvent.date)}>
        <p>{organizerEvent.description}</p>
      </Card>
    );
  };

  useEffect(() => {
    const unsubscribe = onSnapshot<DocumentData>(query(collection(firestore, 'events'), orderBy('date', 'asc')), {includeMetadataChanges: true}, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const fetchedEvents: OrganizerEvent[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({id: doc.id, ...doc.data()} as OrganizerEvent));
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
          opposite={(organizerEvent: OrganizerEvent) => formatDate(organizerEvent.date)}
          content={(organizerEvent: OrganizerEvent) => (
            <div className="flex align-items-start justify-content-start">
              <div className="mr-2">
                <small className="p-text-secondary">{organizerEvent.title}</small>
                <span>: {organizerEvent.description}</span>
              </div>
              <EventActions organizerEvent={organizerEvent} />
            </div>
          )}
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
      <ConfirmDialog />
    </div>
  );
};
