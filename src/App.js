import React,{useEffect, useState, useCallback} from 'react'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import { AuthContext } from './contexts/auth-context';
// ----------------------------------------------------------------------
let logoutTimer;
export default function App() {
  const [token,setToken]=useState(null);
  const [userId,setUserId]=useState(null);
  const [username,setUsername]=useState(null);
  const [expDate,setExpDate]=useState(null)
  const client=new QueryClient();
  
  
  const login=useCallback((userId,token,username,expDate=new Date(new Date().getTime()+1000*60*60))=>{
  setToken(token);
  setExpDate(expDate);
  setUserId(userId);
  setUsername(username);
  
  localStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expDate: expDate.toString(),
      username
    })); 
  },[])
  
  const logout=useCallback(()=>{
    setToken(null);
  setExpDate(null);
  setUserId(null);
  setUsername(null);
  localStorage.clear();
  },[])
  
  useEffect(()=>{
    const userData = JSON.parse(localStorage.getItem("userData"));
    if(userData && userData.token && userData.userId && new Date(userData.expDate)>new Date() && userData.username){
      login(userData.userId,userData.token,userData.username,userData.expDate);
    }else{
      localStorage.clear()
    }
  },[login])

  
  useEffect(()=>{
    if(token && expDate){
      const remainingLogoutTime=new Date(expDate).getTime()-new Date().getTime();
       logoutTimer=setTimeout(logout,remainingLogoutTime);
    }else{
    clearTimeout(logoutTimer)
    }
  },[token,expDate,logout])
  

  return (
    <AuthContext.Provider value={{isLoggedIn:!!token,login,logout,token,userId,username}}>
    <QueryClientProvider client={client}>
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Router token={token}/>
    </ThemeProvider>
    </QueryClientProvider>
    </AuthContext.Provider>
  );
}
