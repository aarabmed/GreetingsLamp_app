import { SearchOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import React, { useEffect } from "react";


type Values = any

interface searchProps {
    onSumbit?:(values: Values) => void
    onChange?:(values: Values) => void
    fieldValue?:string
}

const SearchFrom:React.FC<searchProps> = ({fieldValue,onChange,onSumbit})=>{
    const [form] = Form.useForm();
    useEffect(()=>{
        if(fieldValue){
            form.setFieldsValue({['search']:fieldValue})
        }
    },[fieldValue])
    return (
        <Form
            className={'search-form'}
            wrapperCol={{span: 24}}
            layout="vertical"
            style={{width: '30%'}}
            size='middle'
            form={form}
            name="search"
            onFinish={onSumbit}

            >
            <Form.Item
                name="search"
                hasFeedback={false}  
                className="search-input"                        
            >
                <Input 
                onChange={onChange} 
                className="search-page-select"
                suffix={<SearchOutlined onClick={form.submit}/>}
                size="large"
                placeholder='Text to search'
                />
            </Form.Item>
        </Form>
    );
}

export default SearchFrom;