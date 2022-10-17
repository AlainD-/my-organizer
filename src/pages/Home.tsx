import { addDoc, collection } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { firestore } from '../startup/firebase';

export default function Home() {
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async () => {
    console.log({message});
    try {
      const docRef = await addDoc(collection(firestore, "messages"), {
        message
      });
      console.log(`Document written with ID: ${docRef.id}`);
    } catch (error) {
      console.log(`Error adding document: ${error}`);
    }
  };

  return (
    <div>
      <div className="field">
          <label htmlFor="message" className="block">Enter Message</label>
          <InputText id="message" aria-describedby="message-help" className="block" value={message} onChange={(e) => setMessage(() => e.target.value)} />
          <small id="message-help" className="block">Enter your message.</small>
      </div>
      <Button label="submit" onClick={handleSubmit}/>
    </div>
  );
}
