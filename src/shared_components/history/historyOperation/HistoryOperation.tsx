import {FC} from "react";
import {IOperations} from "@/shared_components/history/HistoryOrg";



const HistoryOperation:FC<{operation:IOperations}> = ({operation}) => {
    const {status , name , value , date } = operation

      return(
            <div className="flex items-center justify-between px-3 bg-[#FFFFFF] my-1 rounded">
                <div className="flex items-center">
                    <img src={status === "successfully"?"/images/home/history/success.svg"
                        :"/images/home/history/warning.svg"} alt='operation'
                         className="mr-2"/>
                    <span className="py-4 text-tokens font-normal text-15px">
              {status === "successfully"?`Sent ${name} `
                  :"Claiming "} {value} PPP
            </span>
                </div>
                <div>
                    <span className="text-[#9094BB] text-showAll font-light">{date}</span>
                </div>
            </div>
    )
}

export default HistoryOperation