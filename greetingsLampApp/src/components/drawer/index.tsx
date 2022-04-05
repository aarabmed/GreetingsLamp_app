import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { Button } from "antd"
import React, { useState } from "react"




const Index:React.FC=({children})=>{
    const [offset, setOffset] = useState(240);

    const showDrawer = () => {
        offset===0?setOffset(0):setOffset(240)
    };
    
    

    return (
        <div className="gl-drawer" style={{left:-1*offset}}>
            <div className={ offset===0?`gl-drawer-mask`:''}></div> 
            <div className="drawer-wrapper">
                {children}
            </div>

        
            <Button type="primary" className="sb-drawer-button" onClick={showDrawer}>
                {React.createElement(offset?DoubleRightOutlined:DoubleLeftOutlined)}
            </Button>
        </div>
    )
}


export default Index