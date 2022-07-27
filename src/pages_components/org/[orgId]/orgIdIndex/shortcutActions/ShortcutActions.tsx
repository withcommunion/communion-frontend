import ShortcutAction from '@/pages_components/org/[orgId]/orgIdIndex/shortcutActions/shortcutAction/ShortcutAction';
import { OrgAction } from '@/util/walletApiUtil';

interface Props {
  shortcutActions: OrgAction[];
}
const images = [
  '/images/home/tokenTips/Compliance.png',
  '/images/home/tokenTips/Kindness.png',
  '/images/home/tokenTips/Politeness.png',
];
const ShortcutActions = ({ shortcutActions }: Props) => {
  return (
    <>
      {shortcutActions.map((action, num: number) => (
        <ShortcutAction key={num} action={action} imageUrl={images[num]} />
      ))}
    </>
  );
};

export default ShortcutActions;
