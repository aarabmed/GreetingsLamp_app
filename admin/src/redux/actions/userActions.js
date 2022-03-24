
import { USER } from "../defines";
import Router,{ useRouter } from "next/router";

import axios from 'axios';
export const setUser = (user) => ({
  type: USER.SET_USER,
  user,
});

export const logoutUser = () => ({
  type: USER.REMOVE_USER,
},()=>{
  axios.get('/api/account/logout').then(res=>{
     Router.push('/admin/login')
  })
});

