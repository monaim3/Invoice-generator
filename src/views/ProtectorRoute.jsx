import React, { useEffect, useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';

const ProtectorRoute = ({children}) => {
    const [auth,setAuth]=useState(false)
    const [loading,setLoading]=useState(true)
    const getCookie = () => {
        const cookies = document.cookie.split(';').map(cookie => cookie.split('='));
        const foundCookie = cookies.find(cookie => cookie[0].trim() === "auth");
        if (foundCookie) {
          setAuth(foundCookie[1]);
          
        } else {
          setAuth(false);
        }
      };
    useEffect(()=>{
 getCookie()
 setLoading(false)
    },[])
 if(loading){
return <div>Loading ...</div>
 }

    if(auth==="true" || auth==true){
        return children
    }
    return (
        <Navigate to="/login"></Navigate>
    );
};

export default ProtectorRoute;