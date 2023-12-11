import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import COLORS from "../../themes/colors";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation } from "react-query";
import { API } from "../../Processing/RestaurantAPI";

export default function Tags() {
  const { state } = useLocation();
  const { restName } = state;
  const { register, handleSubmit, control } = useForm();

  // aq vinaxav restornis mtlian informacia
  const { data: restInfo, isLoading, isError } = useQuery(
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

  const mutation = useMutation(
    (tagsArray) => API.updateRestaurant(restInfo.id, { tags: tagsArray }),
    {
      onSuccess: (data) => {
        console.log("Restaurant updated successfully:", data);
      },
      onError: (error) => {
        console.error("Error updating restaurant:", error);
      },
    }
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const defaultItemsGenerated = useRef(false);

  const [removeClicked, setRemoveClicked] = useState(false);

  // amit xdeba damateba ingredientebis tu aqvs ukve ogond defaultebis
  useEffect(() => {
    console.log(restInfo);
    if (restInfo?.tags == null ? "" : restInfo?.tags.length > 0 && defaultItemsGenerated.current === false) {
      restInfo.tags.forEach((item) => {
        append({ name: item });
      });
      defaultItemsGenerated.current = true;
    }
  }, [restInfo, removeClicked]);

  const onSubmit = (data) => {
    console.log(data.Tags);
    console.log(fields);
    let arr = [];

    for (let i = 0; i < fields.length; i++) {
      arr.push(data.Tags[i]);
    }

    mutation.mutate(arr);
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
        <NameP>Tags</NameP>
        {fields?.map((item, index) => (
          <div key={item.id} style={{ display: "flex" }}>
            <IngrInput
              {...register(`Tags.${index}`)}
              placeholder="Ingredient Name"
              defaultValue={item.name}
            />

            <DeleteIngr
              type="button"
              onClick={() => {
                remove(index);
                defaultItemsGenerated.current = true;
                setRemoveClicked(!removeClicked);
              }}
            >
              Remove
            </DeleteIngr>
          </div>
        ))}
        <IngredientButton type="button" onClick={() => append({})}>
          Add Tags
        </IngredientButton>
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

const IngrInput = styled.input`
  padding: 10px;
  width: 40%;
  margin: 0px 0 10px 18px;
  outline: none;
`;

const DeleteIngr = styled.button`
  all: unset;
  width: 60px;
  height: 30px;
  background-color: ${COLORS.red};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  margin-left: 4px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const IngredientButton = styled.button`
  all: unset;
  width: 80px;
  height: 40px;
  background-color: ${COLORS.lightBlue};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  margin-top: 8px;
  margin-left: 18px;
  margin-bottom: 30px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
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
