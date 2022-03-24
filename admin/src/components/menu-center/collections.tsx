import React, { useRef, useState } from "react";
import { List, Tabs, Space} from "antd";

import useSWR,{mutate} from "swr"
import axios from 'axios'
import moment, { Moment } from 'moment'

import Spinner from 'components/spin/spiner'
import { COLLECTIONS } from 'common/apiEndpoints'

import MenuCenterType from "./components/menuCenterType";
import AddMenuType from './components/menuCenterDynamicType'
import EditMenuType from './components/menuCenterDynamicType'

import ViewElement from "./components/viewElement";
import DeleteElement , { deleteProps } from "components/modals/removeItem";
const { TabPane } = Tabs;



type Img = {
  path:string
}
export type menuType ={
  key?:string,
  _id:string,
  name:string,
  title:string,
  description:string,
  slug:string,
  status:boolean,
  backgroundColor:string,
  image:Img,
  createdAt:Moment,
  updatedAt:Moment,
  category?:[menuType],
  subCategory?:[menuType],
  childrenSubCategory?:[menuType]
}

const Index =()=>{
  const fetcher = url => axios.get(url).then(res => res.data)
  const { data,mutate, error } = useSWR(COLLECTIONS, fetcher)
  const [activeTab,setActiveTab]=useState('collection')
  const [TabCollection, setTabCollection] = useState({key:'',component:null})
  const [subCategoryTab, setSubCategoryTab] = useState({key:'',component:null})
  const [subCategoryChildTab, setSubCategoryChildTab] = useState({key:'',component:null})



  const runMutateUrl =()=> {
    mutate()
  }

  const TabSwitch = (item, type)=>{
    if(type === 'collection'){
      const subCategoryTab = {
        key:item.name,
        component:<MenuCenterType runMutateFunction={runMutateUrl} childType={'category'} item={item} onCategoryClick={TabSwitch}/>
      }
      setSubCategoryTab(subCategoryTab)
      setActiveTab(item.name)
    }

    if(type === 'category'){
      const setSubCategoryChild = {
          key:item.name,
          component:<MenuCenterType runMutateFunction={runMutateUrl} childType={'sub-category'} item={item} onCategoryClick={TabSwitch}/>
      }
      setSubCategoryChildTab(setSubCategoryChild)
      setActiveTab(item.name)
    }
  }



  const collectionOnclick =(item:menuType)=>{
    const tabCollection = {
        key:item.name,
        component:<MenuCenterType runMutateFunction={runMutateUrl} childType={'collection'} item={item} onCategoryClick={TabSwitch}/>
    }
    setTabCollection(tabCollection)
    setActiveTab(item.name)
  }


  const Collections = () =>{
    const buttonActions = useRef([])
        
    const displayActions=(key)=>{
        buttonActions.current[key].classList.add('active')
    }
    const hideActions=(key)=>{
        buttonActions.current[key].classList.remove('active')
    }

    let newData = [];

    if(error){
        return (
            <h5>No data to load !!</h5>
        )
    }

    if (!data) return <Spinner />
    else newData = data.collections.map(collection=>{
        
       return ({
        ...collection,
        key:collection._id,
        name:collection.name,
        title:collection.title,
        image:collection.image,
        createdAt:moment(collection.createdAt).format('DD MMM YYYY'),
        updatedAt:moment(collection.updatedAt).format('DD MMM YYYY'),
        status:collection.status,
        })
    })


    console.log('newData::',newData)

    return(
          <div className="menu-center-body">
            <List
            header={<div className="menu-center-body-title-absolute"><AddMenuType type="collection" mode="add" runMutate={runMutateUrl} /></div>}
            itemLayout="vertical"
            size="large"
            dataSource={newData}
            renderItem={item => {
              const deleteItem:deleteProps = {
                  type:'collection',
                  targetUrl: COLLECTIONS,
                  itemId:item.key,
                  itemName:item.name,
                  button:'icon'
                }
              
              return(
              <div key={item.key} className="menu-center-item-absolute" onMouseOver={()=>displayActions(item.key)} onMouseOut={()=>hideActions(item.key)}>
                <List.Item
                  key={item.title}
                  extra={
                    <img
                      alt="image"
                      src={item.image.path}
                    />
                  }
                >
                  <List.Item.Meta
                    title={<a onClick={()=>collectionOnclick(item)}>{item.name}</a>}
                    description={item.title}
                  />
                  {item.description}
                </List.Item>
                <div className="menu-center-item-actions" ref={el=>buttonActions.current[item.key]=el}>
                  <ViewElement type='collection' item={item} />
                  <EditMenuType type="collection" mode="edit" item={item} runMutate={mutate} />
                  <DeleteElement doRefrech={mutate} {...deleteItem}/>
                </div>
              </div>
            
            )}}  
          />
          </div>
        )
  }                       
  const tabOnChange = (key)=>{
      switch (key) {
        case subCategoryTab.key:
          setSubCategoryChildTab({key:'',component:null})
          setActiveTab(subCategoryTab.key)
          break;
        case TabCollection.key:
          setSubCategoryTab({key:'',component:null})
          setSubCategoryChildTab({key:'',component:null})
          setActiveTab(TabCollection.key)
          break;
        case 'collection':
          setTabCollection({key:'',component:null})
          setSubCategoryTab({key:'',component:null})
          setSubCategoryChildTab({key:'',component:null})
          setActiveTab('collection')
          break;
        default:
          break;
      }
  }

  return (
          <>
            <Space size={40} direction='vertical'>
                <h3 className='contentTitle'>{'< '}Menu Management </h3>
            </Space>
            <> 
              <Tabs activeKey={activeTab} onChange={tabOnChange}>
                  <TabPane tab='collection >' key='collection'><Collections/></TabPane>
                  {TabCollection.key?<TabPane  tab={TabCollection.key +' >'} key={TabCollection.key}>{TabCollection.component}</TabPane>:null}
                  {subCategoryTab.key?<TabPane tab={subCategoryTab.key+' >' } key={subCategoryTab.key}>{subCategoryTab.component}</TabPane>:null}
                  {subCategoryChildTab.key?<TabPane tab={subCategoryChildTab.key+' >' } key={subCategoryChildTab.key}>{subCategoryChildTab.component}</TabPane>:null}
              </Tabs>
            </>
          </> 
  );
} 

export default Index
