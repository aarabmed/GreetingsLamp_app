

import * as React from "react";
import Icon, { NodeIndexOutlined } from '@ant-design/icons';
import Icons from 'assets/icons' 
import { cardType } from "./modals/viewCard";
import { deleteProps } from "components/modals/removeItem";
import { CARDS } from "common/apiEndpoints";
import DeleteCard from 'components/modals/removeItem'
import { IKImage, IKContext } from 'imagekitio-react'

interface CardProps {
    cover:string,
    removeButton?:boolean,
    afterRemove?:()=>void,
    onClick?:(item:cardType)=>void,
    item?:cardType,
    width?:number
}

const defaultProps: CardProps = {
    cover: '',
    removeButton: true,
}

interface BodyProps  {
    title:string,
    description?:string
}

interface CardSubComponents {
    Body: React.FunctionComponent<BodyProps>;
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

const RemoveIcon = ()=><Icon component={Icons.removeIcon} />

const Index:React.FC<CardProps> & CardSubComponents =({width,item,cover,onClick,afterRemove,removeButton,children})=>{    
    const propsDelete:deleteProps={
        itemId:item._id,
        type:'Card',
        targetUrl:CARDS,
        itemName:item.title,
        doRefrech:afterRemove
    }
    
    const deleteButton  = <div className='bc-card-remove-button'>
        <RemoveIcon/><span>Remove</span>
    </div>
    return(
    <div className='bc-card' style={{width:`${width}px`}}>
        <div className='bc-card-img' onClick={()=>onClick(item)}>
            <IKContext urlEndpoint="https://ik.imagekit.io/gl">
                 <IKImage path={cover} 
                 transformation={[{
                    "height": "291",
                    "width": "200"
                  }]}
                  loading="lazy"
                  lqip={{ active: true }}
                 />
            </IKContext>
        </div>
        {removeButton&&<DeleteCard customButton={deleteButton}  {...propsDelete} key='454'/>}
        <>
            <div onClick={()=>onClick(item)}>
                {children}
            </div>
        </>
    </div>
    )
}
Index.defaultProps=defaultProps
Index.Body = Body


export default Index
