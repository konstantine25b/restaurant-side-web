import React, { useEffect, useRef, useState } from 'react'

import './MainImage.css';
import { editRestaurant, getRestaurant, uploadImage } from '../../Processing/Database';
import styled from '@emotion/styled';
import COLORS from '../../themes/colors';
import { useLocation } from 'react-router-dom';


export default function MainImage() {

  const { state } = useLocation();
  const { restName } = state;
  const [restInfo, setRestInfo] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [firstImage, setFirstImage] = useState(null);

  const [newUrl , setNewUrl] = useState("")

  const newImageUploaded = useRef(false)

  const getRestaurantInfo = async () => {
    setRestInfo(await getRestaurant(restName));
  };

  useEffect(() => {
    console.log(restName);
    // amit saxelis sashualebit momaq restornis info

    getRestaurantInfo();
    
    
  }, [restName]);

  useEffect(()=>{
  
    setFirstImage(restInfo?.MainImage)
  },[restInfo])
  
  useEffect(()=>{
  
    setFirstImage(null)
  },[selectedFile])
  




  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const handleSubmit=()=>{

    uploadImage(selectedFile).then((url)=>setNewUrl(url))
    newImageUploaded.current = true
    

    
   
  }
  useEffect(()=>{

    if(newImageUploaded.current==true){
 
      editRestaurant(restInfo.Title , restInfo.Address, restInfo.Genre, newUrl, restInfo.ShortDescription, restInfo.Tags)  
    }
 
  },[newUrl])


 
    



  
  return (
    <MainDiv>
    <div className="image-uploader">
    <label className="file-label">
      <input
        className="file-input"
        type="file"
        onChange={handleFileInputChange}
      />
      <span className="file-cta">
        <span className="file-icon">
          <i className="fas fa-upload"></i>
        </span>
        {!selectedFile && (
        <span className="file-label-text">Choose a file…</span>
        )}
         {selectedFile && (
        <span className="file-label-text">Switch uploaded file...</span>
        )}
        
      </span>
      
    </label>
    {firstImage&&(
      <img
      className="selected-file-preview"
      src={firstImage}
      
    />
    )}
    {selectedFile && (
      <img
        className="selected-file-preview"
        src={URL.createObjectURL(selectedFile)}
        alt={selectedFile.name}
      />
    )}
  </div>
  <SubmitInput onClick={()=>handleSubmit()}>Submit Main Image</SubmitInput>
  </MainDiv>
    
  )
}
const SubmitInput = styled.div`
  all: unset;
  width: 140px;
  height: 40px;
  background-color: ${COLORS.green};
  color: white;
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 18px;
  margin-left: 18px;
  margin-bottom: 30px;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;


const MainDiv = styled.div`
  width: 80%;
  margin-top: 40px;
  background-color: ${COLORS.light2};
  display: flex;
  flex-direction: column;
  align-items: center;
`;