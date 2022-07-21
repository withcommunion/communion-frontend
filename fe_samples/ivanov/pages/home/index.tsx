//modules
import React, { FC, useState } from 'react';
import type { NextPage } from 'next'
import Image from 'next/image';
// import InfiniteScroll from 'react-infinite-scroller';

//custom Components
import Mainlayout from '../../layout/main'

//token tip component
type TokenTipProps = {
	number: number,
	tip: string,
	img: string
};

const TipComponent: FC<TokenTipProps> = ({ number, tip, img }) => {
	return (
		<>
			<div className="mb-[10px] bg-white rounded-[12px] px-[18px] flex flex-wrap justify-between">
				<div className='flex flex-wrap py-[22px]'>
					<div className='text-[45px] leading-none font-bold text-color-text-normal'>{number}</div>
					<div className='flex flex-col justify-center ml-[12px]'>
						<p className='text-[14px] text-color-text-card-title'>Token Tip</p>
						<p className='text-[17px] text-color-text-number font-bold'>{tip}</p>
					</div>
				</div>
				<Image  width="82px" height="80px" src={img} alt="" />
			</div>
		</>
	);
};

const tips = [
	{
		number: 15,
		tip: 'Сompliance',
		img: '/images/06.svg'
	},
	{
		number: 10,
		tip: 'Kindness',
		img: '/images/57.svg'
	},
	{
		number: 25,
		tip: 'Politeness',
		img: '/images/08.svg'
	}
]

//History component

type HistoryProps = {
	checked: boolean,
	tip: string,
	time: string
}

const HistoryComponent: FC<HistoryProps> = ({ checked, tip, time }) => {
	return (
		<>
			<div className="mb-[3px] bg-white rounded-[5px] px-[18px] flex flex-wrap justify-between">
				<div className='flex flex-wrap py-[16px]'>
					{
						checked ? (<Image width='25px' height='21px' src="/images/check-icon.svg" alt="" />) : (<Image width='25px' height='21px' src="/images/warning-icon.svg" alt="" />)
					}
					<p className='text-[15px] ml-[7px] text-color-text-number flex flex-col justify-center leading-[0.8]'>{tip}</p>
				</div>
				<div className='text-[13px] flex text-color-text-gray items-center'>
					{time}
				</div>
			</div>
		</>
	);
};




const Home: NextPage = () => {

	//States
	const [expanded, setExpanded] = useState(false)

	//History data
	const historyData = [
		{
			checked: false,
			tip: 'Claiming 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
		{
			checked: true,
			tip: 'Sent Nancy 5500 PPP',
			time: '1h ago'
		},
	]

	//show All and Less
	const historyDataDisplay = expanded ? historyData : historyData.slice(0, 3)
	return (
		<Mainlayout>

			<div className="flex-auto content-center ">
				<div className="bg-color-background-body">
					<div className="flex flex-col pt-[54px] pr-[25px] pl-[25px] font-roboto overflow-y-auto mobile-screen-height">
						{/* <InfiniteScroll
							pageStart={0}
							// loadMore={loadFunc}
							hasMore={true || false}
							loader={<div className="loader" key={0}>Loading ...</div>}
						> */}
							{
								expanded ? (
									<></>
								) : (
									<>
										<div className="font-medium flex text-color-text-normal text-bold text-[19px] ">
											<img width='20px' height='20px' src="/images/emoji-happy.svg" className='mr-[9px]' alt="" />
											Hi, Alexander
										</div>

										<div className="mt-[20px] mb-[22px] bg-color-background-normal rounded-[6px] p-[17px]">
											<div className="flex flex-row content-center">
												<div className="flex-auto text-color-text-placeholder w-40 text-[16px] mr-[15px] font-normal">
													<p className='my-[6px]'>Your Balance</p>
												</div>
												<div className='flex bg-white rounded-[6px]'>
													<img width='9px' height="15px" src="/images/caret-left-icon.svg" className='mx-[15px]' alt=""  />
													<input type="text" className='bg-white w-full focus-visible:outline-0 text-[17px] text-color-text-normal rounded-[6px]' defaultValue="5500 PPP" />
												</div>


											</div>
										</div>
										{
											tips.map((element, index) => (
												<TipComponent number={element.number} tip={element.tip} img={element.img} key={index}></TipComponent>
											))
										}
									</>
								)
							}
							<div className='flex justify-between my-[20px]'>
								<p className='text-[16px] text-color-text-number font-bold'>History</p>
								<p className='text-[13px] text-active cursor-pointer' onClick={() => setExpanded(!expanded)}>{expanded ? 'Show Less' : 'Show All'}</p>
							</div>
							{
								historyDataDisplay.map((element, index) => (
									<HistoryComponent checked={element.checked} tip={element.tip} time={element.time} key={index} />
								))
							}
						{/* </InfiniteScroll> */}
					</div>
			</div>
		</div>
		</Mainlayout >
	)
}

export default Home
