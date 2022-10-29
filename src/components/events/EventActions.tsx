import { deleteDoc, doc } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useRef, useState } from 'react';
import { firestore } from '../../startup/firebase';
import { OrganizerEvent } from './models/organizer-event';
import UpdateEventDialog from './UpdateEventDialog';

export default function EventActions({organizerEvent}: {organizerEvent: OrganizerEvent}) {
  const menu = useRef<any>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const confirmDelete = (): void => {
    confirmDialog({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await deleteDoc(doc(firestore, 'events', organizerEvent.id));
        } catch (error) {
          console.log({error});
        }
      },
      reject: () => {},
    });
  };

  const confirmUpdate = (): void => {
    setIsVisible(() => true);
  };

  const handleHide = (): void => {
    setIsVisible(() => false);
  };

  const menuItems: MenuItem[] = [
    {label: 'Update', icon: 'pi pi-refresh text-green-500', command: confirmUpdate},
    {label: 'Delete', icon: 'pi pi-times text-red-600', command: confirmDelete}
  ];

  return (
    <>
      <Menu model={menuItems} popup={true} ref={menu} id="popup-menu" />
      <Button type="button" icon="pi pi-ellipsis-h" onClick={(event) => {menu.current.toggle(event)}} aria-controls="popup-menu" aria-haspopup={true} className="p-button-text p-button-rounded p-button-sm hover:shadow-5" />
      <UpdateEventDialog organizerEvent={organizerEvent} isVisible={isVisible} onHide={handleHide} />
    </>
  );
}
