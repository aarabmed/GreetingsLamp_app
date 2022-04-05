import React, {useRef} from "react";
import Head from "next/head";
import { BackTop ,Row,Col} from "antd";

import DesktopHeader from "components/header/";
import PublicSidebar from "components/sider"
import Container from "../other/Container";
import Footer from "components/footer/Footer";
import { DeviceType } from "common/deviceType";
import MobileNav from "components/header/mobile-nav";
import Banner from "components/header/components/banner";
import GLDrawer from "components/drawer"


   
function Layout({
  title,
  data,
  ContentResponsive,
  children
}) {

  const backToTop = useRef(null);
  const device = DeviceType()

  const MobileHeader = () =>{
    return (
      <div className="mobile-menu">
        <MobileNav menuData={data.headerData.menuData}/>
        {data.headerData.bannerData?<Banner bannerData={data.headerData.bannerData}/>:null}
      </div>
    )
  }

  const Navigation = ()=> device ?<MobileHeader />:<DesktopHeader {...data.headerData}/>
  const SideBar = () => device ?<GLDrawer><PublicSidebar props={data.sidebarData}/></GLDrawer>:<PublicSidebar props={data.sidebarData}/>
  
  return (
    <> 
      <Head>
        <title>{title}</title>
      </Head>
      <div className={`content-public ${device}`}>
            <Navigation/>
            <Container type={''} cName={'container-public'}>       
              <Row className="gutter-row">
                  {data.sidebarData&&
                   <SideBar/>
                  }
                  <Col className="gutter-row content-side" {...ContentResponsive}  ref={backToTop}>
                    {children }
                    <BackTop/>
                  </Col>
              </Row>
            </Container>
            <Footer/>
      </div>      
    </>
  );
}

export default React.memo(Layout);
