import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Timeline, TimelineTemplateType } from 'primereact/timeline';
import { useEffect, useState } from 'react';
import './Events.css';

interface OrganizerEvent {
  date: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function Events({displayMode}: {displayMode: 'compact'|'large'}) {
  const [events, setEvents] = useState<OrganizerEvent[]>();

  const customizedMarker: TimelineTemplateType = (event: OrganizerEvent) => {
    return (
      <span className="custom-marker shadow-1" style={{ backgroundColor: event.color }}>
        <i className={event.icon}></i>
      </span>
    );
  };

  const customizedContent = (event: OrganizerEvent) => {
    return (
        <Card title={event.title} subTitle={event.date}>
            <p>{event.description}</p>
            <Button label="Read more" className="p-button-text"></Button>
        </Card>
    );
  };

  useEffect(() => {
    setEvents(() => ([
      { title: 'Processing', date: '15/10/2020 14:00', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-cog', color: '#673AB7' },
      { title: 'Shipped', date: '15/10/2020 16:15', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-shopping-cart', color: '#FF9800' },
      { title: 'Delivered', date: '16/10/2020 10:00', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', icon: 'pi pi-check', color: '#607D8B' },
    ]));
  }, []);

  return (
    <div>
      {displayMode === 'compact' ? (
        <Timeline
          value={events}
          opposite={(event) => event.date}
          content={(event) => <span><small className="p-text-secondary">{event.title}</small>: {event.description}</span>}
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
