import React, { useEffect, useState } from "react";
import COLORS from "../../themes/colors";
import styled from "@emotion/styled";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import './MainImage.css';

export default function AddCategories() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
    
  };
  useEffect(()=>{
    console.log(selectedFile)
  },[selectedFile])

  return (
    <MainDiv>
      <Top>
        <BackButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeftIcon style={{ width: 20, color: "white" }} />
        </BackButton>
        <TopP>Categories Correction</TopP>
      </Top>
      <Bottom  onSubmit={handleSubmit(onSubmit)}>
      
      <NameP>Name (English)</NameP>
      <NameInput {...register("NameEng", { required: true})} />
      <NameP>Name (Georgian)</NameP>
      <NameInput {...register("NameGeo", { required: true})} />
      
      <div className="image-uploader">
    <label className="file-label">
      <input
        className="file-input"
        type="file"
        {...register("img", { required: true})}
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
        <span className="file-label-text">Switch uploaded file…</span>
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
      
      <SubmitInput type="submit" />
     
        
        
      </Bottom>
    </MainDiv>
  );
}

const MainDiv = styled.div`
  width: 80%;
  margin-top: 40px;
  background-color: ${COLORS.light2};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Top = styled.div`
  width: 90%;
  display: flex;
  padding-left: 5%;
  padding-right: 5%;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.light2};
  border: 0.5px solid ${COLORS.insideBlue};
`;

const TopP = styled.p`
  font-size: 20px;
`;

const BackButton = styled.div`
  width: 40px;
  height: 30px;
  background-color: ${COLORS.insideBlue};
  border-radius: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Bottom = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
 
`;

const NameP = styled.p`
  padding: 10px 0px 0px 10px;
  margin: 8px;
`;

const NameInput = styled.input`
  padding: 10px;
  width: 80%;
  margin: 0px 0 10px 18px;
  outline: none;
`;

const SubmitInput = styled.input`
   all: unset;
   width: 80px;
  height: 40px;
  background-color: ${COLORS.green};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 18px;
  margin-left: 18px;
  margin-bottom: 30px;
`;