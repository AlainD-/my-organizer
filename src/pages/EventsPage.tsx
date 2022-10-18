import { useState } from 'react';
import Events from '../components/events/Events';
import EventsToolbar from '../components/events/EventsToolbar';

export default function EventsPage() {
  const [displayMode, setDisplayMode] = useState<'compact'|'large'>('large');
  const handleDisplayModeChanged = (mode: 'compact' | 'large'): void => {
    setDisplayMode(() => mode);
  };

  return (
    <div>
      <EventsToolbar onDisplayModeChanged={handleDisplayModeChanged} />
      <Events displayMode={displayMode} />
    </div>
  );
};
