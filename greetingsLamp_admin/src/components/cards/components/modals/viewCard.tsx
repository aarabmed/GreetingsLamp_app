import React, { useState,useEffect,useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { useSelector ,useDispatch} from "react-redux";
import FormData from 'form-data';
import axios from 'axios';
import useSWR,{mutate} from "swr"
import ImageUpload from 'components/modals/components/uploadImage'
import {withAuth} from 'common/isAuthenticated'
import localForage  from 'localforage'
import { IKImage, IKContext } from 'imagekitio-react'


import { Modal, Button,Form,
  Input,
  Select,
  Switch,
  Spin,
  Divider,
  PageHeader,
  Tag,
  Progress
} from "antd";

import { CARDS, CATEGORIES, SUB_CATEGORIES, SUB_CATEGORIES_CHILD, TAGS } from 'common/apiEndpoints';
import { PlusOutlined } from '@ant-design/icons';
import { User } from 'pages/admin/login';
import DeleteCard, { deleteProps } from 'components/modals/removeItem'

const { TextArea } = Input;

  type Obj = {
    _id:string,
    name:string
  }

  type Img = {
    filePath?:string,
    thumbnailUrl?:string
  }

  
  type categoryType ={
    _id:string,
    name:string
  }

  export type cardType ={
    _id?:string,
    title:string,
    description:string,
    slug:string,
    status:boolean,
    orientation:string,
    createdBy:User,
    imageFile?:File,
    image:Img,
    tags?:Obj[],
    category?:categoryType[],
    subCategory?:categoryType[],
    subCategoryChildren?:categoryType[]
    relatedCategories?:string[]
  }


  
 

  type Props = {
    runMutate?:()=>Promise<any>,
    item?:cardType,
    refresh:()=>void
  } 

  export type ModalProps = {
    openModal: () => void,
  }






const fetcher = (url,params?) => axios.get(url).then(res => res.data)

const ViewCard:React.ForwardRefRenderFunction<ModalProps,Props> =({item,runMutate,refresh},ref) => {
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [initialFormData, setInitialFormData] = useState(false);
  const [isFooter, setIsFooter] = useState(false);
  const {currentUser} = useSelector((state) => state.userReducer);
  const {userId} = currentUser
  
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedCard, setSelectedCard] = useState({status:false,slug:'',cardOrientation:'',title:'',image:{},description:'',tags:[],category:[],subCategory:[],subCategoryChildren:[],createdBy:{}});
  const [selectedItem, setSelectedItem] = useState(item);
 



  const dispatch = useDispatch()


  const orientationOptions = [
    {label:'Landscape',value:'landscape'},
    {label:'Portrait',value:'portrait'},
    {label:'Square',value:'square'},
  ]

 

  const refForm = useRef(null)
  const refView = useRef(null)
  const [form] = Form.useForm();


  


  useEffect(()=>{
    
    const {title,slug,description,status,image,orientation,category,subCategory,tags,subCategoryChildren,createdBy} = item;        

    if(isModalVisible||initialFormData){
            setSelectedItem(item)
            const result = {
              status:status,
              slug:slug,
              cardOrientation:orientation,
              title:title,
              image:image,
              description:description,
              category:category.map(cat=>cat._id),
              tags:tags.map(el=>el._id),
              subCategory:subCategory.map(sub=>sub._id),
              subCategoryChildren:subCategoryChildren.map(child=>child._id),
              createdBy:createdBy
            }

            setSelectedCard(result)
            setInitialFormData(false)
      }
  },[isModalVisible,initialFormData])

  

  const axiosInstance = axios.create({
    validateStatus: function (status)
    {
        return true
    }
  });

  //========================================================================
  

  


  
  const showModal = async () => {
      await withAuth(()=>setIsModalVisible(true),dispatch)
  };

  useImperativeHandle(ref, () => ({
     openModal(){
       showModal()
     }
  }));


  const refreshCards = () =>{
    refresh()
  }



  const handleCancel = () => {
    localForage.removeItem('new-img')
    setIsModalVisible(false);
    setIsEditMode(false)
    setIsFooter(false)
  };

  
    

   

  const onEditCard=()=>{
      setIsFooter(true)
      setIsEditMode(true)
  }

  const onDismiss=()=>{
      localForage.removeItem('new-img')
      setIsFooter(false)
      setIsEditMode(false)
  }


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



  const EditForm:React.FC=()=>{
  
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [progressBar, setProgressBar] = useState(0)

    const [tagError, setTagError] = useState(false)
    const [tag, setTag] = useState('')
    const [newTags, setNewTags] = useState([])
    const [subCategoryOptions, setSubCategoryOptions] = useState([])
    const [subCategoryChildrenOptions, setSubCategoryChildrenOptions] = useState([])
    const [categoryOptions, setCategoryOptions] = useState([])
  
  

    const [tagsOptions, setTagsOptions] = useState([]);
    const [relatedCategories, setRelatedCategories] = useState([])
    const [relatedsubCategories, setRelatedsubCategories] = useState([])
    const [relatedsubCategoryChildren, setRelatedsubCategoryChildren] = useState([])
  
  
    //====== loading states
    const [categoryLoading, setCategoryLoading] = useState(true)
    const [subCategoryLoading, setSubCategoryLoading] = useState(false)
    const [subChildrenLoading, setSubChildrenLoading] = useState(true)
    const [tagsLoading, setTagsLoading] = useState(false)

    const {data:categoryData,error:categoryError} =  useSWR(()=>CATEGORIES, fetcher)

    const {data:subCategoryData,error:subCategoryError} =  useSWR(()=>SUB_CATEGORIES, fetcher)
  
    const {data:tagsData,error:tagsError} =  useSWR(()=>TAGS, fetcher)
  

    useEffect(()=>{
        if(isEditMode){
              if(categoryData){
                const categoryOption = categoryData?.categories.map(e=>({label:e.name,value:e._id}))
                setCategoryOptions(categoryOption)
                setCategoryLoading(false)
              }
          
              if(tagsData) {
                const tagsOption = tagsData?.tags.map(e=>({label:e.name,value:e._id}))
                setTagsOptions(tagsOption)
                setTagsLoading(false)
              }
              if(item.subCategory.length){
                const selectedsubCategoryOption = subCategoryData? subCategoryData.subCategories.filter(sub=>item.subCategory.map(el=>el._id).includes(sub._id)):[]
                const subCategoryOption = selectedsubCategoryOption.length?selectedsubCategoryOption.map(sub=>({label:sub.name,value:sub._id})):selectedsubCategoryOption
                let subCategoryChildren = []
                selectedsubCategoryOption.forEach(element => {
                  if(element.childrenSubCategory.length){
                    subCategoryChildren.push(...element.childrenSubCategory.map(child=>({label:child.name,value:child._id})))
                  }
                });
                setSubCategoryOptions(subCategoryOption)
                setSubCategoryChildrenOptions(subCategoryChildren)
                setSubCategoryLoading(false)
                setSubChildrenLoading(false)
              }
      }
    },[isEditMode])

    const onTagChange =(e)=>{
      const newtag = e.target.value
      setTag(newtag)
      if(tagError){
        setTagError(false)
      }
    }
  
    const addNewTag = () => {
      if(tag.trim().length>2){
        const newTag = {label:tag,value:tag}
        setNewTags([...newTags,newTag])
        setTag('')
      }
      else{
        setTagError(true)
      }
    }; 

    
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

    const handleOk = async () => {
      await withAuth(()=>{
          form
          .validateFields()
          .then((values) => {
              onUpdate(values)        
          })
          .catch((info) => {
            console.log('Form errors', info);
          });
        },dispatch
      )
    };

    const onUpdate = async (values) => { 
      await withAuth(async ()=>{
          
          setConfirmLoading(true);
          
          let tags = []
          let formData = new FormData();
            formData.append('title',values.title);
            formData.append('slug',values.slug);
            formData.append('description',values.description);
            formData.append('currentUserId',userId);
            formData.append('cardImage',values.imageFile);
            formData.append('cardOrientation',values.cardOrientation);
            formData.append('status',values.status);
            formData.append('category',values.category?JSON.stringify(values.category):'');
            formData.append('subCategory',values.subCategory?JSON.stringify(values.subCategory):'');
            formData.append('subCategoryChildren',values.subCategoryChildren?JSON.stringify(values.subCategoryChildren):'');

            const related = [...item.relatedCategories,...relatedCategories,...relatedsubCategories,...relatedsubCategoryChildren]
            
            formData.append('relatedCategories',related.length?JSON.stringify(related):'');
                    
          

          const newTagsChecked = values.tags.filter(tag=>newTags.some(e=>tag===e.value))
          const existedTagsChecked = values.tags.filter(tag=>!newTags.some(e=>tag===e.value))
          tags=existedTagsChecked
          
          if(newTagsChecked.length){
            const body = {
              tags:newTagsChecked,
              currentUserId:userId
            }
            const {data,status} = await axiosInstance.post(`${TAGS}/multiple/new`,body)
            const tagsIds = status===201?data.res.map(e=>e._id):null  
            tagsIds ? tags = [...tags,...tagsIds] :null
          }

          formData.append('tags',tags?JSON.stringify(tags):'');
          const cardId=item._id.split('-')[1]
          axiosInstance.patch(
            `${CARDS}/${cardId}`,
            formData,
            {
              onUploadProgress:(event) => {
                let progress = Math.round((event.loaded / event.total)*100);
                setProgressBar(progress)  
              } 
            }
            ).then(res=>{
              console.log('DATA:',res)
              if (res.status===200) {
                setIsEditMode(false)
                setInitialFormData(true)
                setConfirmLoading(false);
                setIsFooter(false)
                const result = {
                  status:res.data.data.status,
                  slug:res.data.data.slug,
                  orientation:res.data.data.orientation,
                  title:res.data.data.title,
                  image:res.data.data.image,
                  description:res.data.data.description,
                  category:res.data.data.category,
                  tags:res.data.data.tags,
                  subCategory:res.data.data.subCategory,
                  subCategoryChildren:res.data.data.subCategoryChildren,
                  createdBy:res.data.data.createdBy
                }
                setSelectedItem(result)
                setTimeout(() => {
                  runMutate();
                }, 100);
                }else{
                    setConfirmLoading(false);
                }

            }).catch(e=>{
                console.log('Error:',e)
          })
        },dispatch
      )
    }

  const getImage =(img:File)=>{
    form.setFieldsValue({['imageFile']:img})
  } 

  const ModalFooter =()=>
    <div className="gl-modal-edit">
      <div className="gl-modal-action">
        <Button onClick={handleCancel}>cancel</Button>
        <Button type='primary' loading={confirmLoading} onClick={form.submit}>Update</Button>
      </div>
      <Progress percent={progressBar} showInfo={false} />
    </div>


  return(
  <div className='category-modal-container'>
          <div className='modal-content'>
                <Form
                    className={'addCardForm'}
                    {...formItemLayout}
                    ref={refForm}
                    layout="horizontal"
                    size='middle'
                    form={form}
                    name="register-card"
                    initialValues={selectedCard}
                    onFinish={handleOk}
                    
                    >
                    <div className='cardImage'>
                        <Form.Item 
                          name="imageFile" 
                          >
                            
                          <ImageUpload uploadedImage={getImage} image={isEditMode?item.image.thumbnailUrl:''} />
              
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
                          name="cardOrientation"  
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
                                {tagError&&<span style={{color:'red',padding:'0 8px'}}>Tag legth must be at least 3 characteres</span>}
                              </>
                            )
                          }/>
                      </Form.Item>
                      <Form.Item
                        name="status"
                        label='Status'
                        valuePropName="checked"
                        //initialValue={true}
                        >
                          <Switch
                            checkedChildren={'active'}
                            unCheckedChildren={'inactive'}
                          />
                        </Form.Item>
                  </div>
                </Form>
          </div>
          <ModalFooter />
      </div>
  )}




  const View = (card)=>{
        //const lindex= item.category.length-1
      const categories = card.category.map((cat,i,{length})=>{
        if(i!==length-1){
          return cat.name+' , '
        }
        return cat.name
      })

      const subCategories = card.subCategory.map((sub,i,{length})=>{
        if(i!==length-1){
          return sub.name+' , '
        }
        return sub.name
      })

      const subCategoryChildren = card.subCategoryChildren.map((child,i,{length})=>{
        if(i!==length-1){
          return child.name+' , '
        }
        return child.name
      })
      
      return(
          <div className="card-container" ref={refView} >
              <div
                className='cardImage'
              >
                <IKContext urlEndpoint="https://ik.imagekit.io/gl">
                  <IKImage path={card.image.filePath} 
                  transformation={[{
                      "height": "595",
                      "width": "407"
                    }]}
                    loading="lazy"
                    lqip={{ active: true }}
                  />
                </IKContext>
              </div>
              <div className='card-items'>
                <ul>
                  <li><span className='inline-input'>Name:</span><span className='item-value'>{card.title}</span></li>
                  <li><span className='inline-input'>Slug:</span><span className='item-value'>{card.slug}</span></li>
                  <li><span className='inline-input'>Card Orientation:</span><span className='item-value'>{card.orientation.charAt(0).toUpperCase() + card.orientation.slice(1)}</span></li>
                  <li><span className='inline-input'>Status:</span><span className='item-value'><Tag color={card.status? 'green':'red'}>{card.status?'Active' : 'Inactive'}</Tag></span></li>
                  <li><span className='inline-input'>Created By:</span><span className='item-value'>{card.createdBy.userName}</span></li>
                  <li><span className='inline-input'>Category:</span><span className='item-value'>{categories}</span></li>
                  <li><span className='inline-input'>Sub category:</span><span className='item-value'>{subCategories.length ?subCategories : <span className='no-data'>no data associated</span>}</span></li>
                  <li><span className='inline-input'>Sub category child:</span><span className='item-value'>{subCategoryChildren.length?subCategoryChildren :<span className='no-data'>no data associated</span>}</span></li>
                  <li><span className='inline-input'>Description:</span><span className='item-value'>{card?.description}</span></li>
                  <li><span className='inline-input'>Tags:</span>
                    <span className='item-value'>
                      {card.tags&&card.tags.length?card.tags.map((item,index)=>(<Tag color="magenta" key={index+2}>{item.name}</Tag>)):<span className='no-data'>no data associated</span>}
                    </span></li>
                </ul>
              </div>
          </div>

  )}




  const propsDelete:deleteProps={
    itemId:item._id,
    type:'Card',
    targetUrl:CARDS,
    itemName:item.title,
    button:"regular",
  }

  const Content = useCallback(()=>{
    if(isEditMode){
      return <EditForm />
    }else return <View {...selectedItem}/>
  },[isEditMode,selectedItem])

  return (
    <>
      <Modal visible={isModalVisible} onCancel={handleCancel} width={900} footer={false} maskClosable={false} >
        <PageHeader
            ghost={false}
            subTitle={'Card ID: '+ item._id}
            extra={[
              <DeleteCard onDelete={handleCancel} doRefrech={refreshCards} {...propsDelete} key='454'/>,
              !isFooter?<Button key="1" type="primary"  onClick={onEditCard}>Edit</Button>:<Button key="2" danger onClick={onDismiss}>Dismiss</Button>,
            ]}
          >
          </PageHeader>
          <Content/>
      </Modal>
    </>
  );
}

const View = forwardRef(ViewCard);
export default React.memo(View)
