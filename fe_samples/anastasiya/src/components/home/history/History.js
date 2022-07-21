// import styles from './History.module.scss';
import SuccessImg from '../../../resourses/home/history/success.svg';
import WarningImg from '../../../resourses/home/history/warning.svg';
// import Alert from '../../../resourses/home/history/alert.svg'

export default function History(){

    // From historyOperations
    const operations = [
        {status: "mistake" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        // {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        // {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        // {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        // {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        // {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        // {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        // {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        // {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
        // {status: "successfully" , value: 5500,name:'Nancy' ,date: '11/12/2022'},
    ]

    const historyOperations = operations.map(operation=>{
        return(
       <div className="flex items-center justify-between px-3 bg-white my-1 rounded">
        <div className="flex items-center">
            <img src={operation.status === "successfully"?SuccessImg:WarningImg} alt='operation'
            className="mr-2"/>
            <span className="py-4 text-tokens font-normal text-15px">
              {operation.status === "successfully"?`Sent ${operation.name} `
              :"Claiming "} {operation.value} PPP
            </span>
        </div>
        <div>
            <span className="text-[#9094BB] text-showAll font-light">{operation.date}</span>
        </div>
       </div>
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