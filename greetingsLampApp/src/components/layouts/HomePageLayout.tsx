import React, {useState,useRef, createRef, forwardRef} from "react";
import Head from "next/head";
import { BackTop, Button} from "antd";
import Menu from 'components/header/components/top-menu'
import CarouselCards from "components/slider";
import Footer from "components/footer/Footer";
import SearchFrom from "components/header/components/searchForm";
import { useRouter } from "next/router";
import MobileNav from "components/header/mobile-nav";  
import { DeviceType } from "common/deviceType";
import { HeaderVideo } from "common/apiEndpoints";

function BaseLayout(props) {

  const [menuLogo, setmenuLogo] = useState('/assets/images/greetingslamp-logo-white.png');
  const [displayBanner, setDisplayBanner] = useState(true);

  const router = useRouter();

  const mainPage = useRef(null)
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
         menuRef.current.classList.remove('fixed')
        }
       
    }
    if(window.scrollY===0){
      if(menuRef.current){
          menuRef.current.classList.remove('onScroll')
          const popUp = Array.from(document.getElementsByClassName('navigation_container'))
          popUp.forEach((element:HTMLElement) => {
            element?element.style.position='fixed':null;
          }); 
          setmenuLogo('/assets/images/greetingslamp-logo-white.png')
          menuRef.current.classList.add('fixed')
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


const device = DeviceType();



React.useEffect(()=>{
  setDisplayBanner(false);
  videoBanner.current.type="video/webm"
  videoBanner.current.src=HeaderVideo
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


  
  const Navigation = ()=> device ?<div className="mobile-menu"><MobileNav menuData={headerData.menuData}/></div>
  : <Menu homepage={true} Elements={headerData.menuData} myRef={menuRef} onMouseOver={onMouseOverEvent} onMouseLeave={onMouseLeaveEvent} logo={menuLogo} />

  return (
    <>
    <Head><title>Free invitations and cards | Greetings Lamp</title></Head>
    <div className={`home-page ${device}`} ref={mainPage}>
      <div className="home-header">
          <div className="home-banner"> 
            <Navigation/>
            {displayBanner?<img src="/assets/images/banners/home-banner-video.jpg" style={{width:'100%'}}/>:null}
            <video ref={videoBanner} >
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
                <Button shape="round" ghost onClick={()=>router.push('/cards')}>View cards</Button>
              </div>
              <div className="image">
                <img src="/assets/images/cards-section.png"/>
              </div>
          </div>
          <CarouselCards {...carouselCardsProps}/>
          <div className="invitations-section" >
              <div className="description">
                <h3>Invitation Cards</h3>
                <p>Browse our wide selection of online invitations cards and put your wedding, celebration, grand opening, or any other special event in the spotlight</p>
                <Button shape="round" ghost onClick={()=>router.push('/invitations')}>Explore invitations</Button>
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
