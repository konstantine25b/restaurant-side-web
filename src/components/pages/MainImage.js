import React, { useEffect, useState } from 'react'

import './MainImage.css';


export default function MainImage() {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  useEffect(()=>{
    console.log(selectedFile)
  },[selectedFile])



  
  return (
   
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
    {selectedFile && (
      <img
        className="selected-file-preview"
        src={URL.createObjectURL(selectedFile)}
        alt={selectedFile.name}
      />
    )}
  </div>
    
  )
}
