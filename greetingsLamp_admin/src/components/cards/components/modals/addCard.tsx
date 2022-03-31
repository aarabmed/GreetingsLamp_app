import React, { useState,useEffect,useRef } from 'react';
import { useSelector ,useDispatch} from "react-redux";
import FormData from 'form-data';
import axios from 'axios';
import useSWR,{mutate} from "swr"
import ImageUpload from 'components/modals/components/uploadImage'
import {withAuth} from 'common/isAuthenticated'
import localForage  from 'localforage'

import { Modal, Button,Form,
  Input,
  Select,
  Divider,
  Progress,
} from "antd";

import { CARDS, CATEGORIES, SUB_CATEGORIES, SUB_CATEGORIES_CHILD, TAGS } from 'common/apiEndpoints';
import { PlusOutlined } from '@ant-design/icons';
import NetworkSpeed from 'network-speed'



const { TextArea } = Input;

  type Obj = {
    _id:string,
    name:string
  }

  type cardType ={
    key?:string,
    title:string,
    description:string,
    slug:string,
    status:boolean,
    orientation:string
    image:File|string,
    tags?:Obj[],
    category?:string[],
    subCategory?:string[],
    subCategoryChildren?:string[]
  }

 
  type Props = {
    runMutate?:()=>Promise<any>,
    type:String,
    collection:String
  } 





const axiosHeader = ()=>{
  const config = {
      headers: { 'Content-type': 'application/json' },
  };
  return config
}



const CardType:React.FC<Props> =({runMutate,type,collection}) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [imgFile, setimgFile] = useState({});

  const {currentUser} = useSelector((state) => state.userReducer);
  const {userId} = currentUser

  
  const [tag, setTag] = useState('')

  const [progressBar, setProgressBar] = useState(0)

  
  const [newTags, setNewTags] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [subCategoryChildrenOptions, setSubCategoryChildrenOptions] = useState([])
  const [relatedCategories, setRelatedCategories] = useState([])
  const [relatedsubCategories, setRelatedsubCategories] = useState([])
  const [relatedsubCategoryChildren, setRelatedsubCategoryChildren] = useState([])

  const [tagsOptions, setTagsOptions] = useState([]);

  //==================
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [subCategoryLoading, setSubCategoryLoading] = useState(true)
  const [subChildrenLoading, setSubChildrenLoading] = useState(true)
  const [tagsLoading, setTagsLoading] = useState(false);


  const dispatch = useDispatch()
  const fetcher = url => axios.get(url).then(res => res.data)

  const {data:categoryData,error:categoryError} =  useSWR(CATEGORIES, fetcher)
  const {data:tagsData,error:tagsError} =  useSWR(TAGS, fetcher)

  const refForm = useRef(null)
  const [form] = Form.useForm();

  
  
  useEffect(()=>{

    if(categoryData) {
        const options = categoryData.categories.map(e=>({label:e.name,value:e._id}))
        setCategoryOptions(options)
        if(categoryLoading){
          setCategoryLoading(false)
        }
    }
 
    if(tagsData) {
        const options = tagsData.tags.map(e=>({label:e.name,value:e._id}))
        setTagsOptions(options)
        if(tagsLoading){
          setTagsLoading(false)
        }
    }

  },[categoryData,tagsData])
  

  const axiosInstance = axios.create({
    validateStatus: function (status)
    {
        return true
    }
  });

  //========================================================================


  

  const categoryOnSelect = async () =>{
    const categoryIds = form.getFieldValue('category')
    let subCategoriesOptions = []
    let counter = 0
    const {categories} = await fetcher(CATEGORIES)
    const categoriesOptions = categories.filter(cat=>categoryIds.includes(cat._id));

    categoriesOptions.forEach(cat => {
      let newSub = [];
       cat.subCategory.forEach(el=>{
         newSub.push(el)
       })
       const groupCat = {
         label:cat.name,
         options:newSub.map(sub=>({label:sub.name,value:sub._id}))
       }
       subCategoriesOptions= [...subCategoriesOptions,groupCat]
       counter++
      if(categoriesOptions.length===counter){
        setSubCategoryOptions(subCategoriesOptions);
      }
    })
      setRelatedCategories(categoriesOptions.map(cat=>cat.customId))
      setSubCategoryLoading(false)  
  }

  const subCategoryOnSelect = async () =>{
    const subCategoryIds = form.getFieldValue('subCategory')
    let subCategoryChildrenOptions = []
    let counter = 0
    const {subCategories} = await fetcher(SUB_CATEGORIES)
    const subCategoriesOptions = subCategories.filter(sub=>subCategoryIds.includes(sub._id));

    subCategoriesOptions.forEach(sub => {
      let newSub = [];
        sub.childrenSubCategory.forEach(el=>{
          newSub.push(el)
        })

        const groupSub = {
          label:sub.name,
          options:newSub.map(child=>({label:child.name,value:child._id}))
        }

        subCategoryChildrenOptions= [...subCategoryChildrenOptions,groupSub]
        counter++
      if(subCategoriesOptions.length===counter){
        setSubCategoryChildrenOptions(subCategoryChildrenOptions);
      }
    })
    
    setRelatedsubCategories(subCategoriesOptions.map(sub=>sub.customId))
    setSubChildrenLoading(false)  
  }


  const subCategoryChildrenOnSelect = async () =>{
    const subCategoryChildrenIds = form.getFieldValue('subCategoryChildren')

    const {subCategoryChildren} = await fetcher(SUB_CATEGORIES_CHILD)
    const subCategoriesChildrenOptions = subCategoryChildren.filter(child=>subCategoryChildrenIds.includes(child._id));
    
    setRelatedsubCategoryChildren(subCategoriesChildrenOptions.map(child=>child.customId))
  }


  

  const showModal = async () => {
      await withAuth(()=>setIsModalVisible(true),dispatch)
  };

  


  const  refreshData =()=> {
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
         onCreate(values);
      })
      .catch((info) => {
        console.log('Form errors', info);
    });
    },dispatch)
  };



  const handleCancel = () => {
    localForage.removeItem('new-img')
    setIsModalVisible(false);
    setConfirmLoading(false);
    setimgFile({});
    setSubCategoryOptions([]);
    setSubCategoryChildrenOptions([]);
    setNewTags([])
    setProgressBar(0)
    form.resetFields();
  };

  const onCreate = async (values:cardType,) => { 
      setConfirmLoading(true);
      let tags = []
      let formData = new FormData();
        formData.append('title',values.title);
        formData.append('slug',values.slug);
        formData.append('description',values.description);
        formData.append('currentUserId',userId);
        formData.append('cardImage',values.image);
        formData.append('type',type);
        formData.append('orientation',values.orientation);
        formData.append('collectionName',collection);
        formData.append('category',values.category?JSON.stringify(values.category):'');
        formData.append('subCategory',values.subCategory?JSON.stringify(values.subCategory):'');
        formData.append('subCategoryChildren',values.subCategoryChildren?JSON.stringify(values.subCategoryChildren):'');
        formData.append('relatedCategories',JSON.stringify([...relatedCategories,...relatedsubCategories,...relatedsubCategoryChildren]));


      const newTagsChecked = values.tags?values.tags.filter(tag=>newTags.some(e=>tag===e.value)):[]
      const existedTagsChecked = values.tags?values.tags.filter(tag=>!newTags.some(e=>tag===e.value)):[]

      tags=existedTagsChecked
      
      if(newTagsChecked.length){
        const body = {
          tags:newTagsChecked,
          currentUserId:userId
        }
        const {data,status} = await axiosInstance.post(`${TAGS}/multiple/new`,body,axiosHeader())
        const tagsIds = status===201?data.tags.map(e=>e._id):null  
        tagsIds ? tags = [...tags,...tagsIds] :null
      }
      
      formData.append('tags',tags?JSON.stringify(tags):'');
      axiosInstance.post(
      `${CARDS}/new`,
      formData,
      {
          headers: { 'Content-type': 'multipart/form-data' },
          onUploadProgress:(event) => {
            let progress = Math.round((event.loaded / event.total)*100);
            setProgressBar(progress)  
          } 
      }).then(res=>{
        if (res.status===201) {
                setProgressBar(100)
                setConfirmLoading(false);
                refreshData();
                setTimeout(() => {
                  handleCancel()
                }, 500);
            }
        }).catch(e=>{
            console.log('Error:',e)
      })
  };

    

  const onTagChange =(e)=>{
    const newtag = e.target.value
    setTag(newtag)
    if(newtag.length>2){
    }
  }

  const addNewTag = () => {
    if(tag.trim().length>2){
      const newTag = {label:tag,value:tag}
      setNewTags([...newTags,newTag])
      setTag('')
    }
  };  


  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 24,
      },
    },
  };

  const orientationOptions = [
    {label:'Landscape',value:'landscape'},
    {label:'Portrait',value:'portrait'},
    {label:'Square',value:'square'},
  ]


  const ModalFooter =(
        <div className='gl-modal-add'>
          <div className="gl-modal-action">
            <Button onClick={handleCancel}>cancel</Button>
            <Button type='primary' loading={confirmLoading} onClick={handleOk}>Submit</Button>
          </div>
          <Progress percent={progressBar} showInfo={false} />
        </div>
  
  )

  return (
    <>
      <Button type="primary" onClick={showModal}>Add a card</Button>
      <Modal confirmLoading={confirmLoading} visible={isModalVisible} footer={ModalFooter} onOk={handleOk} onCancel={handleCancel} width={990}>
        <div className='category-modal-container'>
          <div className='modal-content'>
                <Form
                    className={'addCardForm'}
                    {...formItemLayout}
                    layout="horizontal"
                    size='middle'
                    form={form}
                    ref={refForm}
                    name="register-card"
                    >
                    <div className='cardImage'>
                        <Form.Item 
                          name="image" 
                          >
                    
                          <ImageUpload uploadedImage={getImage} />
              
                        </Form.Item>
                    </div>
                    <div className='cardFormInputs'>
                      <Form.Item
                        name="title"
                        rules={[{ required: true, message: 'a title is required'}]}
                      >
                          <Input placeholder='Title'/>
                      </Form.Item>
                      <Form.Item
                          name="slug"
                          rules={[
                          {
                              required: true,
                              message: 'the slug is required',
                          },
                          ]}
                      >
                          <Input placeholder='Slug' />
                      </Form.Item>
                      <Form.Item
                          name='description'
                          rules={[{ required: true, message: 'the description is required'}]}
                      >
                          <TextArea rows={2} placeholder='A Short description about the card' />
                      </Form.Item>
                      <Form.Item 
                          name="orientation"  
                          rules={[{type:'string',required:true,message: 'the card size is required'}]}
                          
                          >
                          <Select placeholder='Card orientation' options={orientationOptions}/>
                      </Form.Item>
                      <Form.Item 
                          name="category" 
                          rules={[{type:'array'}]}
                          >
                          <Select placeholder='Categories' mode='multiple' options={categoryOptions} loading={categoryLoading} onSelect={categoryOnSelect} onDeselect={categoryOnSelect}/>
                      </Form.Item>
                      <Form.Item 
                          name="subCategory" 
                          rules={[{type:'array'}]}
                          >
                          <Select  placeholder='Sub-categories' mode='multiple' options={subCategoryOptions} loading={subCategoryLoading} onSelect={subCategoryOnSelect} onDeselect={subCategoryOnSelect} />
                      </Form.Item>
                      <Form.Item 
                          name="subCategoryChildren" 
                          rules={[{type:'array'}]}
                          >
                          <Select placeholder='Sub-category childen' mode='multiple' options={subCategoryChildrenOptions} loading={subChildrenLoading}  onSelect={subCategoryChildrenOnSelect} onDeselect={subCategoryChildrenOnSelect}/>
                      </Form.Item>
                      <Form.Item 
                          name="tags" 
                          rules={[{type:'array'}]}
                          
                          >
                          <Select placeholder='Tags' mode='multiple' options={[...tagsOptions,...newTags]} loading={tagsLoading} dropdownRender={
                            menu=>(
                              <>
                                {menu}
                                <Divider style={{margin:'4px 0'}}/>
                                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                  <Input style={{ flex: 'auto' }} value={tag} onChange={onTagChange} />
                                  <a
                                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                    onClick={addNewTag}
                                  >
                                    <PlusOutlined /> Add a tag
                                  </a>
                                </div>
                              </>
                            )
                          }/>
                      </Form.Item>
                  </div>
                </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default React.memo(CardType)
