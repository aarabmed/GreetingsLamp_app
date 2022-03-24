

import * as React from "react";
import Link from "next/link";
import axios from "axios";

interface CardProps {
    cover:string,
    currentPath?:string,
    itemId?:string,
    width?:string,
    height?:string
}

const defaultProps: CardProps = {
    cover: '',
    height:'auto'
}

interface BodyProps  {
    title:string,
    description?:string
}

interface CardSubComponents {
    Body: React.FunctionComponent<BodyProps>;
}


const axiosInstance = axios.create({
    validateStatus: function (status)
    {
        return true
    }
});

const axiosHeader = (value?)=>{
    const config = {
        headers: { 'Content-type': 'application/json' },
        params:value
    };
    return config
}

 const Body:React.FC<BodyProps>=({title,description})=>{
    return (
     <div className='bc-card-body'>
             <div className='bc-card-content'>
                 <span className='bc-card-body-title'>{title}</span>
                 <span className='bc-card-body-description'>{description}</span>
             </div>
     </div>
 )} 


const Index:React.FC<CardProps> & CardSubComponents =({width,height,itemId,cover,currentPath,children})=>{    


    const incrementViews = () =>{
            const body ={
              cardId:itemId
            }
            axiosInstance.patch(
                '/api/cards/views',
                body,
                axiosHeader(),
              ).then(res=>{
                console.log('RES:::',res)
              }).catch(e=>{
                console.log('Error:',e)
              })
    }
    
    
    return(
    <div className='bc-card' style={{width:`${width}px`, height:`${height}px`}}>
        <div className='bc-card-img'>
            <Link href={currentPath+'/'+itemId}>
                <a onClick={incrementViews}>
                    <img alt='example' src={cover} />
                </a>
            </Link>
        </div>
        <>  
            <div>
                {children}
            </div>
        </>
    </div>
    )
}
Index.defaultProps=defaultProps
Index.Body = Body


export default Index
