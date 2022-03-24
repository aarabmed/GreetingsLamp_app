import Link from "next/link";
import React ,{ forwardRef} from "react";
import { Menu } from 'antd';
import Image from 'next/image'

const { SubMenu } = Menu;

type Props = {
  Elements:Array<any>,
  myRef?:any,
  onMouseOver?:()=>void,//React.MouseEventHandler<HTMLElement>,
  onMouseLeave?:()=>void,
  logo:string,
  homepage?:boolean
}

const Navigation = forwardRef<React.Component, Props>(({onMouseLeave,onMouseOver,homepage,Elements,myRef,logo}:Props, ref) =>{

  
  const handlMenu = (items)=>{  

      return items.map((option)=>{
  
        return(
          <SubMenu className="gl-menu-li" key={`${option._id}+-${option.name}`} title={<Link href={`/${option.slug}`}>{option.name}</Link> } popupClassName="bc-menu-popup">
            <Menu.ItemGroup className="menuGroup">
              {option.category.map((cat,index)=>
                <Menu.ItemGroup  title={<Link href={`/${option.slug}/${cat.slug}`}>{cat.name}</Link> } key={cat._id} className="bc-menu-sub-item-group" onClick={()=>{}}>
                    {cat.subCategory.map(el=>
                        <Menu.Item key={el._id+`-${option.name}-${cat.name}-${el.name}`} className="bc-menu-sub-items" >
                                <Link href={'/'+option.slug+'/'+cat.slug+'/'+el.slug}>{el.name}</Link>
                        </Menu.Item>
                    )}
                </Menu.ItemGroup>
              )}
            </Menu.ItemGroup>
            <div className="image-pop-menu" >
                    <Image
                      src={logo}
                      alt="Logo"
                      height="70"
                      width="170"
                    />
            </div>
          </SubMenu>
        )
      })
  }




  return (
    <div onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} className='public__navigation' ref={myRef}>
      <div className='navigation_container'>
        <div className="logo">
                <Link href={"/"}>
                  <a>
                    <img
                      src={logo}
                      alt="Logo"
                    />
                  </a>
                </Link>
        </div>
      
        <div className="bc-menu">
          <Menu subMenuCloseDelay={0.05} mode="horizontal" triggerSubMenuAction='hover' className={homepage?'bc-menu-sub home-menu':'bc-menu-sub'}>
            {handlMenu(Elements)}
          </Menu>
        </div> 
      </div>
      
    </div>
  );
})

export default Navigation
