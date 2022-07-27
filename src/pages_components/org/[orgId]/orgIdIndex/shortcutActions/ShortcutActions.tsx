import ShortcutAction from "@/pages_components/org/[orgId]/orgIdIndex/shortcutActions/shortcutAction/ShortcutAction";

export interface IShortcutActions {
    name:string,value:string | number,image:string
}

const ShortcutActions = () => {

    const shortcutActions: IShortcutActions[] = [
        {name: "Compliance", value: 15,image: "/images/home/tokenTips/Compliance.png"},
        {name: "Kindness", value: 10,image: "/images/home/tokenTips/Kindness.png"},
        {name: "Politeness", value: 25,image: "/images/home/tokenTips/Politeness.png"},
    ]

    const shortcutAction = shortcutActions.map((action,num:number) => {return(
        // eslint-disable-next-line react/jsx-no-undef
        <ShortcutAction key={num} action={action}/>
    )})
    return(
        <>
            {shortcutAction}
        </>
    )
}

export default ShortcutActions