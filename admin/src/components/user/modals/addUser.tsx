import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";

import { Modal, Button,Form,
    Input,
    Select,
} from "antd";
import AvatarInput from 'components/modals/components/avatarInput';
import axios from 'axios'
import {withAuth} from 'common/isAuthenticated'
import { NEW_USER } from 'common/apiEndpoints';


const axiosInstance = axios.create({
    validateStatus: function (status)
    {
        return true
    }
});

const addUser = ({fetching}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
  
    const {currentUser} = useSelector((state) => state.userReducer);
    const {authority,userId} = currentUser

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const router = useRouter();

    const showModal = () => {
        setIsModalVisible(true)
    };

    const refreshData = () => {
        router.replace(router.asPath);
        fetching()
    }

    const AvatarValue = (avatar) =>{
        form.setFieldsValue({['avatar']:avatar})
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setConfirmLoading(false);
        form.resetFields();
    };
    

    const onCreate = (values) => { 
        setConfirmLoading(true);
        const data = {...values,currentUserId:userId}
  
        axiosInstance({
            url:NEW_USER,
            data,
            method:'POST',
        }).then(res=>{
            if (res.status===201) {
                setIsModalVisible(false);
                setConfirmLoading(false);
                form.resetFields();
                refreshData();
            }else{
                setConfirmLoading(false);
            }
        }).catch(e=>{
            console.log('Error:',e)
        })
        
    };

    const onOk = () => {
        form
          .validateFields()
          .then(async (values) => {
             await withAuth(()=>onCreate(values),dispatch)
          })
          .catch((info) => {
            console.log('Form errors', info);
          });
    }

    const options =()=>{
        const superAdminOptions  = [
            {label:'REGULAR',value:"REGULAR"},
            {label:'ADMIN',value:"ADMIN"},
            {label:'SUPER ADMIN',value:"SUPER_ADMIN"}
        ]
        const adminOptions = [
            {label:'REGULAR',value:"REGULAR"},
            {label:'ADMIN',value:"ADMIN"},
        ]

        if(authority==='ADMIN'){
            return adminOptions
        }else if(authority==='SUPPER_ADMIN'){
            return superAdminOptions
        }
    }
      
  return (
    <>
      <Button type="primary" onClick={async()=> await withAuth(showModal,dispatch)}>Add a user</Button>
      <Modal confirmLoading={confirmLoading} visible={isModalVisible} onOk={onOk} onCancel={handleCancel} width={670} title={'Create new user'}>
        <div className='user-modal-container'>
          <div className='user-modal-content'>
            <Form
            className={'user-form'}
            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 14,
            }}
            layout="horizontal"
            size='middle'
            form={form}
            name="register"

            >
                <Form.Item
                    name="userName"
                    label={'Username'}
                    rules={[{ required: true, message: 'Please input your Username !'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    {
                        min: 9,
                        message: 'Password must be at least 9 characrers!',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item 
                    label="Role" 
                    name="role" 
                    rules={[
                        { required: true, message: 'Please select level of authority!' },
                    ]}>
                    <Select  options={options()} />
                </Form.Item>
                <Form.Item
                    name="avatar"
                    label={'Avatar'}
                >
                    <AvatarInput getAvatarValue={AvatarValue}/>
                </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default React.memo(addUser)
