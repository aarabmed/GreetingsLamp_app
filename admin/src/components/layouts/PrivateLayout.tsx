import React, {useState} from "react";
import Head from "next/head";
import Header from "../header/Header";
import LeftSideMenu from "./sideMenu";
import Footer from "components/footer/Footer";


   
function PrivatLayout({
  title,
  children,
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newContentResonsive, setnewContentResonsive] = useState({});
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
  if(typeof window !== "undefined"){
    window.onresize = reportWindowSize;
  }
  React.useEffect(()=>{
    reportWindowSize()
  },[])

 
  
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
           
      <div className={`content-admin`}>                
         {!mobileMenu&&<LeftSideMenu/>}
        
          <div className="content-row-admin">
            <Header mobileMenu={mobileMenu}/>
            <div className="gutter-row content-side-admin">
                {children} 
            </div>
            <Footer/>
          </div>
      </div>      
    </>
  );
}

export default React.memo(PrivatLayout);
