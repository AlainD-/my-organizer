import { SelectButton } from 'primereact/selectbutton';
import { SelectItem } from 'primereact/selectitem';
import { Toolbar, ToolbarTemplateType } from 'primereact/toolbar';
import { ReactNode, useState } from 'react';
import CurrentUser from '../../auth/components/CurrentUser';
import Logout from '../../auth/components/Logout';
import NewEventAction from './NewEventAction';

export default function EventsToolbar({onDisplayModeChanged}: {onDisplayModeChanged: (mode: 'compact' | 'large') => void}) {
  const [displayMode, setDisplayMode] = useState<'compact'|'large'>('large');

  const displayModeOptions: SelectItem[] = [
    {icon: 'pi pi-list', value: 'compact'},
    {icon: 'pi pi-th-large', value: 'large'},
  ];

  const handleDisplayModeChanged = (mode: 'compact' | 'large'): void => {
    setDisplayMode(() => mode);
    onDisplayModeChanged(mode);
  };

  const displayModeTemplate = (option: SelectItem): ReactNode => {
    return <i className={option.icon as string}></i>;
  };

  const leftContent: ToolbarTemplateType = (
    <div className="flex mb-1">
      <NewEventAction />
    </div>
  );

  const rightContent: ToolbarTemplateType = (
    <div className="flex mb-1">
      <SelectButton
        value={displayMode}
        options={displayModeOptions}
        onChange={(e) => handleDisplayModeChanged(e.value)}
        itemTemplate={displayModeTemplate}
        optionLabel="value"
        className="mr-2"
      />
      <CurrentUser />
      <Logout />
    </div>
  );

  return (
    <div className="mb-2">
      <Toolbar left={leftContent} right={rightContent} />
    </div>
  );
}
