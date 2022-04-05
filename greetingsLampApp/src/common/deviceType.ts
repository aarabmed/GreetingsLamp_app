import { useEffect, useState } from 'react';

export function DeviceType(): string {
  const [className, setClassname] = useState('');

  useEffect(() => {
    const handler = () => {
      console.log('screen.orientation:',screen.orientation)

      const width = document.documentElement.clientWidth //Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      console.log('window.innerWidth::',window.innerWidth)
      console.log('document.documentElement.clientWidth::',document.documentElement.clientWidth)

      if(width<=425){
         return setClassname('mobile')
      }
      if(width>425 && width<1025){
         return className!=='tablete'? setClassname('tablete'):null
      }
      if(width>1024){
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
          return  className!=='tablete'?setClassname('tablete'):null
        }
        else return setClassname('')
      }
  
    };

    window.onresize = handler
    window.setTimeout(handler,1)
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);


  return className;
}