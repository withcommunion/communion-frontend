import SmileImg from "../../resourses/home/smileEmoji.svg";
import ArrowImg from "../../resourses/home/Arrow.svg";
import ComplianceImg from "../../resourses/home/tokenTips/Compliance.png";
import KindnessImg from "../../resourses/home/tokenTips/Kindness.png";
import PolitenessImg from "../../resourses/home/tokenTips/Politeness.png";
import History from "./history/History";

export default function Home(){
 
    // From tokenTips
    const tokens = [
        {name: "Compliance", value: 15,image: ComplianceImg},
        {name: "Kindness", value: 10,image: KindnessImg},
        {name: "Politeness", value: 25,image: PolitenessImg},
    ]

    const tokenTips = tokens.map(token => {return(
        <div className="text-tokens my-2.5 bg-white justify-between rounded-xl flex items-center px-4">
            <div className="flex items-center">
                <span className="font-bold text-tokenBig mr-3 py-4">{token.value}</span>
                <div className='flex flex-col'>
                <span className="font-normal text-[#B0B2D6] ">Token Tip</span>
                <span className="font-semibold">{token.name}</span>
                </div>
            </div>
            <img src={token.image} alt={token.name}/>
        </div>)
    })

    return(
        <div className="bg-[#F8F8F9] pb-2">
            <div className="container w-full px-6 my-0 mx-auto">
            <div className="flex py-5">
            <img src={SmileImg} alt="smile emoji"/><span 
            className="mx-2 text-greet font-medium text-black-gray">Hi, Alexander</span>
            </div>
            <div className="bg-[#EDEDF3] rounded-md flex justify-between items-center px-4 py-4 font-normal">
            <span className="text-4 text-[#A9ABB9]">Your Balance</span>
            <div className="flex  rounded-lg bg-[#ffffff] px-4 py-3 w-44">
            <img src={ArrowImg} alt="arrow"/>
            <span className="text-balance text-black-gray px-3">5500 PPP</span></div>
            </div>

            <div className="my-6">
            {tokenTips}
            </div>
            <div className="my-8">
                <History/>
            </div>
        </div>
        </div>
    )
}