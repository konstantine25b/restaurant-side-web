import React, { useEffect, useRef, useState } from "react";
import COLORS from "../../../../themes/colors";
import styled from "@emotion/styled";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../Components/MainImage.css";
import { API } from "../../../../Processing/RestaurantAPI";

export default function CorrectCategories() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const uploadLink = useRef("");
  const { state } = useLocation();
  const { NameEng, NameGeo, Image, categoryInfo, restId } = state;

  const firstData = {
    NameEng: NameEng,
    NameGeo: NameGeo,
    img: Image,
    categoryInfo: categoryInfo,
  };

  const handleUpdateCategory = async (updateCategoryTitle, image) => {
    const updateCategoryData = {
      title: updateCategoryTitle,
      description: "rame",
      image: image,
    };
    const updateCategorySuccess = await API.updateCategory(
      categoryInfo.id,
      updateCategoryData
    );
    alert(
      updateCategorySuccess
        ? "Category updated successfully!"
        : "Category update failed."
    );
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const onSubmit = async (data) => {
    let imgLink = uploadLink.current == "" ? firstData.img : uploadLink.current;

    await handleFileUpload(selectedFile);
    await handleUpdateCategory(data.NameEng, imgLink);

    navigate(-1);
  };

  const handleFileUpload = async (image) => {
    if (image) {
      const uploadSuccess = await API.uploadImage(restId, image); // Replace with the correct restaurant ID
      if (uploadSuccess !== "") {
        console.log("success upload image");
        uploadLink.current = uploadSuccess;
      } else {
        console.log("failed upload image");
      }
    }
  };

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

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
      <Bottom onSubmit={handleSubmit(onSubmit)}>
        <NameP>Name (English)</NameP>
        <NameInput
          defaultValue={NameEng}
          {...register("NameEng", { required: true })}
        />
        {errors.NameEng?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            English Name is required
          </p>
        )}
        <NameP>Name (Georgian)</NameP>
        <NameInput
          defaultValue={NameGeo}
          {...register("NameGeo", { required: true })}
        />
        {errors.NameGeo?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            Georgian Name is required
          </p>
        )}

        <div className="image-uploader">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              {...register("img")}
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
          {!selectedFile && (
            <img className="selected-file-preview" src={firstData.img} />
          )}
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
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
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
  margin-top: 38px;
  margin-left: 18px;
  margin-bottom: 30px;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
