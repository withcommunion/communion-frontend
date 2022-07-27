import ShortcutAction from '@/pages_components/org/[orgId]/orgIdIndex/shortcutActions/shortcutAction/ShortcutAction';

export interface IShortcutActions {
  name: string;
  value: string | number;
  image: string;
}

interface Props {
  shortcutActions: IShortcutActions[];
}

const ShortcutActions = ({ shortcutActions }: Props) => {
  return (
    <>
      {shortcutActions.map((action, num: number) => (
        <ShortcutAction key={num} action={action} />
      ))}
    </>
  );
};

export default ShortcutActions;
