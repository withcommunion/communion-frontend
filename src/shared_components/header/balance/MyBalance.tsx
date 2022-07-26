

const MyBalance = () => {
    return(
        <div className="bg-[#EDEDF3] rounded-md flex justify-between items-center px-4 py-4 font-normal">
            <span className="text-4 text-[#A9ABB9]">Your Balance</span>
            <div className="flex  rounded-lg bg-[#ffffff] px-4 py-3 w-44">
                <img src="/images/home/Arrow.svg" alt="arrow"/>
                <span className="text-balance text-black-gray px-3">5500 PPP</span></div>
        </div>
    )
}

export default MyBalance;