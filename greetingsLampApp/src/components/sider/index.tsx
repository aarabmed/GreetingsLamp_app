import React, { useEffect } from "react";
import router, {useRouter} from "next/router"
import { Col, Menu } from 'antd';
import classNames from "classnames";

import { MenuTitle } from "./index.style";
const { SubMenu } = Menu;

interface Props {
  className?:string;
  type:string;

}


const SidebarResponsive={ xs: 24, lg: 4 }

function PublicSidebar({props}) {

  const router = useRouter();
  
  useEffect(()=>{
    
  },[])

  
  const SideBarMenu = (data)=>{
    const Items =(Items)=>{
          return Items.map(item=> <Menu.Item onClick={onSubCategoryChildClick} key={item.slug} className={`sidebar_submenu_item`+classNames({_active: router.query.subCategoryChild===item.slug})}>{item.name}</Menu.Item>)
    }

    return data.map((subCategory)=>{

      if(subCategory.childrenSubCategory.length===0){
          return (<Menu.Item key={subCategory.slug} onClick={onSubCategoryClick} className={`sidebar_submenu_item`+classNames({_active: router.query.subCategory===subCategory.slug })}>{subCategory.name}</Menu.Item>)
      }
      
        return (<SubMenu key={subCategory.slug}  onTitleClick={onSubCategoryTitleClick} title={subCategory.name} className={`sidebar_submenu_group`+classNames({_active: router.query.subCategory===subCategory.slug && !router.query.subCategoryChild})} >
                  {Items(subCategory.childrenSubCategory)}
            </SubMenu>)
    
    })
  }

  const onSubCategoryClick = ({key}) =>{

    const { collection,category,subCategory} = router.query;
      router.push({
        pathname:'/[collection]/[category]/[subCategory]',
        query:{
          collection,
          category,
          subCategory:key,
        }
      })
  
  }

  const onCategoryClick = (key) =>{

    const { collection} = router.query;
    router.push({
      pathname:'/[collection]/[category]',
      query:{
        collection,
        category:key,
      }
    })

  }

  const onSubCategoryChildClick = ({key}) =>{

    const { collection,category,subCategory} = router.query;

     router.push({
      pathname:`/[collection]/[category]/[subCategory]/[subCategoryChild]`,
      query:{
        collection,
        category,
        subCategory,
        subCategoryChild:key,
      }
    })
  }

  const onSubCategoryTitleClick =({key})=>{     
      const { collection,category} = router.query;
      router.push({
        pathname:'/[collection]/[category]/[subCategory]',
        query:{
          collection,
          category,
          subCategory:key,
        }
      })
  }

  return (
    <Col {...SidebarResponsive} className="sidebar" >
          <MenuTitle onClick={()=>onCategoryClick(props.categoryActive.slug)} active={router.query.subCategory?true:false}>{props.categoryActive.name}</MenuTitle>
          <Menu mode="inline" openKeys={[props.subCategoryActive[0].slug]} style={{ width: '100%' }} className={`sidebar_menu `}>
            
              {SideBarMenu(props.subCategories)}
              
          </Menu>
     </Col>
  );
}

export default React.memo(PublicSidebar);

     
