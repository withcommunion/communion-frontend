import {FC} from "react";
import Link from "next/link";
import Image from "next/image";
import {IShortcutActions} from "@/pages_components/org/[orgId]/orgIdIndex/shortcutActions/ShortcutActions";


const ShortcutAction:FC<{action:IShortcutActions}> = ({action}) => {
    const {name,value,image} = action
    return(
        <li>
        <Link href="@/shared_components/tokenTip/TokenTip#">
        <a className="text-primaryGray my-2.5 bg-white justify-between rounded-xl flex items-center px-4">
            <div className="flex items-center">
                <span className="font-bold text-45px mr-3 py-4">{value}</span>
                <div className='flex flex-col'>
                    <span className="font-normal text-[#B0B2D6] ">Token Tip</span>
                    <span className="font-semibold">{name}</span>
                </div>
            </div>
            <Image src={image} alt={name} width="82px" height="82px"/>
        </a>
        </Link>
        </li>
    )
}

export default ShortcutAction