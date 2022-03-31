import React, { useState,useEffect,useRef, useCallback } from 'react';
import { useSelector } from "react-redux";
import FormData from 'form-data';
import axios from 'axios';
import {mutate} from "swr"
import localForage  from 'localforage'
import {CirclePicker} from 'react-color';
import { useDispatch } from "react-redux";
import ImageUpload from '../../modals/components/uploadImage'
import {withAuth} from 'common/isAuthenticated'

import { Modal, Button,Form,
  Input,
  Switch,
  Popover,
  Progress,
} from "antd";

import { CATEGORIES, COLLECTIONS, SUB_CATEGORIES, SUB_CATEGORIES_CHILD } from 'common/apiEndpoints';
import { EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;

  

  type Obj = {
    _id:string,
    name:string
  }


  interface Img {
      filePath?:string
      thumbnailUrl?:string
  }
  export type menuType ={
    _id:string,
    key?:string,
    name:string,
    title:string,
    description:string,
    slug:string,
    status:boolean,
    backgroundColor:string,
    image:File & Img,
    category?:[Obj],
    subCategory?:[Obj],
    childrenSubCategory?:[Obj]
  }

  type Props ={
    id?:string,
    item?:menuType,
    type:string,
    mode:'add'|'edit',
    runMutate?:()=>void
  } 


  const axiosInstance = axios.create({
    validateStatus: function (status)
    {
        return true
    }
  });


const MenuType:React.FC<Props> =({id,item,type,mode,runMutate}) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isFieldSet, setField] = useState(false)
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [progressBar, setProgressBar] = useState(0)


  const {currentUser} = useSelector((state) => state.userReducer);
  const {userId} = currentUser
  const RefBackgroundBotton = useRef(null)
  const [form] = Form.useForm();
  
  const dispatch = useDispatch()

  //========================================================================
  
  const getUrl = ()=>{
    
    if(type==='category'){
      return CATEGORIES
    }else if(type==='sub-category'){
      return SUB_CATEGORIES
    }else if(type==='collection'){
      return COLLECTIONS
    }else{
      return SUB_CATEGORIES_CHILD
    }
  }


  
  const showModal = async () => {
      await withAuth(()=>setIsModalVisible(true),dispatch)
  };

  


  const  refreshData = () => {
        runMutate()
  }

  

  const getImage =(img:File)=>{
      form.setFieldsValue({['image']:img})
  }

  



  const handleOk = async () => {
    await withAuth(()=>{
          form
          .validateFields()
          .then((values) => {
            mode==='add'?onCreate(values):onUpdate(values);
          })
          .catch((info) => {
            console.log('Form errors', info);
          })
        },dispatch)
  };



  const handleCancel = () => {
    localForage.removeItem('new-img')
    setIsModalVisible(false);
    setMessage('');
    setConfirmLoading(false); 
    setField(false);
    setTimeout(() => {
      form.resetFields();
    }, 500);
  };

  const onCreate = (values:menuType) => { 
      const Color = '#cf00cc'
      setMessage('')
      setConfirmLoading(true);
      const url = getUrl()
      let formData = new FormData();
        formData.append('name',values.name);
        formData.append('slug',values.slug);
        formData.append('title',values.title);
        formData.append('description',values.description);
        formData.append('currentUserId',userId);
      

      if(type==='collection'){
        formData.append('collectionImage',values.image);
      }

      if(type==='category'){
        formData.append('backgroundColor',values.backgroundColor?values.backgroundColor:Color)
        formData.append('categoryImage',values.image);
        formData.append('collection',id);
      }

      if(type==='sub-category'){
        formData.append('subCategoryImage',values.image);
        formData.append('backgroundColor',values.backgroundColor?values.backgroundColor:Color)
        formData.append('category',id);
      }
      if(type==='sub-category-child'){
        formData.append('subCategoryChildImage',values.image);
        formData.append('backgroundColor',values.backgroundColor?values.backgroundColor:Color)
        formData.append('subCategory',id);
      }
      

      
      
      const axiosInstance = axios.create({
        validateStatus: function (status)
        {
            return true
        }
      });
         axiosInstance.post(
          `${url}/new`,
           formData,
          {
            headers: { 'Content-type': 'multipart/form-data' },
            onUploadProgress:(event) => {
              let progress = Math.round((event.loaded / event.total)*100);
              setProgressBar(progress)  
            }
          }).then(res=>{
            if (res.status===201) {
                
                  setIsModalVisible(false);
                  setConfirmLoading(false);
                  setProgressBar(0)
                  localForage.removeItem('new-img')
                  form.resetFields();
                  refreshData();
            }else{
              // Handle errors messages
              setProgressBar(0)
              setMessage(res.data.message)
              setConfirmLoading(false);
            }
        }).catch(e=>{
            console.log('Error:',e)
        })
  };

  const onUpdate =(values:menuType)=>{

      const Color = '#cf00cc'
      const url = getUrl()
      setMessage('')
      setConfirmLoading(true);
      let formData = new FormData();
      formData.append('name',values.name);
      formData.append('slug',values.slug);
      formData.append('title',values.title);
      formData.append('description',values.description);
      formData.append('currentUserId',userId);
      formData.append('status',values.status);
      
    if(type==='collection'){
      formData.append('collectionImage',values.image);
    }

    if(type==='category'){
      formData.append('categoryImage',values.image);
      formData.append('backgroundColor',values.backgroundColor?values.backgroundColor:Color)
      formData.append('collection',id);
    }
      
    if(type==='sub-category'){
      formData.append('subCategoryImage',values.image);
      formData.append('backgroundColor',values.backgroundColor?values.backgroundColor:Color)
      formData.append('category',id);
    }
    if(type==='sub-category-child'){
      formData.append('subCategoryChildImage',values.image);
      formData.append('backgroundColor',values.backgroundColor?values.backgroundColor:Color)
      formData.append('subCategory',id);
    }

    

    type axiosRes = {
      status?:number,
      errors?:[object]
      data:[object]|null,
      message?:string,
    }

      axiosInstance.patch(
        `${url}/${item._id}`,
        formData,
        {
          headers: { 'Content-type': 'multipart/form-data' },
          onUploadProgress:(event) => {
            let progress = Math.round((event.loaded / event.total)*100);
            setProgressBar(progress)  
          } 
        }).then((res)=>{
          
          if (res.status===200) {
                refreshData();
                mutate(url)
                setIsModalVisible(false);
                setConfirmLoading(false);
                setField(false);
                form.resetFields();
                setProgressBar(0)
                setTimeout(() => {
                  localForage.removeItem('new-img')
                }, 500);
              
              
          }else{
            // handel message errors during updating data 
            setProgressBar(0)
            setMessage(res.data.message)
            setConfirmLoading(false);   
          }

      }).catch(e=>{
          console.log('Error:',e)
      })
  }
  

  const colorOnChange =(color,event)=>{
    form.setFieldsValue({['backgroundColor']:color.hex})
    RefBackgroundBotton.current.style.background=color.hex
  }

 
 
  const ComponentType = useCallback(({type}) =>{
    switch (type) {
      case 'collection':
        return <CollectionForm />
      case 'category':
        return <CategoryForm/>
      case 'sub-category':
        return <SubCategoryForm/>
      case 'sub-category-child':
        return <SubCategoryChildForm/>
      default:
        <div>form does not exist</div>;
    }
  },[isModalVisible])
 
  const CollectionForm:React.FC = React.memo(()=>{
    const refForm = useRef(null)
  
    useEffect(()=>{
      if(item){
        
        const {name,slug,description,status,image,title} = item;
        if(refForm.current && !isFieldSet){
          form.setFieldsValue({status,slug,name,image,title,description})
          setField(true)
        }
      }
    },[refForm.current])
    
    
  
    return(
      <Form
      className={'addCategory-form'}
      {...formItemLayout}
      layout="horizontal"
      size='middle'
      form={form}
      ref={refForm}
      name="registerMenuType"
      >
            <div className='categoryImage'>
                <Form.Item 
                  name="image" 
                  >
                  <ImageUpload uploadedImage={getImage}  image={item?item.image.thumbnailUrl:''} />
      
                </Form.Item>
            </div>
            <div className='categoryFormInputs'>
              <Form.Item
                  name="name"
                  label={'Name'}
                  rules={[{ required: true, message: 'The Name is required'}]}
              >
                  <Input/>
              </Form.Item>
              <Form.Item
                  name="title"
                  label={'Title'}
                  rules={[{ required: true, message: 'The Title is required'}]}
              >
                  <Input/>
              </Form.Item>

              <Form.Item
                  name="slug"
                  label="Slug"
                  rules={[
                  {
                      required: true,
                      message: 'The Slug is required',
                  },
                  ]}
              >
                  <Input />
              </Form.Item>
              <Form.Item
                  name="description"
                  label={'Description'}
                  rules={[{ required: true, message: 'The Description is required'}]}
              >
                  <TextArea rows={3}/>
              </Form.Item>
              {mode==='edit'&&(
                <Form.Item
                name="status"
                label={'Status'}
                valuePropName="checked"
                initialValue={true}
                >
                  <Switch
                    checkedChildren={'active'}
                    unCheckedChildren={'inactive'}
                  />
                </Form.Item>
              )}
          </div>
    </Form>
  )
  })


  const CategoryForm:React.FC= ()=>{

    const refForm = useRef(null)
    

    useEffect(()=>{

      if(refForm.current){
        form.setFieldsValue({['related']:false})

      }

      if(item){
        const {name,title,slug,description,status,image,backgroundColor} = item;
        if(refForm.current && !isFieldSet){
          form.setFieldsValue({status,slug,name,title,image,description,backgroundColor})
          RefBackgroundBotton.current.style.background = backgroundColor
          setField(true)
        }
      }
    },[refForm.current])

    


    return(
      <Form
      className={'addCategory-form'}
      {...formItemLayout}
      layout="horizontal"
      size='middle'
      form={form}
      ref={refForm}
      name="registerMenuType"
      >
            <div className='categoryImage'>
                <Form.Item 
                  name="image" 
                  >
                  <ImageUpload uploadedImage={getImage}  image={item?item.image.thumbnailUrl:''} />
      
                </Form.Item>
            </div>
            <div className='categoryFormInputs'>
                <Form.Item
                  name="name"
                  label={'Name'}
                  rules={[{ required: true, message: 'The Name is required'}]}
              >
                  <Input/>
              </Form.Item>
              <Form.Item
                  name="title"
                  label={'Title'}
                  rules={[{ required: true, message: 'The Title is required'}]}
              >
                  <Input/>
              </Form.Item>
              <Form.Item
                  name="slug"
                  label="Slug"
                  rules={[
                  {
                      required: true,
                      message: 'the slug is required',
                  },
                  ]}
              >
                  <Input />
              </Form.Item>
              <Form.Item
                  name="description"
                  label={'Description'}
                  rules={[{ required: true, message: 'The Description is required'}]}
              >
                  <TextArea rows={3}/>
              </Form.Item>
              {mode==='edit'&&(
                <Form.Item
                name="status"
                label={'Status'}
                valuePropName="checked"
                initialValue={true}
                >
                  <Switch
                    checkedChildren={'active'}
                    unCheckedChildren={'inactive'}
                  />
                </Form.Item>
              )}
              <Form.Item 
                  name="backgroundColor" 
                  label="Background" 
                  >
                  <Popover content={<CirclePicker onChange={colorOnChange}/>} title="Title" trigger="hover">
                      <Button ref={RefBackgroundBotton} shape="round" size='large' style={{background:form.getFieldValue('backgroundColor'),width: '100%'}}>Change Color</Button>
                  </Popover>
              </Form.Item>
          </div>
    </Form>
  )
  }



  const SubCategoryForm:React.FC = ()=>{
    const refForm = useRef(null)
        

    useEffect(()=>{
     if(item){
      const {name,title,slug,description,status,image,backgroundColor} = item;
      if(refForm.current && !isFieldSet){
        form.setFieldsValue({status,slug,title,name,image,description,backgroundColor})
        RefBackgroundBotton.current.style.background = backgroundColor
        setField(true)
      }
     }
    },[refForm.current])

  return(
      <Form
            className={'addCategory-form'}
            {...formItemLayout}
            layout="horizontal"
            size='middle'
            form={form}
            ref={refForm}
            name="register-sub-category"
            
            >
                    <div className='categoryImage'>
                        <Form.Item 
                          name="image" 
                          >
                    
                          <ImageUpload uploadedImage={getImage} mode={mode} image={item?item.image.thumbnailUrl:''} />
                        </Form.Item>
                    </div>
                    <div className='categoryFormInputs'>
                        <Form.Item
                          name="name"
                          label={'Name'}
                          rules={[{ required: true, message: 'The Name is required'}]}
                      >
                          <Input/>
                      </Form.Item>
                      <Form.Item
                          name="title"
                          label={'Title'}
                          rules={[{ required: true, message: 'The Title is required'}]}
                      >
                          <Input/>
                      </Form.Item>
                      <Form.Item
                          name="slug"
                          label="Slug"
                          rules={[
                          {
                              required: true,
                              message: 'The Slug is required',
                          },
                          ]}
                      >
                          <Input />
                      </Form.Item>
                      <Form.Item
                          name="description"
                          label={'Description'}
                          rules={[{ required: true, message: 'The Description is required'}]}
                      >
                          <TextArea rows={3}/>
                      </Form.Item>
                      {mode==='edit'&&(
                        <Form.Item
                        name="status"
                        label={'Status'}
                        valuePropName="checked"
                        initialValue={true}
                        >
                          <Switch
                            checkedChildren={'active'}
                            unCheckedChildren={'inactive'}
                          />
                        </Form.Item>
                      )}
                      <Form.Item 
                          name="backgroundColor" 
                          label="Background" 
                          >
                          <Popover content={<CirclePicker onChange={colorOnChange}/>} title="Title" trigger="hover">
                              <Button ref={RefBackgroundBotton} shape="round" size='large' style={{background:form.getFieldValue('backgroundColor'),width: '100%'}}>Change Color</Button>
                          </Popover>
                      </Form.Item>
                  </div>
      </Form>
  )
  }  
  

  
  const SubCategoryChildForm:React.FC = ()=>{
    const refForm = useRef(null)
    

    useEffect(()=>{
      if(item){
        const {name,title,slug,description,status,image,backgroundColor} = item;
        if(refForm.current && !isFieldSet){
          form.setFieldsValue({status,title,slug,name,image,description,backgroundColor})
          RefBackgroundBotton.current.style.background = backgroundColor
          setField(true)
        }
      }
    },[refForm.current])

    
    return(
      <Form
            className={'addCategory-form'}
            {...formItemLayout}
            layout="horizontal"
            size='middle'
            form={form}
            name="register-sun-category-child"
            ref={refForm}
            >
                    <div className='categoryImage'>
                        <Form.Item 
                          name="image" 
                          >
                    
                          <ImageUpload uploadedImage={getImage} image={item?item.image.thumbnailUrl:''} />
              
                        </Form.Item>
                    </div>
                    <div className='categoryFormInputs'>
                        <Form.Item
                          name="name"
                          label={'Name'}
                          rules={[{ required: true, message: 'The Name is required'}]}
                      >
                          <Input/>
                      </Form.Item>
                      <Form.Item
                          name="title"
                          label={'Title'}
                          rules={[{ required: true, message: 'The Title is required'}]}
                      >
                          <Input/>
                      </Form.Item>
                      <Form.Item
                          name="slug"
                          label="Slug"
                          rules={[
                          {
                              required: true,
                              message: 'the slug is required',
                          },
                          ]}
                      >
                          <Input />
                      </Form.Item>
                      <Form.Item
                          name="description"
                          label={'Description'}
                          rules={[{ required: true, message: 'The Description is required'}]}
                      >
                          <TextArea rows={3}/>
                      </Form.Item>
                      {mode==='edit'&&(
                        <Form.Item
                        name="status"
                        label={'Status'}
                        valuePropName="checked"
                        initialValue={true}
                        >
                          <Switch
                            checkedChildren={'active'}
                            unCheckedChildren={'inactive'}
                          />
                        </Form.Item>
                      )}
                      <Form.Item 
                          name="backgroundColor" 
                          label="Background" 
                          >
                          <Popover content={<CirclePicker onChange={colorOnChange}/>} title="Title" trigger="hover">
                              <Button ref={RefBackgroundBotton} shape="round" size='large' style={{background:form.getFieldValue('backgroundColor'),width: '100%'}}>Change Color</Button>
                          </Popover>
                      </Form.Item>
                  </div>
      </Form>
  )
  }


  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 14,
      },
    },
  };


  const ModalFooter =(
    <>
      <div className="gl-modal-action">
        <Button onClick={handleCancel}>cancel</Button>
        <Button type='primary' loading={confirmLoading} onClick={handleOk}>Submit</Button>
      </div>
      <Progress percent={progressBar} showInfo={false} />
    </>

)

  return (
    <>
      {mode==='add'?<Button type="primary" onClick={showModal}>Add a {type==='sub-category-chlid'?'sub-category chlid':type}</Button>:<Button icon={<EditOutlined/>} onClick={showModal} key='24639'/>}
      <Modal className="menu-center-modal"  visible={isModalVisible} footer={ModalFooter} width={820} closable={false}>
        <div className='category-modal-container'>
          {message?<div className='message-error-modal'>{message}</div>:null}
          <div className='modal-content'>
              <ComponentType type={type} />
          </div>
        </div>
      </Modal>
     
    </>
  );
}
export default React.memo(MenuType)
