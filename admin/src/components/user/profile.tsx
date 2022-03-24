import Head from "next/head";
import React, {useState,useRef, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { Button, Form, Input, Modal, Select } from "antd";
import axios from "axios";
import { USERS } from "common/apiEndpoints";
import AvatarInput from "components/modals/components/avatarInput";
import { countDown } from "common/isAuthenticated";
import Spinner from "components/spin/spiner";
import { ExclamationCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { setUser } from "redux/actions/userActions";

const superAdminOptions  = [
    {label:'SUPER ADMIN',value:"SUPER_ADMIN"}
]

const adminOptions = [
    {label:'REGULAR',value:"REGULAR"},
    {label:'ADMIN',value:"ADMIN"},
]

const regularUserOptions = [
    {label:'REGULAR',value:'REGULAR'}
]


const { confirm } = Modal;

const axiosInstance = axios.create({
    validateStatus: function (status)
    {
        return true
    }
});

export default function Profile() {

    const {currentUser} = useSelector((state) => state.userReducer);
    const [isLoading , setLoading] = useState(true)
    const [confirmLoading , setConfirmLoading] = useState(false)
    const [password , setPassword] = useState('')
    const [avatar, setAvatar] = useState(1)

    const {authority,userId} = currentUser
    const userForm = useRef(null)
    const dispatch = useDispatch()
    const [form] = Form.useForm();

    const getUser = async ()=>{
        
        const res = await fetch(`${USERS}/${currentUser.userId}`)

        if(res.status===401){
            setLoading(false)
            countDown(dispatch)
            return
        } 
        const {user} = await res.json()
        const userRole = superAdminOptions.find(role=>role.value===user.authority)
        
        setAvatar(user.avatar)
        form.setFieldsValue({'email':user.email,'userName':user.userName,'role':userRole?userRole.value:'','avatar':user.avatar})
        setLoading(false)
    }

    useEffect(()=>{
       if(isLoading){
           getUser()
       }
    },[isLoading])

    const AvatarValue = (avatar) =>{
        form.setFieldsValue({['avatar']:avatar})
    }

    const options =()=>{   
        if(authority==='ADMIN'){
            return adminOptions
        }else if(authority==='SUPER_ADMIN'){
            return superAdminOptions
        }
        else regularUserOptions
    }

    const onFormSubmit = (values)=>{
        console.log("values:",values)
        const data = {
            userName:values.userName,
            newPassword:values.newPassword,
            email:values.email,
            avatar:values.avatar,
            password:password,
            currentUserId:currentUser.userId,
            role:values.role
        }
        axiosInstance({
            url:`${USERS}/${currentUser.userId}`,
            data,
            method:'PATCH',
        }).then(res=>{
            if (res.status===200) {
                setLoading(true);
                const user = {
                    userId:res.data.user.userId,
                    userName:res.data.user.userName,
                    authority:res.data.user.authority,
                    avatar:res.data.user.avatar,
                    email:res.data.user.email
                }
                dispatch(setUser(user))
                setTimeout(() => {
                    (function success() {
                        Modal.success({
                          content: res.data.message,
                        });
                    }())
                }, 500);
            }
            if(res.status===401){
                countDown(dispatch)
            }else{
                setTimeout(() => {
                    (function error() {
                        Modal.error({
                          content: res.data.message,
                        });
                    }())
                }, 500);
            }

        }).catch(e=>{
            setConfirmLoading(false)
            console.log('Error:',e)
        })
        return true
    }

    const onPasswordChange=(e)=>{
        const yourPassword = e.target.value;
        setPassword(yourPassword)
    }

    const confirmPassword =()=>{
       return confirm({
            style: {padding:'15px 20px 15px'},
            icon: <ExclamationCircleOutlined />,
            content: <div className="confirm-modal">
                <><span>type your current password:</span>
                <Input.Password style={{margin: '7px 0px'}} onChange={onPasswordChange} placeholder="your password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/></>
            </div>
            ,
            onOk: async ()=>{
                await form.submit()
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    return (
        <>
            <Head><title> | Greetings Lamp</title></Head>
            <div className="account-settings">
                {console.log('CURRENT:',currentUser)}
                <h3>User informations:</h3>
                {isLoading?<Spinner/>:
                <Form
                    className={'user-form'}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    size='middle'
                    form={form} 
                    name="register"
                    ref={userForm}
                    onFinish={onFormSubmit}
                >
                    <div className="user-form-wrapper">
                        <div className="left">
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
                            name="new_password"
                            label="New Password"
                            
                        >
                            <Input.Password placeholder="optional"/>
                        </Form.Item>
                        <Form.Item 
                            label="Role" 
                            name="role" 
                            rules={[
                                { required: true, message: 'Please select an account role!' },
                            ]}>
                            <Select  options={options()} />
                        </Form.Item>
                        </div>
                        <div className="right">
                            <Form.Item
                                name="avatar"
                            >
                                <AvatarInput getAvatarValue={AvatarValue} defaultAvatar={avatar} label="Avatar" size={110}/>
                            </Form.Item>
                        </div>
                    </div>
                    
                    <div className="submit-user">
                        <Form.Item>
                            <Button type="primary" onClick={confirmPassword}>Submit</Button>
                        </Form.Item>
                    </div>
                </Form>}
            </div>
        </>
    );
}