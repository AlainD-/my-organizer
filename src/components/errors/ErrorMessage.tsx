import { Messages } from 'primereact/messages';
import { ReactNode, useEffect, useRef } from 'react';

export default function ErrorMessage({detail}: {detail: string}) {
  const message = useRef<any>(null);

  useEffect(() => {
    const summary: ReactNode = (
      <span className="font-bold mr-2">Error</span>
    );
    const severity: 'error' = 'error';

    message.current.show([{ severity, summary, detail, sticky: true }]);
  }, [detail]);

  return (
    <Messages ref={message} />
  );
}
