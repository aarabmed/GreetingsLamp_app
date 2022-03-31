import React, {useState,useRef} from "react";
import Head from "next/head";
import { BackTop ,Row,Col} from "antd";

import Header from "components/header/";
import PublicSidebar from "components/sider"
import Container from "../other/Container";
import Footer from "components/footer/Footer";


   
function Layout({
  title,
  data,
  ContentResponsive,
  children
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newContentResonsive, setnewContentResonsive] = useState({});
  //const {}
  const backToTop = useRef(null);
  function reportWindowSize() {
      if(window.innerWidth<=820){
        if(mobileMenu===true){
          return
        }else{
          setMobileMenu(true)
          setnewContentResonsive({xs:24,sm:24,md:24})
        }
      }else{
        if(mobileMenu===false){
          return
          }else{
          setMobileMenu(false)
          setnewContentResonsive({md:19,sm:19})
        }
      }

  }
  
  if (typeof window !== "undefined") {
    window.onresize = reportWindowSize 
  }
  React.useEffect(()=>{
     reportWindowSize()
  },[])

  
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={`content-public`}>
            <Header {...data.headerData}/>
            <Container type={''} cName={'container-public'}>       
              <Row className="gutter-row">
                  {!mobileMenu&&data.sidebarData&&
                   <PublicSidebar props={data.sidebarData}/>
                  }
                  <Col className="gutter-row content-side" {...ContentResponsive} {...newContentResonsive} ref={backToTop}>
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
