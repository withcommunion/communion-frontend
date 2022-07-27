import ShortcutAction from '@/pages_components/org/[orgId]/orgIdIndex/shortcutActions/shortcutAction/ShortcutActionItem';
import { OrgAction } from '@/util/walletApiUtil';

interface Props {
  shortcutActions: OrgAction[];
}

/**
 * TODO: This will break when there are more than 3 items - will need to iterate back over them
 */
const images = [
  '/images/home/tokenTips/Compliance.png',
  '/images/home/tokenTips/Kindness.png',
  '/images/home/tokenTips/Politeness.png',
];
const ShortcutActionsList = ({ shortcutActions }: Props) => {
  return (
    <>
      {shortcutActions.map((action, num: number) => (
        <ShortcutAction key={num} action={action} imageUrl={images[num]} />
      ))}
    </>
  );
};

export default ShortcutActionsList;
