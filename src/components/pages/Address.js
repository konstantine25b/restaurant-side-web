import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRestaurant } from "../../Processing/Database";
import styled from "@emotion/styled";
import COLORS from "../../themes/colors";
import { useForm } from "react-hook-form";

export default function Address() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { restName } = state;
  const { register, handleSubmit , formState: { errors }} = useForm();

  // aq vinaxav restornis mtlian informacia
  const [restInfo, setRestInfo] = useState();

  const getRestaurantInfo = async () => {
    setRestInfo(await getRestaurant(restName));
  };
  useEffect(() => {
    console.log(restName);
    // amit saxelis sashualebit momaq restornis info

    getRestaurantInfo();
  }, [restName]);

  const onSubmit = (data) => {
    console.log('ki');
  };

  return (
    <MainDiv>
      <Bottom onSubmit={handleSubmit(onSubmit)}>
        <NameP>Correct Address</NameP>
        <NameInput {...register("NameEng", { required: true })} />
        {errors.NameEng?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            English Name is required
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
  background-color: ${COLORS.green};
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