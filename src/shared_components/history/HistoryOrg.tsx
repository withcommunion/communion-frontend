import HistoryOperation from './historyOperation/HistoryOperation'

export interface IOperations {
    status:string,value:number,name:string,date:string
}
const HistoryOrg = () => {

    const operations: IOperations[] = [
        {status: "mistake" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
    ]

    const historyOperations = operations.map((operation,num:number)=>{
        return(
            <HistoryOperation key={num} operation={operation}/>
        )})

    return(
            <>
                <div className="my-4 flex justify-between text-center">
                    <span className='text-tokens font-semibold text-4'>History</span>
                    <button className="text-[#FF8A00] font-light text-showAll">Show All</button>
                </div>
                <div>
                    {historyOperations}
                </div>
            </>
    )
}

export default HistoryOrg;