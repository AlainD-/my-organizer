import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { ReactNode, useEffect, useState } from 'react';
import { firestore } from '../../startup/firebase';
import ErrorMessage from '../errors/ErrorMessage';
import { INITIAL_DATA } from './constants/data.constants';
import { COLOURS, ICONS } from './constants/ui.constants';
import { EventFormData } from './models/event-form-data';
import { OrganizerEvent } from './models/organizer-event';
import './EventDialogForm.css';

export default function EventDialogForm({isVisible, onHide, organizerEvent}: {isVisible: boolean, onHide: () => void, organizerEvent?: OrganizerEvent|null}) {
  const [error, setError] = useState<string>('Error adding a document');
  const [selectedColour, setSelectedColour] = useState<string>('');
  useEffect(() => {setSelectedColour(() => organizerEvent?.colour ?? '')}, [organizerEvent?.colour]);
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  useEffect(() => {setSelectedIcon(() => organizerEvent?.icon ?? '')}, [organizerEvent?.icon]);

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
    setSelectedColour(() => organizerEvent?.colour ?? '')
    setSelectedIcon(() => organizerEvent?.icon ?? '');
    onHide();
  };

  const isFormFieldValid = (field: keyof EventFormData): boolean => !!(formik.touched[field] && formik.errors[field]);

  const getFormErrorMessage = (field: keyof EventFormData): ReactNode => {
    return isFormFieldValid(field) && <small className="p-error">{formik.errors[field]}</small>;
  }

  const handleSubmit = (): void => {
    formik.submitForm();
  };

  const header: string = `${organizerEvent ? 'Update' : 'New'} Event`;

  const footer = (
    <div>
        <Button label="Cancel" icon="pi pi-times" onClick={resetAndHide} className="p-button-text" />
        <Button label={organizerEvent ? 'Update' : 'Create'} icon="pi pi-check" onClick={handleSubmit} autoFocus />
    </div>
  );

  return (
    <>
      <Dialog
        header={header}
        visible={isVisible}
        style={{ width: '30rem' }}
        footer={footer}
        onHide={resetAndHide}
      >
        {error && <ErrorMessage detail={error} />}
        <div className="flex justify-content-center mt-4">
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="field">
              <span className="p-float-label">
                <InputText id="title" name="title" value={formik.values.title} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('title') })} />
                <label htmlFor="title" className={classNames({ 'p-error': isFormFieldValid('title') })}>Title*</label>
              </span>
              {getFormErrorMessage('title')}
            </div>

            <div className="field">
              <span className="p-float-label">
                <Calendar id="date" name="date" value={formik.values.date} onChange={formik.handleChange} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon showTime className={classNames({ 'p-invalid': isFormFieldValid('date') })}/>
                <label htmlFor="date" className={classNames({ 'p-error': isFormFieldValid('date') })}>Date*</label>
              </span>
              {getFormErrorMessage('date')}
            </div>

            <div className="field">
              <span className="p-float-label">
                <InputTextarea rows={2} cols={30} id="description" name="description" value={formik.values.description} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('description') })} autoResize={false} />
                <label htmlFor="description" className={classNames({ 'p-error': isFormFieldValid('description') })}>Description*</label>
              </span>
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
              <span className="flex">
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
      </Dialog>
    </>
  );
};
