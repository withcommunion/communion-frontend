import SelfHeaderOrg from "../../../../../shared_components/header/selfHeaderOrg";
import TokenTip from "../../../../../shared_components/tokenTip/TokenTip";
import HistoryOrg from "../../../../../shared_components/history/HistoryOrg";

export interface IToken {
    name:string,value:string | number,image:string
}

const Home = () => {

    // From tokenTips
    const tokens: IToken[] = [
        {name: "Compliance", value: 15,image: "/images/home/tokenTips/Compliance.png"},
        {name: "Kindness", value: 10,image: "/images/home/tokenTips/Kindness.png"},
        {name: "Politeness", value: 25,image: "/images/home/tokenTips/Politeness.png"},
    ]

    const tokenTips = tokens.map((token,num:number) => {return(
        <TokenTip key={num} token={token}/>
    )})

    return(<div className="bg-[#F8F8F9] pb-2 h-screen">
        <div className="container w-full px-6 my-0 mx-auto">
            <SelfHeaderOrg/>
            <div className="my-6">
                {tokenTips}
            </div>
            <div className="my-8">
                <HistoryOrg/>
            </div>
        </div>
    </div>)
}

export default Home;