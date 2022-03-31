
import React, { useEffect, useState } from 'react'
import { Upload, message } from 'antd';
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import localForage  from 'localforage'



type Props ={
    storedImage?:(e:string)=>void,
    uploadedImage:(e:Object)=>void,
    image?:string,
    mode?:string,
};


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt1M = file.size / 1024 / 1024 < 1.5;
  if (!isLt1M) {
    message.error('Image must smaller than 1.5MB!');
  }
  return isJpgOrPng && isLt1M;
}

const UploadImage:React.FC<Props>=({uploadedImage,image})=>{
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl,setImageUrl] = useState('')
    const [NewImg,setNewImg] = useState('')
    
    // image 
    // imagelocal

    useEffect(()=>{
      localForage.getItem('new-img').then((img:string)=>{
        if(!img){

          if(image&&!imageUrl){
            setImageUrl(image)
            return
          }
          return
        }      
        setImageUrl(img);
        
      });
         
    },[imageUrl])

    const showEdit =()=>{
        setEdit(true)
    }
    const hideEdit =()=>{
        setEdit(false)
    }
    const handleChange = info => {
      if (info.file.status === 'uploading') {
          setLoading(true)
        return;
        }
        if (info.file.status === 'done') {
          
            // Get this url from response in real world.
          return getBase64(info.file.originFileObj, imgUrl =>{
            setImageUrl(imgUrl);
            localForage.setItem('new-img',imgUrl, function (err) {})
            setLoading(false)
            uploadedImage(info.file.originFileObj);
          });

        };
    }

    const uploadButton = (
      <div className="uploadButton">
        <div className="upload">
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload image</div>
        </div>
      </div>
    );

    const dummyRequest = (options) => {    
      setTimeout(() => {
        options.onSuccess("ok");
      }, 0);
    }

    return (
      <Upload
        customRequest={dummyRequest}
        name="Image uploader"
        listType="picture-card"
        className="image-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}      
      >
        {imageUrl ? <div className='imagePreview' onMouseEnter={showEdit} onMouseLeave={hideEdit}>
                {edit&&<span><EditOutlined />change image </span>}
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            </div> : uploadButton}
      </Upload>
    );
}

export default React.memo(UploadImage)



