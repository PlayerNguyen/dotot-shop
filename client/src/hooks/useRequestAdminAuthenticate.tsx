import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function useRequestAdminAuthenticate(redirectPath: string) {
  const navigate = useNavigate()

  useEffect(() => {
    // Has no access token
    if (localStorage.getItem('token') === null) {
      return navigate(redirectPath)
    }

    // Has not an admin
    

  } , [])

}