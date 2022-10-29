import EventDialogForm from './EventDialogForm';
import { OrganizerEvent } from './models/organizer-event';

export default function UpdateEventDialog({isVisible, onHide, organizerEvent}: {isVisible: boolean, onHide: () => void, organizerEvent?: OrganizerEvent|null}) {
  return (<EventDialogForm organizerEvent={organizerEvent} isVisible={isVisible} onHide={onHide} />);
};
