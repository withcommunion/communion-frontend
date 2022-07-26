import Link from "next/link";
import { useRouter } from "next/router";

export interface IMenu {
    name:string,image:string,activeImage:string,linkHref:string
}

export default function Menu(){

    const router = useRouter();

    const pages: IMenu[] = [
        {name:"home",image:"/images/menu/Home.svg",activeImage:"/images/menu/HomeActive.svg",linkHref:"/org/org-jacks-pizza-1/indexPlayground"},
        {name:"send",image:"/images/menu/Redeem.svg",activeImage:"/images/menu/RedeemActive.svg",linkHref:"#"},
        {name:"redeem",image:"/images/menu/Send.svg",activeImage:"/images/menu/SendActive.svg",linkHref:"#"},
        {name:"settings",image:"/images/menu/Settings.svg",activeImage:"/images/menu/SettingsActive.svg",linkHref:"#"}]

    const Links = pages.map((singleLink,num:number)=>{
        return(
            <div key={num} className="w-12 h-full">
                <div className={router.asPath == singleLink.linkHref ? "w-12 h-1 bg-menu rounded-xl"
                    : "none"}></div>
            <Link href={singleLink.linkHref}>
                <a className="flex items-center justify-center h-full"><img src={router.asPath == singleLink.linkHref
                    ?singleLink.activeImage
                    :singleLink.image} alt={singleLink.name}/></a>
            </Link>
            </div>
        )
    })

    return(
        <div className="fixed h-14 inset-x-0 bottom-0 bg-white shadow-menuShadow">
            <div className="flex justify-around items-center mx-1 h-full ">
                {Links}
            </div>
        </div>
    )
}