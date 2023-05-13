import React, { useEffect, useState } from 'react'
import { getRestaurantAdmin, getRestaurantOwner } from '../../Processing/Database'

export default function HomePage() {

  const[restInfo , setRestInfo] = useState()


  useEffect(()=>{
    const getRestaurant = async ()=>{
      setRestInfo(await getRestaurantOwner())
    }
    getRestaurant()
    console.log(restInfo)
    console.log(getRestaurant())
  },[])

  return (
    <div></div>
  )
}
