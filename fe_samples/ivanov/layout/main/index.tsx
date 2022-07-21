//import modules
import React, {FC, ReactNode} from 'react';

//import components
import Navbar from '../../components/common/navbar'

type MainlayoutProps = {
    children: ReactNode;
};

const Mainlayout: FC<MainlayoutProps> = ({children }) => {

    return (
        <>
            <Navbar>
            {children}
            </Navbar>
        </>
    );
};

export default Mainlayout;
