
import { Alert, Button, Form, Input, Modal } from 'antd';
import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import fetch from "node-fetch";
import checkAuth from 'common/auth'
import Router,{ useRouter } from "next/router";
import Spinner from "components/spin/spiner"

import {doesConnectionExist} from 'common/check-internet'
import {setRoute} from "redux/actions/globalActions";
import {setUser} from "redux/actions/userActions";

import LoginFrom from 'components/login';
import { SIGNUP } from 'common/apiEndpoints';
import axios from 'axios';


const { UserName, Password, Submit } = LoginFrom;

export interface accountType {
  userName: string;
  email:string;
  password: string;
}

export interface StateType {
  status?:string;
  type?:string;
  currentAuthority?:'user'|'guest';
} 



interface Response {
  data?:User;
  status?:number;
  message?:string;
}

interface Props {
  isAuth?: boolean;
}

const SubmitMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);


const axiosInstance = axios.create({
    validateStatus: function (status)
    {
        return true
    }
});

const SignUp: React.FC<Props> = ({isAuth}) => {  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true)

  const [errorMessage, setErrorMessage] = useState(null);
  const {route} = useSelector((state) => state.globalReducer);
  const router = useRouter()
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(()=>{
    
    (function auth(){ 
     
      if(isAuth) router.replace(`${route}`);
      if(!isAuth) setLoading(false); 
      doesConnectionExist().then(res=>{
      })
    })()
    
  },[])



  const handleCreate = async (values: accountType) => {
    setSubmitting(true);
    
    doesConnectionExist().then(res=>{
      if(!res){
          setSubmitting(false)
          setErrorMessage('Please make sure you are connected to the internet, then try again')
      }
    })
    

    axiosInstance(
        SIGNUP,{
            method: 'POST',
            data: values,
            headers: { 'Content-Type': 'application/json' }
        }).then(res=>{
                setSubmitting(false);        
                if(res.status===201){
                    Modal.success({
                        content: <>
                            <h4>{res.data.message}</h4>
                        </>,
                        onOk:()=>{
                            return Router.replace('/admin/login') 
                        },
                        onCancel:()=>{
                            return Router.replace('/admin/login') 
                        }
                    });

                  }else{
                    Modal.error({
                        content: res.data.message,
                    });
                }
        }).catch(e=>{
            setSubmitting(false);
            setErrorMessage('Error! Try again')
        })
  } 

  const validatePassword = (rule, value) => {
    const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])')
    if(value.length<9 && value.length>0){
        return Promise.reject(new Error("Password length must be at least 9 characters"));
    }
    if (value.length>1&&!regex.test(value)) {
        return Promise.reject(new Error("Password must be a mix of upercase and lowercase and number "));
    } else {
        return Promise.resolve();   
    }
  };

  if(loading) return <div className='indexSpinner'><Spinner/></div>
  return (
    <div className='signup-container'>
    <div className='signup-wrapper'>
        <div className='signup-header'>
            <img src='/assets/images/greetingslamp-logo.png'/>
            <h4>Creating a Super User:</h4>
            <p>please store your <b>userName</b> and <b>password</b> in save place for future use.</p>
            <p><b>Note:</b> once you a super account is has been created, this page won't be available again.</p>
        </div>
    
        <div className="main">
            {errorMessage&& (
                <SubmitMessage content={errorMessage} />
            )}
            <Form
                className={'create-user-form'}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                layout="horizontal"
                size='middle'
                form={form}
                onFinish={handleCreate}
                >
                    <Form.Item
                        name="userName"
                        label="Username"
                        rules={[
                        {
                            required: true,
                            message: 'Please, type in your username',
                        },
                        ]}
                        
                    >
                        <Input placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                        {   
                            type:'email',
                            required: true,
                            message: 'Please, type a valide email',
                        },
                        ]}
                        
                    >
                        <Input placeholder="email"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                        {
                           required: true,
                           message:'a Password is required'
                           
                        },
                        {validator:validatePassword}
                        ]}
                    >
                        <Input.Password placeholder="Password"/>
                    </Form.Item>
                    <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you have entered do not match!'));
                                },
                            }),
                            ]}>
                        <Input.Password placeholder="confirm password"/>
                    </Form.Item>
            </Form>    
            <Submit loading={submitting} onClick={form.submit} style={{width:'344px'}}>Create</Submit>
        </div>
      </div>
    </div>
    
  );
}; 


export default SignUp