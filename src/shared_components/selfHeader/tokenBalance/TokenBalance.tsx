import Image from "next/image";
import {FC} from "react";
import {ISelfHeader} from "@/pages/org/[orgId]/indexPlayground";


const TokenBalance:FC<{selfHeader:ISelfHeader[]}> = ({selfHeader}) => {
    const {tokenAmount,tokenSymbol} = selfHeader[0]
    return(
        <div className="bg-primaryLightGray rounded-md flex justify-between items-center px-4 py-4 font-normal">
            <span className="text-4 text-secondaryGray">Your Balance</span>
            <div className="flex  rounded-lg bg-white px-4 py-3 w-44">
                <Image src="/images/home/Arrow.svg" alt="arrow" width="9px" height="16px"/>
                <span className="text-17px text-primaryPurple px-3">{tokenAmount} {tokenSymbol}</span></div>
        </div>
    )
}

export default TokenBalance;