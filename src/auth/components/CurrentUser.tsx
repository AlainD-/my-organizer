import { Avatar } from 'primereact/avatar';
import { useUserAuth } from './../hooks/use-user-auth.hook';

export default function CurrentUser() {
  const { user } = useUserAuth();

  if (!user) {
    return null;
  }

  const initials = (): string | undefined => {
    if (!user.displayName) {
      return undefined;
    } else {
      const parts = user.displayName.split(' ').map((part: string) => part.charAt(0).toUpperCase());
      return parts.length > 1 ? `${parts[0]}${parts[-1]}` : parts[0];
    }
  };

  const image: string | undefined = user.photoURL ?? undefined;
  const label: string | undefined= !user.photoURL ? initials(): '?';

  return (
    <Avatar image={image} label={label} className="mr-2" shape="circle" />
  );
}
