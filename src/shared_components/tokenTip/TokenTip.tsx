import {FC} from "react";
import {IToken} from "@/pages_components/org/[orgId]/orgIdIndex/home/Home";
import Link from "next/link";

const TokenTip:FC<{token:IToken}> = ({token}) => {
    const {name,value,image} = token
    return(
        <Link href="@/shared_components/tokenTip/TokenTip#">
        <a className="text-tokens my-2.5 bg-[#FFFFFF] justify-between rounded-xl flex items-center px-4">
            <div className="flex items-center">
                <span className="font-bold text-tokenBig mr-3 py-4">{value}</span>
                <div className='flex flex-col'>
                    <span className="font-normal text-[#B0B2D6] ">Token Tip</span>
                    <span className="font-semibold">{name}</span>
                </div>
            </div>
            <img src={image} alt={name}/>
        </a>
        </Link>
    )
}

export default TokenTip