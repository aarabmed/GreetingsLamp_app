
import React from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin,Dropdown } from 'antd';
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import {logoutUser} from "redux/actions/userActions";
import { setRoute } from 'redux/actions/globalActions';
  

const  AvatarDropdown=()=>{
  const {currentUser} = useSelector((state) => state.userReducer);
  const {avatar,userName} = currentUser
  const dispatch = useDispatch();
  const router = useRouter()

    const onMenuClick = (event) => {
      const { key } = event;
        
      if (key === 'logout') {
        return dispatch(logoutUser())
      }
      dispatch(setRoute(`/admin/users/${key}`))
      router.push({pathname:`/admin/users/${key}`,query:{id:currentUser.userId}},`/admin/users/${key}`)
    };
  
    const menuHeaderDropdown =()=> (
        <Menu className='avatarDropdownMenu' onClick={onMenuClick}>
            <Menu.Item key="profile">
              <UserOutlined />
                Profile
            </Menu.Item>
    
            {/* <Menu.Item key="settings">
              <SettingOutlined />
              Settings
            </Menu.Item> */}
  
            <Menu.Item key="logout">
              <LogoutOutlined />
              Log out
            </Menu.Item>
        </Menu>
    );
      
      return (
        <Dropdown trigger={['hover']} overlay={menuHeaderDropdown}>
          <span className={`avatarDropdown`}>
             <Avatar size="small" className='avatar-header' src={`/assets/avatars/${avatar}.png`} alt="avatar" />
             <span>{userName}</span>
          </span>
        </Dropdown>
      ) 
}

export default AvatarDropdown