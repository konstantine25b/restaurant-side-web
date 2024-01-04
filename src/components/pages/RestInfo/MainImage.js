import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import COLORS from "../../../themes/colors";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { API } from "../../../Processing/RestaurantAPI";

export default function MainImage() {
  const { state } = useLocation();
  const { restName } = state;
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLink, setUploadLink] = useState("");
  const newImageUploaded = useRef(false);

  const {
    data: restInfo,
    isLoading,
    isError,
  } = useQuery(
    ["restaurant", restName],
    () => API.getRestaurantByTitle(restName),
    {
      enabled: Boolean(restName),
      onSuccess: (data) => {
        console.log("Restaurant info fetched successfully:", data);
      },
      onError: (error) => {
        console.error("Error fetching restaurant info:", error);
      },
    }
  );

  const mutation = useMutation((image) => API.uploadImage(restInfo.id, image), {
    onSuccess: (data) => {
      console.log("Image uploaded successfully:", data);
      setUploadLink(data);
      newImageUploaded.current = true;
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
    },
  });

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      mutation.mutate(selectedFile);
    }
  };

  const handleUpdateRestaurant = async (restImage) => {
    const updatedImages = restInfo.images.map((image, index) => {
      // Replace the first image with the new one
      return index === 0 ? restImage : image;
    });

    const updateRestaurantData = {
      shortdescription: restInfo.shortdescription,
      address: restInfo.address,
      tags: restInfo.tags,
      images: updatedImages,
    };

    const updateRestaurantSuccess = await API.updateRestaurant(
      restInfo.id,
      updateRestaurantData
    );

    alert(
      updateRestaurantSuccess
        ? "Restaurant updated successfully!"
        : "Restaurant update failed."
    );
  };

  useEffect(() => {
    if (newImageUploaded.current) {
      handleUpdateRestaurant(uploadLink);
      console.log(restInfo);
    }
  }, [newImageUploaded.current]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data</p>;
  }

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
        {restInfo.images[0] && !selectedFile && (
          <img className="selected-file-preview" src={restInfo.images[0]} />
        )}
        {selectedFile && (
          <img
            className="selected-file-preview"
            src={URL.createObjectURL(selectedFile)}
            alt={selectedFile.name}
          />
        )}
      </div>
      <SubmitInput onClick={handleSubmit}>Submit Main Image</SubmitInput>
    </MainDiv>
  );
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
