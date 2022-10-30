import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Calendar, CalendarDateTemplateParams } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { ReactNode, useEffect, useState, useRef } from 'react';
import { firestore } from '../../startup/firebase';
import ErrorMessage from '../errors/ErrorMessage';
import { INITIAL_DATA } from './constants/data.constants';
import { COLOURS, DEFAULT_COLOUR, DEFAULT_ICON, ICONS } from './constants/ui.constants';
import { useOrganizerEvents } from './hooks/use-organizer-events.hook';
import { EventFormData } from './models/event-form-data';
import { OrganizerEvent } from './models/organizer-event';
import './EventDialogForm.css';

export default function EventDialogForm({isVisible, onHide, organizerEvent}: {isVisible: boolean, onHide: () => void, organizerEvent?: OrganizerEvent|null}) {
  const { organizerEvents } = useOrganizerEvents();
  const [error, setError] = useState<string>('');
  const calendar = useRef<Calendar>(null);
  const [selectedColour, setSelectedColour] = useState<string>(DEFAULT_COLOUR);
  useEffect(() => {setSelectedColour(() => organizerEvent?.colour ?? DEFAULT_COLOUR)}, [organizerEvent?.colour]);
  const [selectedIcon, setSelectedIcon] = useState<string>(DEFAULT_ICON);
  useEffect(() => {setSelectedIcon(() => organizerEvent?.icon ?? DEFAULT_ICON)}, [organizerEvent?.icon]);

  const formik = useFormik<EventFormData>({
    initialValues: organizerEvent ? {...organizerEvent, date: organizerEvent.date.toDate()} : INITIAL_DATA,
    enableReinitialize: true,
    validate: (data: EventFormData) => {
      let errors: {[key in keyof EventFormData]?: string|undefined} = {};

      if (!data.title) {
        errors.title = 'Title is required.';
      }

      if (!data.date) {
        errors.date = 'Date is required.';
      }

      if (!data.description) {
        errors.description = 'Description is required.';
      }

      if (!selectedIcon) {
        errors.icon = 'Icon is required.';
      }

      if (!selectedColour) {
        errors.colour = 'Colour is required.';
      }

      return errors;
    },
    onSubmit: async (formData: EventFormData) => {
      const {date, title, description} = formData;
      const event = {title, date, description, icon: selectedIcon, colour: selectedColour};

      try {
        if (!organizerEvent) {
          await addDoc(collection(firestore, 'events'), event);
        } else {
          await setDoc(doc(firestore, 'events', organizerEvent.id), event);
        }
        resetAndHide();
      } catch (error: any) {
        setError(() => `Error adding document: ${error.message}`);
      }
    },
  });

  const resetAndHide = (): void => {
    formik.resetForm();
    setSelectedColour(() => organizerEvent?.colour ?? DEFAULT_COLOUR)
    setSelectedIcon(() => organizerEvent?.icon ?? DEFAULT_ICON);
    onHide();
  };

  const isFormFieldValid = (field: keyof EventFormData): boolean => !!(formik.touched[field] && formik.errors[field]);

  const getFormErrorMessage = (field: keyof EventFormData): ReactNode => (
    <>{isFormFieldValid(field) && <small id={`${field}-help`} className="block p-error">{formik.errors[field]}</small>}</>
  );

  const handleSubmit = (): void => {
    formik.submitForm();
  };

  const dateTemplate = (date: CalendarDateTemplateParams): ReactNode => {
    const {year, month, day} = date;
    const hasEvents: boolean = organizerEvents.filter(({date: timestamp}) => {
      const eventDate: Date= timestamp.toDate();
      const eventYear: number = eventDate.getFullYear();
      const eventMonth: number = eventDate.getMonth();
      const eventDay: number = eventDate.getDay();
      return eventYear === year && eventMonth === month && eventDay === day;
    }).length > 0;

    return (
      <div className="flex">{date.day}{hasEvents && <Badge severity="danger" style={{width: '0.3rem', minWidth: '0.3rem', height: '0.3rem'}} />}</div>
    );
  };

  const headerTemplate = (): ReactNode => (
    <Button type="button" icon="pi pi-times" className="p-button-sm p-button-rounded p-button-outlined p-button-secondary" onClick={() => {calendar.current?.hide()}} />
  );

  const footerTemplate = (): ReactNode => (
    <div className="flex justify-content-end">
      <Button type="button" icon="pi pi-times" label="Done" className="p-button-sm p-button-outlined p-button-plain" onClick={() => {calendar.current?.hide()}} />
    </div>
  );

  const header: string = `${organizerEvent ? 'Update' : 'New'} Event`;

  const footer = (
    <div className="mt-1 pt-2 border-none border-top-1 border-dashed border-blue-500">
        <Button label="Cancel" icon="pi pi-times" onClick={resetAndHide} className="p-button-text p-button-secondary p-button-sm" />
        <Button label={organizerEvent ? 'Update' : 'Create'} icon="pi pi-check" onClick={handleSubmit} className="p-button-sm" />
    </div>
  );

  return (
    <>
      <Dialog
        header={header}
        visible={isVisible}
        style={{ width: '30rem', maxWidth: '100vw' }}
        footer={footer}
        onHide={resetAndHide}
      >
        <div className="w-100">
          {error && <ErrorMessage detail={error} />}
          <div className="flex justify-content-center mt-4">
            <form onSubmit={formik.handleSubmit} className="p-fluid w-full">
              <div className="field">
                <InputText
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  autoFocus
                  className={classNames({'block': true, 'p-invalid': isFormFieldValid('title') })}
                  placeholder="Title"
                />
                {getFormErrorMessage('title')}
              </div>

              <div className="field">
                <Calendar
                  ref={calendar}
                  id="date"
                  inputId="date-id"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  dateFormat="dd/mm/yy"
                  mask="99/99/9999"
                  showIcon={true}
                  showTime={true}
                  showButtonBar={true}
                  showWeek={false}
                  hideOnDateTimeSelect={false}
                  hourFormat="12"
                  stepMinute={15}
                  touchUI={true}
                  className={classNames({ 'p-invalid': isFormFieldValid('date') })}
                  panelClassName=""
                  placeholder="Date"
                  headerTemplate={headerTemplate}
                  footerTemplate={footerTemplate}
                  dateTemplate={dateTemplate}
                />
                {getFormErrorMessage('date')}
              </div>

              <div className="field">
                <InputTextarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  rows={2}
                  cols={30}
                  className={classNames({ 'p-invalid': isFormFieldValid('description') })}
                  autoResize={false}
                  placeholder="Description"
                />
                {getFormErrorMessage('description')}
              </div>

              <div className="field">
                <span className="flex flex-wrap">
                  {ICONS.map((icon) => {
                    const key = icon.replace(' ', '');
                    const isSelected = selectedIcon === icon;
                    const withSelectionClass = isSelected ? 'shadow-5' : 'p-button-secondary';
                    const buttonClass = `p-button-rounded p-button-outlined mt-2 mr-1 ${withSelectionClass}`;
                    return (
                      <div key={key} className="flex flex-column justify-content-start align-items-center mr-1 relative">
                        <Button
                          type="button"
                          icon={icon}
                          className={buttonClass}
                          onClick={() => setSelectedIcon(() => icon)}
                        />
                        {isSelected && <span className="selected-colour absolute top-0 right-0"><i className="pi pi-check" style={{fontSize: '0.5rem'}}></i></span>}
                      </div>
                    );
                  })}
                </span>
                {getFormErrorMessage('icon')}
              </div>

              <div className="field">
                <span className="flex flex-wrap">
                  {COLOURS.map((colour) => {
                    const isSelected = selectedColour === colour;
                    const iconClass = selectedIcon ?? 'pi pi-question';
                    const icon: ReactNode = <i className={iconClass}></i>;
                    const withRaisedClass = isSelected ? 'shadow-5' : '';
                    const buttonClass = `p-button-rounded mt-2 mr-1 ${withRaisedClass}`;
                    return (
                      <div key={colour} className="flex flex-column justify-content-start align-items-center mr-1 relative">
                        <Button
                          type="button"
                          icon={icon}
                          className={buttonClass}
                          style={{backgroundColor: `#${colour}`, border: 0}}
                          onClick={() => setSelectedColour(() => colour)}
                        />
                        {isSelected && <span className="selected-colour absolute top-0 right-0"><i className="pi pi-check" style={{fontSize: '0.5rem'}}></i></span>}
                      </div>
                    );
                  })}
                </span>
                {getFormErrorMessage('colour')}
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};
