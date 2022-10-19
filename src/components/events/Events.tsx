import { collection, getDocs, QueryDocumentSnapshot, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { format } from 'path';
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
            <Button label="Read more" className="p-button-text"></Button>
        </Card>
    );
  };

  useEffect(() => {
    async function fetchEvents() {
      const querySnapshot: QuerySnapshot<OrganizerEvent> = await getDocs(collection(firestore, "events")) as QuerySnapshot<OrganizerEvent>;
      const fetchedEvents: OrganizerEvent[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<OrganizerEvent>) => {
        const { date, title, description, icon, colour } = doc.data();
        const event: OrganizerEvent = {
          date,
          title,
          description,
          icon,
          colour
        };
        return event;
      });
      console.log({fetchedEvents});
      setEvents(() => fetchedEvents);
    }

    fetchEvents();

    // setEvents(() => ([
    //   { title: 'Processing', date: '15/10/2020 14:00', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-calendar', color: '#673AB7' },
    //   { title: 'Shipped', date: '15/10/2020 16:15', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-building', color: '#FF9800' },
    //   { title: 'Delivered', date: '16/10/2020 10:00', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-file-edit', color: '#607D8B' },
    //   { title: 'Delivered', date: '16/10/2020 10:00', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-envelope', color: '#607D8B' },
    //   { title: 'Shipped', date: '15/10/2020 16:15', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-at', color: '#FF9800' },
    //   { title: 'Processing', date: '15/10/2020 14:00', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-home', color: '#673AB7' },
    //   { title: 'Processing', date: '15/10/2020 14:00', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-phone', color: '#673AB7' },
    //   { title: 'Delivered', date: '16/10/2020 10:00', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-mobile', color: '#607D8B' },
    // ]));
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
