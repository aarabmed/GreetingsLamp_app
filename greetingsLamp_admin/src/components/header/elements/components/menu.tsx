
import React from 'react';

import {useRouter} from "next/router"
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { setRoute } from "redux/actions/globalActions";
import CustomIcon from './customIcon'
import { Collapse } from 'antd';

const { Panel } = Collapse;

interface routeProps {
    id:number;
    name:string;
    slug:string;
    iconName?:string
    route?:Array<routeProps>
}

interface Props {
    items:{
        authority?:Array<string>;
        route?:Array<routeProps>
    },
    className?:string;
}

const  costumMenu:React.FC<Props> =(props)=>{ 
    const {items,className} = props
    const router = useRouter()
    const  {query} = router
    const dispatch = useDispatch();

    const onChooseRoute = (data) => {
        router.replace({pathname:'/admin/[page]',query:{page:data}},undefined,{shallow:true})
        const route = `/admin/${data}`

        if (!data) {
            return dispatch(setRoute("dashboard"));
        }
        return dispatch(setRoute(route));
    };

    const subRouteOnClick = (data) => {
        router.push({pathname:'/admin/menu-manager/[subPage]',query:{subPage:data}})
        if (!data) {
            return dispatch(setRoute("dashboard"));
        }
        const route = `/admin/menu-manager/${data}`
        return dispatch(setRoute(route));
    };



    return <ul className = {className}>
            {   items.route.map((item, index) =>{
                    if(item.slug==='menu-manager'){
                        return <li key={index} className='submenu-manager' >
                            <Collapse defaultActiveKey={query.subPage==='collections'?1:''} expandIconPosition='right' >
                                <Panel header={<div><CustomIcon className='menuIcon' type={item.iconName}/>{item.name}</div>} key="1">
                                    <ul>
                                        {item.route.map(el=>
                                            <li 
                                            key={el.id}
                                            className={classNames({
                                                active: query.subPage===el.slug,
                                            })}>
                                                <a onClick={()=>subRouteOnClick(el.slug)}> 
                                                    <CustomIcon className='menuIcon' type={el.iconName}/>
                                                    {el.name}
                                                </a> 
                                            </li>)
                                        }
                                    </ul>
                                </Panel>
                            </Collapse>
                        </li>
                    }
                    return <li
                            key={index}
                            className={classNames({
                                active: query.page===item.slug,
                            })+' menu-manager-item'}
                            >
                    
                            <a
                            onClick={() => onChooseRoute(item.slug)}
                            > 
                            <CustomIcon className='menuIcon' type={item.iconName}/>
                            {item.name}
                            </a>
                    
                    </li>
                }
            )}
        </ul>
        
}

export default costumMenu