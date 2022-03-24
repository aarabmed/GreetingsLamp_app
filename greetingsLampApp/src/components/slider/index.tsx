import React, {useState,useRef, useEffect} from "react";
import SwiperCore ,{EffectFlip, Navigation,Pagination } from "swiper";
import { Swiper, SwiperSlide,useSwiper } from "swiper/react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import "swiper/css/navigation";

import Card from "components/cards/bc-card";

const { Body } = Card 

SwiperCore.use([EffectFlip, Navigation, Pagination,]);
type card ={
    _id:string,
    image:string,
    title:string,
    slug:string,
    orientation?:string
}

type  sliderProps= {
   title:string,
   subTitle:string,
   items:card[]
}


const Index=({title,subTitle,items}:sliderProps)=>{ 
  const [sildersNumber , setSliderNumber] = useState(11)  
  const sliderRef = useRef(null)

  const updateSize =()=>{
    setSliderNumber(window.innerWidth / 125>>0)
  };

  useEffect(()=>{
    if(sliderRef.current){
        setSliderNumber(window.innerWidth / 125>>0)
    }
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  },[sliderRef.current])
  return (
    <div className='slider-section' ref={sliderRef}>
        <div className="slider-header">
            <h2>{title}</h2>
            <h3>{subTitle}</h3>
        </div>
        <div className="slider-body">
            <Swiper
                slidesPerView={sildersNumber}
                allowSlidePrev={true}
                allowSlideNext={true}
                navigation={true}
                spaceBetween={15}
                pagination={{
                   clickable: true,
                }}
                modules={[Pagination,Navigation]}
                className="mySwiper"
            >
                    {items.map(item=><SwiperSlide key={item._id}>
                        <Card 
                            cover={item.image}
                            width='120'
                            height={item.orientation!=='portrait'?'174':'auto'}
                            itemId={item._id}
                            currentPath={`/preview/cards/${item.slug}`}
                        >
                         <Body title={item.title} />
                        </Card>
                    </SwiperSlide>)}
            </Swiper>
        </div>
    </div>
  );
}

export default React.memo(Index);
