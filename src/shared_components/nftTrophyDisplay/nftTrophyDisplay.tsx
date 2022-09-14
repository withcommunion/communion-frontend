import Image from "next/image";

interface CommunionNft {
    erc721Meta: {
        title: string,
        properties: {
            name: string,
            description: string,
            image: string,
            attributes: {
                display_type: number,
                trait_type: string,
                value: number
            }
        }
    }
}

interface Props {
    nfts: CommunionNft[]
    showcaseNft: CommunionNft | null
}

export default function NftTrophyDisplay({nfts = [], showcaseNft = null}: Props) {
    return(
        <div className='flex justify-center items-center w-full h-full'>
            <div className='bg-white rounded shadow-nftTrophyShadow flex items-center justify-start'>
                {(nfts.length > 1)?
                    <Image width='75%' height="75%" src={nfts[1].erc721Meta.properties.image} alt='nftTrophy image'/>:
                    <div className='-left-20% relative flex items-center'>
                        <Image width='85%' height='75%' src={'/images/nftTrophyDisplay/Car.png'} alt='nftTrophy image'/></div>}
            </div>
            <div className='bg-white rounded shadow-nftTrophyShadow flex items-center justify-center z-10'>
                {(nfts.length > 0)?
                    <Image width='100%' height='100%' src={showcaseNft ? showcaseNft.erc721Meta.properties.image :
                        nfts[0].erc721Meta.properties.image} alt='nftTrophy image'/> :
                    <Image width='100%' height='100%' src={'/images/nftTrophyDisplay/clock.png'} alt='nftTrophy image'/>}
            </div>
            <div className='bg-white rounded shadow-nftTrophyShadow flex items-center justify-end relative'>
                {(nfts.length === 3)?
                    <Image width='75%' height='75%' src={nfts[2].erc721Meta.properties.image} alt='nftTrophy image'/>:
                    <div className='-right-20% relative flex items-center'>
                        <Image width='85%' height='75%' src={'/images/nftTrophyDisplay/Airplane1.png'} alt='nftTrophy image'/>
                    </div>}
            </div>
        </div>
    )
};