import React from "react";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import COLORS from "../../../themes/colors";
import { useForm } from "react-hook-form";
import { API } from "../../../Processing/RestaurantAPI";
import { useQuery } from "react-query";

export default function Description() {
  const { state } = useLocation();
  const { restName } = state;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const onSubmit = (data) => {
    console.log(restInfo, data);
    handleUpdateRestaurant(data.ShortDescription);
  };

  const handleUpdateRestaurant = async (updateShortDescription) => {
    const updateRestaurantData = {
      shortdescription: updateShortDescription,
      address: restInfo.address,
      tags: restInfo.tags,
      images: restInfo.images,
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
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data</p>;
  }

  return (
    <MainDiv>
      <Bottom onSubmit={handleSubmit(onSubmit)}>
        <NameP>Description Correction:</NameP>
        <NameInput
          defaultValue={restInfo?.shortdescription}
          {...register("ShortDescription", { required: true })}
        />
        {errors.ShortDescription?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            ShortDescription is required
          </p>
        )}
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

const Bottom = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NameP = styled.p`
  padding: 10px 0px 0px 10px;
  margin: 8px;
  margin-bottom: 19px;
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
  background-color: ${COLORS.lightBlue};
  color: white;
  display: flex;
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
