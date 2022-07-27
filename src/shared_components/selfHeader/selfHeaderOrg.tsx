import Greeting from "@/shared_components/selfHeader/greeting/Greeting";
import TokenBalance from "@/shared_components/selfHeader/tokenBalance/TokenBalance";
import {FC} from "react";
import {ISelfHeader} from "@/pages/org/[orgId]/indexPlayground";



const SelfHeaderOrg:FC<{selfHeader:ISelfHeader[]}> = ({selfHeader}) => {
    return(
    <>
        <Greeting selfHeader={selfHeader}/>
        <TokenBalance selfHeader={selfHeader}/>
    </>
    )
}

export default SelfHeaderOrg;