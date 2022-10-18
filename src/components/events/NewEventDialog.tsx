import { addDoc, collection } from 'firebase/firestore';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { ColorPicker } from 'primereact/colorpicker';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { ReactNode, useState } from 'react';
import { firestore } from '../../startup/firebase';

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
  icon: '',
  colour: '',
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

export default function NewEventDialog({isVisible, onHide}: {isVisible: boolean, onHide: () => void}) {
  const [formData, setFormData] = useState<EventFormData>(INITIAL_DATA);

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

      if (!data.colour) {
        errors.colour = 'Colour is required.';
      }

      return errors;
    },
    onSubmit: async (event: EventFormData) => {
      setFormData(event);

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
              <span className="p-float-label">
                <ColorPicker id="colour" name="colour" value={formik.values.colour} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('colour') })} />
                <label htmlFor="colour" className={classNames({ 'p-error': isFormFieldValid('colour') })}>Colour*</label>
              </span>
              {getFormErrorMessage('colour')}
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
};
