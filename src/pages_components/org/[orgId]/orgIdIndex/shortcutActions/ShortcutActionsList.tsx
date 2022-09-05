import ShortcutAction from '@/pages_components/org/[orgId]/orgIdIndex/shortcutActions/shortcutAction/ShortcutActionItem';
import { OrgAction } from '@/util/walletApiUtil';
import { useAppDispatch } from '@/reduxHooks';
import { baseAmountUpdated } from '@/features/multisend/multisendSlice';

interface Props {
  shortcutActions: OrgAction[];
  orgId: string;
  isBankHeistAvailable: boolean;
}

/**
 * TODO: This will break when there are more than 3 items - will need to iterate back over them
 */
const images = [
  '/images/home/tokenTips/Compliance.png',
  '/images/home/tokenTips/Kindness.png',
  '/images/home/tokenTips/Politeness.png',
];

const bankHeistImagePath = '/images/home/tokenTips/moneyStacksTokenTip.png';
const bankHeistAction: OrgAction = {
  name: 'Bank Heist',
  amount: '5',
  allowed_roles: ['worker'],
};

const ShortcutActionsList = ({
  shortcutActions,
  orgId,
  isBankHeistAvailable,
}: Props) => {
  const dispatch = useAppDispatch();
  return (
    <ul>
      {isBankHeistAvailable && (
        <ShortcutAction
          orgId={orgId}
          key={4}
          action={bankHeistAction}
          imageUrl={bankHeistImagePath}
          onClick={() => {
            dispatch(baseAmountUpdated(parseInt(bankHeistAction.amount)));
          }}
        />
      )}
      {shortcutActions.map((action, num: number) => (
        <ShortcutAction
          orgId={orgId}
          key={num}
          action={action}
          imageUrl={images[num]}
          onClick={() => {
            dispatch(baseAmountUpdated(parseInt(action.amount)));
          }}
        />
      ))}
    </ul>
  );
};

export default ShortcutActionsList;
