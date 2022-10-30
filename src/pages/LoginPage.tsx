import { MouseEvent as ReactMouseEvent , useState } from 'react';
import GoogleButton from 'react-google-button'
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../auth/hooks/use-user-auth.hook';
import ErrorMessage from '../components/errors/ErrorMessage';

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async (event: ReactMouseEvent<HTMLDivElement, MouseEvent>): Promise<void> => {
    event.preventDefault();
    try {
      await logIn();
      navigate('/events');
    } catch (error: any) {
      setError(() => error.message);
    }
  };

  return (
    <div className="mx-2">
      <h1>Please Sign In</h1>
      {error && <ErrorMessage detail={error} />}
      <GoogleButton
        className="p-button-sm"
        type="dark"
        onClick={handleGoogleSignIn}
      />
    </div>
  );
}
