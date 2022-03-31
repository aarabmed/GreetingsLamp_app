import { Modal, Button } from 'antd';
import axios from 'axios';
import { logoutUser } from 'redux/actions/userActions';
import jwt_decode , { JwtPayload }from 'jwt-decode';
import { SESSION } from './apiEndpoints';


const axiosInstance = axios.create({
  validateStatus: function (status)
  {
      return true
  }
});

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
  const {status} = await axiosInstance.get(SESSION)
  
  if(status===200){
      if(typeof callback ==='function'){ 
         return callback()
      }
  }

  if(status===401){
     return countDown(dispatch)
  }
  return
}

const isAuthenticated  = async (session)=>{

  let currentDate = new Date();

  if(session!==undefined && Object.keys(session).length){
      const decodedToken:JwtPayload = jwt_decode(session.token)
    
      if(decodedToken.exp * 1000 < currentDate.getTime()){
         return false
      }
      return true
  }
  return false
}



export {withAuth, isAuthenticated }