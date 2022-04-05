import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Collapse, Drawer, Menu } from "antd";
import Link from "next/link";
import React, { useCallback, useState } from "react";

const { Panel } = Collapse;

type NavProps = {
  onClickMenu?:()=>void,
  drawerStatus?:boolean,
  bannerData?:Object,
  menuData?:any[]
}

export default React.memo(({menuData}:NavProps)=>{
    const [drawerVisible, setDrawerVisible] = useState(false);

    const showDrawer = () => {
      setDrawerVisible(!drawerVisible)
    };
    
    const onClose = () => {
        setDrawerVisible(false)
    };

    console.log('menuData>:',menuData)
      return<div className="mobile-menu-container">
            
            <div className="logo">
                    <Link href={"/"}>
                        <a>
                        <img 
                            height={45}
                            src="/assets/images/greetingslamp-logo.png"
                            alt="Logo"
                        />
                        </a>
                    </Link>
            </div>
            <Button type="primary" onClick={showDrawer} style={{ marginBottom: 16 }}>
                {React.createElement(drawerVisible?MenuFoldOutlined:MenuUnfoldOutlined)}
            </Button>
          
            <Drawer
              placement='top'
              closable={false}
              onClose={onClose}
              visible={drawerVisible}
              zIndex={9999}
              key='top'
              height={'auto'}
              className="drawer"
              >
              <div className="drawer-wrapper">
                 <Collapse accordion>
                   {
                     menuData.map(col=>{
                      return <Panel header={<Link href={`/${col.slug}`}>{col.name}</Link>} key={col._id}>
                        <Collapse accordion>
                            {     
                              col.category.length&&col.category.map(cat=>{
                                  return <Panel  header={<Link href={`/${col.slug}/${cat.slug}`}>{cat.name}</Link>} key={cat._id}>
                                          <div className="sub-categories">
                                              { cat.subCategory.length&&cat.subCategory.map(sub=>{
                                                  return <Link key={sub._id} href={'/'+col.slug+'/'+cat.slug+'/'+sub.slug}>{sub.name}</Link>
                                              })}
                                          </div>
                                  </Panel>
                              })
                            }
                        </Collapse>
                      </Panel>
                     })
                   }
                 </Collapse>
              </div>
            </Drawer>
      </div>
})