import { Modal, Button } from 'antd';
import axios from 'axios';
import { logoutUser } from 'redux/actions/userActions';
import jwt_decode , { JwtPayload }from 'jwt-decode';




export function countDown(dispatch) {
  let secondsToGo = 5;
  const modal = Modal.success({
    content: `You are not authenticated, you'll be redirected to the login page in ${secondsToGo} second.`,
    okButtonProps: { disabled: true,style: { display: 'none' }}
 });
  const timer = setInterval(() => {
    secondsToGo -= 1;
    modal.update({
      content: `You are not authenticated, you'll be redirected to the login page in ${secondsToGo} second.`,
    });
  }, 1000);
  setTimeout(() => {
    clearInterval(timer);
    dispatch(logoutUser())
    modal.destroy();
  }, secondsToGo * 1000);

}


const withAuth = async (callback,dispatch) =>{
  let currentDate = new Date();
  const {data} = await axios.get('/api/session')
  
  if(data.status===200){
      const decodedToken:JwtPayload  = jwt_decode(data.session.token)

      if(decodedToken.exp * 1000 < currentDate.getTime()){
         return countDown(dispatch)
      }

      if(typeof callback ==='function'){ 
         return callback()
      }
  }
  if(data.status===401){
     return countDown(dispatch)
  }
}

const isAuthenticated  = async ()=>{
  const {data} = await axios.get('/api/session')
  let currentDate = new Date();
  if(data.status===200){
      const decodedToken:JwtPayload  = jwt_decode(data.session.token)
      if(decodedToken.exp * 1000 < currentDate.getTime()){
         return true
      }
      return false
  }
  return false
}



export {withAuth, isAuthenticated }