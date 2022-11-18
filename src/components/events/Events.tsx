import { Timestamp } from 'firebase/firestore';
import { Card } from 'primereact/card';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Timeline, TimelineTemplateType } from 'primereact/timeline';
import { OrganizerEvent } from './models/organizer-event';
import EventActions from './EventActions';
import { useOrganizerEvents } from './hooks/use-organizer-events.hook';
import './Events.css';

export default function Events({displayMode}: {displayMode: 'compact'|'large'}) {
  const { organizerEvents } = useOrganizerEvents();

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
    const rowDirectionClass = index % 2 === 0 ? 'flex-row' : 'flex-row lg:flex-row-reverse';
    const cardColour = index % 2 === 0 ? 'var(--orange-50)' : 'var(--teal-50)';
    const classes = `flex justify-content-between ${rowDirectionClass}`;
    const title = (
      <div className={classes}>
        {organizerEvent.title}
        <EventActions organizerEvent={organizerEvent} />
      </div>
    );
    return (
      <Card title={title} subTitle={formatDate(organizerEvent.date)} style={{backgroundColor: cardColour}}>
        <p>{organizerEvent.description}</p>
      </Card>
    );
  };


  return (
    <div>
      {displayMode === 'compact' ? (
        <Timeline
          value={organizerEvents}
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
          value={organizerEvents}
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
