import React, { useState } from 'react';
import {Tag, Modal, Divider, Button} from "antd";
import { useDispatch } from "react-redux";
import {withAuth} from 'common/isAuthenticated'
import { menuType } from '../collections';
import { EyeOutlined } from '@ant-design/icons';
import { IKImage, IKContext } from 'imagekitio-react'

  type Element ={
    name:React.ReactChild,
    title:React.ReactChild,
    status:React.ReactChild,
    createdAt:React.ReactChild,
    lastUpdate:React.ReactChild,
    subCategory?:[React.ReactChild],
    childrenSubCategory?:[React.ReactChild],
    category?:[React.ReactChild],
    bgColor?:React.ReactChild
  }
  type Props ={
    item:menuType,
    type:string,
  }
const ModalView:React.FC<Props>=(props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  
  const showModal = async () => {
     return await withAuth(()=>{
      setIsModalVisible(true) 
      convert(props)
     },dispatch)
  };


  const handleCancel = () => {
    setIsModalVisible(false);
    setData({})
  };

  const Rect=({HexColor}:React.SVGProps<SVGSVGElement> & {HexColor?:string})=>(
    <svg width="200" height="40" >
        <rect width="200" height="40" rx="8" ry="8" fill={HexColor} />
    </svg> 
  )

  const convert =({type,item})=>{

    let newObject:Element = {
      name:<span key='1'>{item.name}</span>,
      title:<span>{item.title}</span>,
      createdAt:<span>{item.createdAt}</span>,
      lastUpdate:<span>{item.updatedAt}</span>,
      status:<Tag color={item.status? 'green':'red'}>{item.status?'Active' : 'Inactive'}</Tag>,
    }
    if(type==='collection'){
      newObject = {
        ...newObject,
        bgColor:<Rect HexColor={item.backgroundColor}/>,
        category:item.category.length?[item.category.map((item)=>(<Tag color="blue" key={item._id}>{item.name}</Tag>))]:[<span key='111'>no category associated</span>],
      }
    }
    if(type==='category'){
      newObject = {
        ...newObject,
        bgColor:<Rect HexColor={item.backgroundColor}/>,
        subCategory:item.subCategory.length?[item.subCategory.map((item)=>(<Tag color="blue" key={item._id}>{item.name}</Tag>))]:[<span key='111'>no sub-category associated</span>],
      }
    }
    if(type==='subCategory'){
      newObject = {
        ...newObject,  
        childrenSubCategory:item.childrenSubCategory.length?[item.childrenSubCategory.map((item)=>(<Tag color="success" key={item._id}>{item.name}</Tag>))]:[<span key='111'>no sub-items associated</span>],
      }
    }
    
    setData(newObject);
  }


 
 
  const title = (value) =>{
    switch (value) {
      case 'lastUpdate':
        return 'Last Update'
      case 'createdAt':
        return 'Created At'
      case 'slug':
        return 'Slug'
      case 'status':
        return 'Status'
      case 'subCategory':
          return 'Sub-Categories'
      case 'childrenSubCategory':
        return 'Sub-Category-items'
      case 'title':
        return 'Title'
      case 'name':
        return 'Name'
      case 'bgColor':
        return 'Background Color'
      case 'category':
        return 'Category'
      default:
        break;
    }
  }
  
  const {item} = props
  return (
    <>
      <Button onClick={showModal} icon={<EyeOutlined />} key='1qw'/>
      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null} width={820}>
        <div className='category-modal-container'>
          <div
            className='categoryImage'
          >
            <IKContext urlEndpoint="https://ik.imagekit.io/gl">
                <IKImage path={item.image.filePath} 
                  loading="lazy"
                  lqip={{ active: true }}
                />
            </IKContext>
          </div>
          <div className='modal-content'>
                {
                  Object.keys(data).map((e,index)=>{ 
                    if(data[e]){
                      return(
                          <div key={index} className='mc-main'>
                            <Divider orientation="left">{title(e)}</Divider>
                            <div className='mc-sub-main'>
                              {data[e]}
                            </div>
                          </div>
                        )
                      }
                  })
                } 
          </div>
        </div>
      </Modal>
    </>
  );
}

export default React.memo(ModalView)
