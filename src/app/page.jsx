"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {

  const [isAuth, setAuth] = useState(false);
  const router = useRouter()
  // useEffect(() => {
  //   let data = sessionStorage.getItem("auth");
  //   console.log(data);
  //   const isAuthenticated = data ? true : false;
  //   // If the user is authenticated, continue as normal
  //   if(!isAuthenticated) {
  //     router.push('/login');
  //   }
  //   else {
  //     setAuth(true);
  //   }
  
  // })
  return (
   <div>
    <p>Home page</p>
    <p>do not view without logging in</p>
   </div>
  );
}
