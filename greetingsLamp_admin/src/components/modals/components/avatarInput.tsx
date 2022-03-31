
import React,{useState,useEffect} from 'react';
import { Avatar,Popover,Button } from 'antd';
import {CheckCircleTwoTone} from '@ant-design/icons';

interface avatarProps {
  getAvatarValue:(values:any)=>void,
  label?:string,
  defaultAvatar?:number
  size?:number,
}

const  AvatarInput =({getAvatarValue,label,defaultAvatar,size}:avatarProps)=>{
    const [avatarValue, setAvatarValue] = useState(1);
    const [avatarPopoverStatus, setAvatarPopoverStatus] = useState(false)
    

    useEffect(()=>{
      if(defaultAvatar){
        setAvatarValue(defaultAvatar)
      }
      getAvatarValue(avatarValue)
    },[defaultAvatar])

    const closePopover = ()=>{
      setAvatarPopoverStatus(false)
    }

    const handleVisibleChange=(visible)=>{
      
        setAvatarPopoverStatus(visible)
      
    }


    const onAvatarClick =(e)=>{
      const value = +e.target.parentElement.getAttribute('data-index')

      if(typeof(value) === 'number' && value>0 && value<16){
        setAvatarValue(value)
        getAvatarValue(value)
      }
    }



    const items = [
                <img key='1'
                  src="/assets/avatars/1.png"
                />,
              
                <img
                    key='2'
                      src="/assets/avatars/2.png"
                />,
              
                <img
                    key='3'
                    src="/assets/avatars/3.png"
                  />,
              
                <img
                    key='4'
                    src="/assets/avatars/4.png"
                  />,
              
                <img
                    key='5'
                    src="/assets/avatars/5.png"
                  />,
              
                <img
                    key='6'
                    src="/assets/avatars/6.png"
                  />,
              
                <img
                    key='7'
                    src="/assets/avatars/7.png"
                  />,
              

                <img
                    key='8'  
                    src="/assets/avatars/8.png"
                  />,
              
                <img
                    key='9'  
                    src="/assets/avatars/9.png"
                />,
              

                <img
                    key='10'
                    src="/assets/avatars/10.png"
                />,
              

                <img
                    key='11'
                    src="/assets/avatars/11.png"
                />,
              

                <img
                    key='12'
                    src="/assets/avatars/12.png"
                />,
              

                <img
                    key='13'
                    src="/assets/avatars/13.png"
                />,
              

                <img
                    key='14'
                    src="/assets/avatars/14.png"
                />,
              

                <img
                    key='15'
                    src="/assets/avatars/15.png"
                /> 
    ]
    
    const newItems = items.map((item,index)=><div className="singleAvatar" key={index} data-index={index+1}>{ avatarValue===index+1?(<div className="active"><CheckCircleTwoTone key="1465412"/>{item}</div>):item}</div>)
      return (
        <div className='avatar-input'>
          {label?<span>{label}</span>:null}
          <div className='avatar-container'> 
            <Popover
              content={<div className='avatarList' onClick={onAvatarClick} >{newItems}<Button  block type='default' className='avatar-close-button'  onClick={closePopover}>Close</Button></div>}
              title="Choose your own avatar"
              trigger="click"
              visible={avatarPopoverStatus}
              onVisibleChange={handleVisibleChange}
              placement="right"
            >
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: size?size:80, xxl: 100 }}
                  src={avatarValue?`/assets/avatars/${avatarValue}.png`: "/assets/avatars/1.png"}
                />
              
            </Popover>
          </div>
        </div>
      ) 
}

export default AvatarInput