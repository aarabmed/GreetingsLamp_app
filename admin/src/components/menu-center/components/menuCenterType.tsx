import React, { useEffect, useRef, useState } from "react";
import { List} from "antd";

import AddMenuType from './menuCenterDynamicType'
import EditMenuType from './menuCenterDynamicType'
import { menuType } from "../collections";
import { Parent } from "./menuCenterHeader";
import useSWR from "swr";
import { CATEGORIES,COLLECTIONS, SUB_CATEGORIES, SUB_CATEGORIES_CHILD } from "common/apiEndpoints";
import axios from "axios";
import ViewElement from './viewElement'
import DeleteElement ,{ deleteProps }from 'components/modals/removeItem'

type Props ={
    item?: menuType,
    onCategoryClick?:Function,
    runMutateFunction?:()=>void,
    childType?:string
}    
 

    const Index:React.FC<Props> = ({item,onCategoryClick,runMutateFunction,childType})=>{
        const fetcher = (url,params) => axios.get(url+`/${params}`).then(res => res.data)
    

        const getUrl = (childType)=>{    
            let url
            switch (childType) {
                 
                    case 'collection':
                        url = COLLECTIONS
                        break;
                    case 'category':
                        url = CATEGORIES   
                        break;
                    case 'sub-category':
                        url = SUB_CATEGORIES   
                        break;
                    default:
                        break;
            }
            return url
        }


        const urlDelete = (childType)=>{    
            let url
            switch (childType) {       
                    case 'collection':
                        url = CATEGORIES
                        break;
                    case 'category':
                        url = SUB_CATEGORIES   
                        break;
                    case 'sub-category':
                        url = SUB_CATEGORIES_CHILD   
                        break;
                    default:
                        break;
            }
            return url
        }


        const { data, mutate, error ,revalidate} = useSWR([getUrl(childType),item._id], fetcher)
        
        const [menuType, setMenuType] = useState('')
        const [listTitle, setListTitle] = useState('Collection')
        const [listCategories, setListCategories] = useState([])
        const [headerItem, setHeaderItem] = useState(item)

        const buttonActions = useRef([])
        const displayActions=(key)=>{
            buttonActions.current[key].classList.add('active')
        }
        const hideActions=(key)=>{
            buttonActions.current[key].classList.remove('active')
        }

        const ItemOnclick =(item,type)=>{
            onCategoryClick(item,type)
        }

        const runMutate = ()=>{
            mutate()
            runMutateFunction()
        }
       

        useEffect(()=>{ 
            
            if(data){
                DataList()
            } 
        },[data])

        const DataList = ()=>{ 
            let list           
            switch (childType) {
                case 'collection':
                    setMenuType('category')
                    setListTitle('Categories')
                   
                    setHeaderItem(data.collection)
                    console.log('category:',data.collection.category)
                    list = data.collection.category.map(cat=>({
                        ...cat,
                        key:cat._id,
                        name:cat.name,
                        title:cat.title,
                        image:cat.image,
                        status:cat.status,
                    }))
                    break;
                case 'category':
                    setMenuType('sub-category')
                    setListTitle('Sub-categories')
                    setHeaderItem(data.category)

                   
                    list = data.category.subCategory.map(sub=>({
                        ...sub,
                        key:sub._id,
                        name:sub.name,
                        title:sub.title,
                        image:sub.image,
                        status:sub.status,
                    }))
                    break;
                case 'sub-category':
                    setMenuType('sub-category-child')
                    setListTitle('Sub-Category Children')
                    setHeaderItem(data.subCategory)
                    list = data.subCategory.childrenSubCategory.map(subCh=>({
                        ...subCh,
                        key:subCh._id,
                        name:subCh.name,
                        title:subCh.title,
                        image:subCh.image,
                        status:subCh.status,
                    }))
                    break;
                default:
                    break;
            }
           
            setListCategories(list)
        }

    
        return (
            <>
                <Parent item={headerItem} type={childType} headerMutate={runMutate}/>
                <div className="menu-center-body">
                    <List
                        header ={<div className="menu-center-body-title">
                            <h3>{listTitle}</h3>
                            <AddMenuType id={item.key} type={menuType} mode='add' runMutate={runMutate}/>
                        </div>}
                        itemLayout="vertical"
                        size="small"
                        className="menu-center-list"
                        dataSource={listCategories}
                        loading={!data&&!error}
                        renderItem={item => {
                            const deleteItem:deleteProps = {
                                type:menuType,
                                targetUrl: urlDelete(childType),
                                itemId:item.key,
                                itemName:item.name,
                                button:'icon'
                              }
                            return(
                            < div className={`menu-center-item ${!item.status?' inactive':''}`} onMouseOver={()=>displayActions(item.key)} onMouseOut={()=>hideActions(item.key)}> 
                                <List.Item
                                    key={item._id}
                                    actions={[
                                    
                                    ]}
                                    extra={
                                    <img
                                        alt="logo"
                                        src={item.image.path}
                                    />}
                                    
                                >
                                    {console.log('IMGG:',item.image.path)}
                                    <List.Item.Meta
                                    title={childType==='sub-category-child'?<span>{item.name}{!item.status?' (inactive)':''}</span>:<a onClick={()=>ItemOnclick(item,childType)}>{item.name}{!item.status?' (inactive)':''}</a>}
                                    description={item.title}
                                    />
                                    <div className="menu-center-item-description">{item.description}</div> 
                                </List.Item>
                                <div className="menu-center-item-actions" ref={el=>buttonActions.current[item.key]=el}>
                                    <ViewElement type={menuType} item={item} key='1'/>
                                    <EditMenuType type={menuType} mode='edit' item={item} runMutate={runMutate}/>
                                    <DeleteElement doRefrech={mutate} {...deleteItem}/>
                                </div>
                            </div>
                            )
                        }}
                    />
                </div>  
            </>
        )
    }

export default Index


