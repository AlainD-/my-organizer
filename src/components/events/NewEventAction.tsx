import { Button } from 'primereact/button';
import { useState } from 'react';
import NewEventDialog from './NewEventDialog';

export default function NewEventAction() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleNew = (): void => {
    setIsVisible(() => true);
  };

  const handleHide = () => {
    setIsVisible(() => false);
  };

  return (
    <>
      <Button label="Add an event" icon="pi pi-calendar-plus" className="mr-2" onClick={handleNew}/>
      <NewEventDialog isVisible={isVisible} onHide={handleHide} />
    </>
  );
};
