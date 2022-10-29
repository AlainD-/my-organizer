import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../hooks/use-user-auth.hook';

export default function Logout() {
  const { logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error: any) {
      console.log({error});
    }
  };

  return (
    <Button label="Sign out" onClick={handleLogout} icon="pi pi-sign-out" className="p-button-secondary p-button-outlined p-button-sm ml-2 " />
  )
}
