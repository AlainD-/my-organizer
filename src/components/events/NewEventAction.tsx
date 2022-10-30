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
      <div className="hidden md:inline-flex">
        <Button label="Add an event" icon="pi pi-calendar-plus" className="p-button-sm mr-2" onClick={handleNew}/>
      </div>
      <div className="inline-flex md:hidden">
        <Button icon="pi pi-calendar-plus" className="p-button-sm mr-2" onClick={handleNew}/>
      </div>
      <NewEventDialog isVisible={isVisible} onHide={handleHide} />
    </>
  );
};
