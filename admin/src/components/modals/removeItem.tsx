import React ,{useEffect, useState} from 'react'
import Icon, { DeleteOutlined } from '@ant-design/icons';
import { useSelector,useDispatch } from "react-redux";
import { Modal, Button, Space } from 'antd';
import axios from 'axios'
import Icons from 'assets/icons'

import {withAuth} from 'common/isAuthenticated'

export type deleteProps ={
  itemId:string,
  itemName:string,
  targetUrl:string,
  type:string,
  button?:"link" | "regular"|"icon",
  onDelete?:()=>void,
  doRefrech?:()=>void,
  customButton?:JSX.Element
}

const SuccussIcon  = ()=> <Icon component={Icons.successIcon} />
const FailIcon  = ()=> <Icon component={Icons.failIcon} />

const deleteFunction=({itemId,type,targetUrl,itemName,button,onDelete,doRefrech,customButton}:deleteProps)=>{
     const {currentUser} = useSelector((state) => state.userReducer);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);
    const [visible, setVisible] = useState(false);

    const dispatch = useDispatch()

    const handleCancel =()=>{
        
        if(isDeleted && typeof(onDelete) === 'function'){
          onDelete()
        }
  

        isDeleted?doRefrech():null
        setVisible(false)
        setMessage('')
    }

    

    const showModal = ()=>{
      withAuth(()=>setVisible(true),dispatch)
    }





    const confirmDelete =()=>{
      withAuth(()=>{
          setConfirmLoading(true)
          const {userId} = currentUser
          const axiosInstance = axios.create({
            validateStatus: function (status)
            {
                return true
            }
          });
          axiosInstance.patch(
            `${targetUrl}/delete/${itemId}`,
            {currentUserId:userId},
          ).then(res=>{
              if (res.status===200) { 
                  setConfirmLoading(false);
                  setMessage(res.data.message)
                  setVisible(true)
                  setIsDeleted(true)
                  
              }else{
                  setConfirmLoading(false);
                  setIsDeleted(false)
                  setMessage(res.data.message)
              }
          }).catch(e=>{
              console.log('Error:',e)
          })
      },dispatch)
    }

    const withProps = isDeleted ? {
      footer:null
    }:{}

    const CButton = () =>{
      if(React.isValidElement(customButton)){
        return <div onClick={showModal}>{customButton}</div>
      }
      if(button==='link') return <a onClick={showModal} key='1582'> delete </a>
      if(button==='icon') return <Button icon={<DeleteOutlined/>} onClick={showModal} key='2639'/>
      else return <Button key="1111" type='primary' danger onClick={showModal}>Delete</Button>
    }

    return(
    <>
      <CButton/>
      <Modal
          title={false}
          visible={visible}
          centered={true}
          confirmLoading={confirmLoading}
          onCancel = {handleCancel}
          onOk={confirmDelete}
          cancelText='Return'
          width={400}
          okText = {message?'Try again':'Confirm'}
          {...withProps}
          forceRender={true}
        >
          {!message?
          <div className="warning-modal-container">
            <h4>Are you sure of removing this item? </h4>
            <p> Type : <span >{type.charAt(0).toUpperCase() + type.slice(1)}</span></p> 
            <p> Name : <span > {itemName}</span></p>
          </div>:<div className='warrningModal'>
            {isDeleted?<SuccussIcon/>:<FailIcon/>}<span> {message}</span>
          </div>
          }

      </Modal>
    </>
    )
}

export default deleteFunction