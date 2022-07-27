import OrgTransactionHistory from "@/pages_components/org/[orgId]/orgIdIndex/history/orgTransactionHistory/OrgTransactionHistory";
import {FC} from "react";
import {ISelfHeader} from "@/pages/org/[orgId]/indexPlayground";

export interface ITransactions {
    status:string,value:number,name:string,date:string,tokenSymbol:string
}
const HistoryOrg:FC<{selfHeader:ISelfHeader[]}> = ({selfHeader}) => {

    const {tokenSymbol} = selfHeader[0]

    const transactions: ITransactions[] = [
        {status: "failed" , value: 5500,name:'Nancy' ,date: '11/12/2022',tokenSymbol},
        {status: "succeeded" , value: 5500,name:'Nancy' ,date: '11/12/2022',tokenSymbol},
        {status: "succeeded" , value: 5500,name:'Nancy' ,date: '11/12/2022',tokenSymbol},
    ]

    const historyTransactions = transactions.map((transaction,num:number)=>{
        return(
            <OrgTransactionHistory key={num} transaction={transaction}/>
        )})

    return(
            <>
                <div className="my-4 flex justify-between text-center">
                    <span className='text-primaryGray font-semibold text-4'>History</span>
                    <button className="text-primaryOrange font-light text-13px">Show All</button>
                </div>
                <ul>
                    {historyTransactions}
                </ul>
            </>
    )
}

export default HistoryOrg;