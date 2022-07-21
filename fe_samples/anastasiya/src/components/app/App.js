import Home from "../home/Home";
import Menu from "../menu/Menu";



export default function App(){
    return(<div>
        <Home/>
        <div className="h-12"><Menu/></div>
    </div>)
}