import React, { useRef } from "react";
import { List, PageHeader, Row, Tag } from "antd";
import { IKImage, IKContext } from 'imagekitio-react'
import EditMenuType from './menuCenterDynamicType'



export const Parent =({item,type,headerMutate})=>{
    const editButton = useRef(null)
        

    const RunHeaderMutate =()=>{
        headerMutate()
    }

    const displayEdit=()=>{
        editButton.current.classList.add('active')
    }
    const hideEdit=()=>{
        editButton.current.classList.remove('active')
    }

    const Content = ({ children, extraContent }) => (
        <Row>
          <div style={{ flex: 1 }}>{children}</div>
          <div className="menu-center-body-image">{extraContent}</div>
        </Row>
    );

    const filteredKeys = ['status','description','title']
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const ListData = Object.keys(item).filter(item=>filteredKeys.includes(item)).map((key)=>({title:capitalize(key),description:item[key]})).map(elm=>{
        if(elm.title==='Status'){
            return {title:'Status',description:<Tag color={elm.description? 'green':'red'}>{elm.description?'Active' : 'Inactive'}</Tag>}
        }
        return elm
    })
    
    const content = (
        <>
            <List
                itemLayout="horizontal"
                dataSource={ListData}
                size="small"
                renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title}
                        description={item.description}
                      />
                    </List.Item>
                  )}
            />

        </>
    )


    return (
        <div className="menu-center-body"  >
            <div onMouseOver={displayEdit} onMouseOut={hideEdit}>
                <PageHeader
                        
                        ghost={false}
                        title={item.name}
                        className="menu-center-header-edit"
                        
                    >
                    <span className="menu-center-edit"  key='2'  ref={editButton}>
                        <EditMenuType type={type} mode='edit' item={item} runMutate={RunHeaderMutate}/>
                    </span>
                    <Content
                        extraContent={
                            <IKContext urlEndpoint="https://ik.imagekit.io/gl">
                                <IKImage path={item.image.filePath} 
                                    loading="lazy"
                                    lqip={{ active: true }}
                                />
                            </IKContext>
                        }
                        children={content}
                    />
                    
                </PageHeader>
            </div>
        </div>
    )
}