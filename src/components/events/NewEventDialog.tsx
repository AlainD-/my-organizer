import EventDialogForm from './EventDialogForm';

export default function NewEventDialog({isVisible, onHide}: {isVisible: boolean, onHide: () => void}) {
  return (<EventDialogForm isVisible={isVisible} onHide={onHide} />);
};
