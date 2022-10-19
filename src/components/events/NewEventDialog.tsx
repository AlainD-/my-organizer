import { addDoc, collection } from 'firebase/firestore';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { ReactNode, useState } from 'react';
import { firestore } from '../../startup/firebase';
import './NewEventDialog.css';

interface EventFormData {
  title: string;
  date?: Date;
  description: string;
  icon: string;
  colour: string;
}

const INITIAL_DATA: EventFormData = {
  title: '',
  date: undefined,
  description: '',
  icon: 'pi pi-calendar',
  colour: '673AB7',
};

const ICONS: string[] = [
  'pi pi-calendar',
  'pi pi-building',
  'pi pi-home',
  'pi pi-file-edit',
  'pi pi-envelope',
  'pi pi-at',
  'pi pi-phone',
  'pi pi-mobile',
];

const COLOURS: string[] = [
  '673AB7',
  'FF9800',
  '607D8B'
];

export default function NewEventDialog({isVisible, onHide}: {isVisible: boolean, onHide: () => void}) {
  const [selectedColour, setSelectedColour] = useState<string>('');

  const formik = useFormik<EventFormData>({
    initialValues: INITIAL_DATA,
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

      if (!data.icon) {
        errors.icon = 'Icon is required.';
      }

      if (!selectedColour) {
        errors.colour = 'Colour is required.';
      }

      return errors;
    },
    onSubmit: async (formData: EventFormData) => {
      const {date, title, description, icon} = formData;
      const event = {title, date, description, icon, colour: selectedColour};

      try {
        const docRef = await addDoc(collection(firestore, 'events'), event);
        console.log(`Document written with ID: ${docRef.id}`);
        formik.resetForm();
        onHide();
      } catch (error) {
        console.log(`Error adding document: ${error}`);
      }
    },
  });

  const isFormFieldValid = (field: keyof EventFormData): boolean => !!(formik.touched[field] && formik.errors[field]);

  const getFormErrorMessage = (field: keyof EventFormData): ReactNode => {
    return isFormFieldValid(field) && <small className="p-error">{formik.errors[field]}</small>;
  }

  const handleCreate = (): void => {
    formik.submitForm();
  };

  const selectedIconTemplate = (icon: string, props: { placeholder?: string }): ReactNode => {
    return icon ? <i className={icon}></i> : <span>{props.placeholder ?? ''}</span>;
  };

  const iconOptionTemplate = (icon: string): ReactNode => <i className={icon}></i>;

  const footer = (
    <div>
        <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" onClick={handleCreate} autoFocus />
    </div>
  );

  return (
    <>
      <Dialog
        header="New Event"
        visible={isVisible}
        style={{ width: '50vw' }}
        footer={footer}
        onHide={onHide}
      >
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
                <InputText id="description" name="description" value={formik.values.description} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('description') })} />
                <label htmlFor="description" className={classNames({ 'p-error': isFormFieldValid('description') })}>Description*</label>
              </span>
              {getFormErrorMessage('description')}
            </div>

            <div className="field">
              <span className="p-float-label">
                <Dropdown
                  id="icon"
                  name="icon"
                  value={formik.values.icon}
                  onChange={formik.handleChange}
                  className={classNames({ 'p-invalid': isFormFieldValid('icon') })}
                  options={ICONS}
                  placeholder="Select an icon"
                  valueTemplate={selectedIconTemplate}
                  itemTemplate={iconOptionTemplate}
                />
                <label htmlFor="icon" className={classNames({ 'p-error': isFormFieldValid('icon') })}>Icon*</label>
              </span>
              {getFormErrorMessage('icon')}
            </div>

            <div className="field">
              <span className="p-float-label flex">
                {COLOURS.map((colour) => {
                  const isSelected = selectedColour === colour;
                  const iconClass = formik.values.icon ?? 'pi pi-question';
                  const icon: ReactNode = <i className={iconClass}></i>;
                  return (
                    <div key={colour} className="flex flex-column justify-content-start align-items-center mr-1 relative">
                      <Button
                        type="button"
                        icon={icon}
                        className="p-button-rounded mt-2 mr-1"
                        style={{backgroundColor: `#${colour}`}}
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
