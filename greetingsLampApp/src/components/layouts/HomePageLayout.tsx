import React, {useState,useRef, createRef, forwardRef} from "react";
import Head from "next/head";
import { BackTop ,Row,Col,Input, Select, Button} from "antd";
import Menu from 'components/header/components/top-menu'
import CarouselCards from "components/slider";
import Footer from "components/footer/Footer";
import SearchFrom from "components/header/components/searchForm";
import { useRouter } from "next/router";
   
function BaseLayout(props) {

  const [menuLogo, setmenuLogo] = useState('/assets/images/greetingslamp-logo-white.png');

  const router = useRouter();

  const menuRef = useRef(null);
  const videoBanner = useRef(null);
  const {headerData,mainContent} = props;


  function onScroll() {
    
    const subMenu = Array.from(document.getElementsByClassName('ant-menu-submenu-popup'))
    subMenu.forEach((element:HTMLElement) => {
      element?element.style.position='fixed':null;
    });
    
    if(window.scrollY>0){
       
       if(menuRef.current){
          menuRef.current.classList.add('onScroll')
          setmenuLogo('/assets/images/greetingslamp-logo.png')
       }
       
    }
    if(window.scrollY===0){
      if(menuRef.current){
         const popUp = Array.from(document.getElementsByClassName('navigation_container'))
          popUp.forEach((element:HTMLElement) => {
             element?element.style.position='fixed':null;
          }); 
          menuRef.current.classList.remove('onScroll')
          setmenuLogo('/assets/images/greetingslamp-logo-white.png')
        }
    }
  }


  

const onMouseOverEvent =()=>{
  if(menuRef.current){
    if(window.scrollY===0){
      menuRef.current.classList.add('active')
      setmenuLogo('/assets/images/greetingslamp-logo.png')
    }
  }
}

const onMouseLeaveEvent =()=>{
  if(menuRef.current){
    if(window.scrollY===0){
      setTimeout(()=>{
        menuRef.current.classList.remove('active')
        setmenuLogo('/assets/images/greetingslamp-logo-white.png')

      },100)
    }
  }
}



React.useEffect(()=>{
  videoBanner.current.src="https://ik.imagekit.io/gl/videos/home-banner-video_x-OMJLTyv.mp4?ik-sdk-version=javascript-1.4.3&updatedAt=1648670813374"
  videoBanner.current.loop=true;
  videoBanner.current.autoplay=true;
  videoBanner.current.muted=true;
  videoBanner.current.play()

  onScroll();
  window.onscroll = onScroll
  
},[]) 

const submitSearch =({search})=>{
  return router.push({pathname:'/search',query:{q:search}})
}

const carouselCardsProps =  {
  title:'Most popular cards',
  subTitle:'For all type of events, ready to download and use.',
  items:mainContent.populatedCards
}
const carouselInvitationsProps =  {
  title:'Online Invitations',
  subTitle:'Save the date with this collection of printable invitations.',
  items:mainContent.populatedInvitations
}
  return (
    <>
    <Head><title>Free invitations and cards | Greetings Lamp</title></Head>
    <div className="home-page">
      <div className="home-header">
         <Menu homepage={true} Elements={headerData.menuData} myRef={menuRef} onMouseOver={onMouseOverEvent} onMouseLeave={onMouseLeaveEvent} logo={menuLogo} /> 
          <div className="home-banner"> 
            <video ref={videoBanner}>
            </video>
            
            <div className="search-section">
              <div className="home-title">
                <h1> Live every moment of your life <br/> Celebrate every Event with loved onces</h1>
                <h2>download cards or send them online</h2>
              </div>
              <SearchFrom onSumbit={submitSearch}/>   
            </div>
          </div>
      </div>
      <div className="homepage-main-container">
          <div className="cards-section" >
              <div className="description">
                <h3>Fabulous Cards</h3>
                <p>with our cards collection, your precious events are more memorable</p>
                <p>Check out our special events cards selections</p>
                <Button shape="round" ghost>View cards</Button>
              </div>
              <div className="image">
                <img src="/assets/images/cards-section.png"/>
              </div>
          </div>
          <CarouselCards {...carouselCardsProps}/>
          <div className="invitations-section" >
              <div className="description">
                <h3>Invitation Cards</h3>
                <p>Browse our wide selection of online invitations cards and put your <br/>wedding, celebration, grand opening, or any other special event <br/> in the spotlight</p>
                <Button shape="round" ghost>Explore invitations</Button>
              </div>
              <div className="image">
                <img src="/assets/images/invitations-section.png"/>
              </div>
          </div>
          <CarouselCards {...carouselInvitationsProps}/>
      </div>
       <BackTop />
      <Footer/>     
    </div>
    </>
  );
}

export default React.memo(BaseLayout);
