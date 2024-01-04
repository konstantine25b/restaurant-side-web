import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import COLORS from "../../../themes/colors";
import styled from "@emotion/styled";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import "./MainImage.css";
// import { addDish, updateDish, uploadImage } from "../../Processing/Database";
import { API } from "../../../Processing/RestaurantAPI";

export default function CorrectProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const newUrl = useRef("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const uploadLink = useRef("");
  // aq indexebit momaqvs imitom rom mere martivad vipovo restionfos categoriebshi
  const { restInfo, categoryIndex, dishIndex } = state;
  // es konkretulad dishes mtel infos igebs
  const dishInfo = restInfo.categories[categoryIndex].dishes[dishIndex];

  const [selectedFile, setSelectedFile] = useState(null);

  // amas viyeneb rom titoeuli categois saxelis id gavigo
  let categoryMap = new Map();
  //am metodit xdeba categoriebis ids gagaeba romelic unda gadavce dishebis damatebis funqcias
  restInfo?.categories?.forEach((item) => {
    categoryMap.set(item.title, item.id);
    // Force a render by setting the state.
  });

  useEffect(() => {
    handleFileUpload(selectedFile);
    // .then((url) => {
    //   newUrl.current = url;
    // });
  }, [selectedFile]);
  const firstData = {
    Category: restInfo.categories[categoryIndex].title,
    NameEng: dishInfo.title,
    dishId: dishInfo.id,
    img: dishInfo.image,
    Description: dishInfo.description,
    AproxTime: dishInfo.approxtime,
    ingredients: dishInfo.ingredients,
    Price: dishInfo.price,
    Availability: dishInfo.availability,
  };
  // useEffect(()=>{
  // console.log(dishInfo)
  // },[dishInfo])

  const handleUpdateDish = async (
    updateDishID,
    updateDishTitle,
    updateDishPrice,
    uploadLink,
    approxtime,
    description,
    ingredients,
    categoryId
  ) => {
    const updateDishData = {
      title: updateDishTitle,
      price: parseInt(updateDishPrice),
      image: uploadLink,
      approxtime: approxtime,
      description: description,
      ingredients: ingredients,
      categoryId: categoryId,
      avaible: true,
    };

    console.log(updateDishID, updateDishData);
    const updateDishSuccess = await API.updateDish(
      updateDishID,
      updateDishData
    );
    alert(
      updateDishSuccess ? "Dish updated successfully!" : "Dish update failed."
    );
  };

  const onSubmit = (data) => {
    let imgLink = uploadLink.current == "" ? firstData.img : uploadLink.current;
    let arr = [];

    for (let i = 0; i < fields.length; i++) {
      arr.push(data.ingredients[i]);
    }
    console.log(data.AproxTime);
    // console.log(dishInfo.id, data.NameEng, data.Price, imgLink )
    handleUpdateDish(
      dishInfo.id,
      data.NameEng,
      data.Price,
      imgLink,
      data.AproxTime,
      data.Description,
      data.ingredients !== undefined ? arr : [], //Undefined check
      categoryMap.get(data.Category)
    ).then(() => {
      window.location.reload(true);
      navigate(-1);
    });

    // updateDish(
    //   data.Category,
    //   firstData.NameEng,
    //   data.NameEng,
    //   data.Description,
    //   imgLink,
    //   data.AproxTime,
    //   data.ingredients !== undefined ? arr : [], //Undefined check
    //   data.Price,
    //   dishInfo.Availability
    // ).then(() => {
    //   window.location.reload(true);
    //   navigate(-1);
    // });
  };

  console.log(dishInfo);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const defaultItemsGenerated = useRef(false);

  const handleFileUpload = async (image) => {
    if (image) {
      const uploadSuccess = await API.uploadImage(restInfo.id, image); // Replace with the correct restaurant ID
      if (uploadSuccess !== "") {
        console.log("success upload image");
        uploadLink.current = uploadSuccess;
      } else {
        console.log("failed upload image");
      }
    }
  };

  // amit xdeba damateba ingredientebis tu aqvs ukve ogond defaultebis
  useEffect(() => {
    if (
      dishInfo?.ingredients?.length > 0 &&
      defaultItemsGenerated.current == false
    ) {
      dishInfo.ingredients.forEach((item) => {
        append({ name: item });
      });
      defaultItemsGenerated.current = true;
    }
  }, [dishInfo]);

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  const categories = restInfo.categories.map((item) => {
    return item.title;
  });

  const Select = React.forwardRef(
    ({ onChange, onBlur, name, valueData }, ref) => (
      <>
        <Select1
          defaultValue={restInfo.categories[categoryIndex].title}
          name={name}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
        >
          {valueData?.map((value, index) => {
            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
        </Select1>
      </>
    )
  );

  return (
    <MainDiv>
      <Top>
        <BackButton
          onClick={() => {
            onSubmit(firstData);
            // console.log(firstData)
          }}
        >
          <ArrowLeftIcon style={{ width: 20, color: "white" }} />
        </BackButton>
        <TopP>Add or Correct Product Info</TopP>
      </Top>
      <Bottom onSubmit={handleSubmit(onSubmit)}>
        <NameP>Name (English)</NameP>
        <NameInput
          defaultValue={dishInfo.title}
          {...register("NameEng", { required: true })}
        />
        {errors.NameEng?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            English Name is required
          </p>
        )}
        <NameP>Name (Georgian)</NameP>
        <NameInput
          defaultValue={dishInfo.title}
          placeholder="Add Product Name (Georgian)"
          {...register("NameGeo", { required: true })}
        />
        {errors.NameGeo?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            Georgian Name is required
          </p>
        )}

        <NameP>Price (Gel)</NameP>
        <NameInput
          defaultValue={dishInfo.price}
          placeholder="0"
          {...register("Price", { required: true, pattern: /^\d+$/ })}
        />
        {errors.Price?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            price is required
          </p>
        )}

        <NameP>Approximate Time (Minutes)</NameP>
        <NameInput
          defaultValue={dishInfo.approxtime}
          placeholder="0"
          {...register("AproxTime", { required: true, pattern: /^\d+$/ })}
        />
        {errors.AproxTime?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            price is required
          </p>
        )}

        <NameP> Description</NameP>
        <NameInput
          defaultValue={dishInfo.description}
          placeholder="Add small description"
          {...register("Description", {})}
        />

        <NameP>Category Name</NameP>
        <Select valueData={categories} {...register("Category")} />

        <NameP>Ingredients</NameP>
        {fields.map((item, index) => (
          <div key={item.id} style={{ display: "flex" }}>
            <IngrInput
              {...register(`ingredients.${index}`)}
              placeholder="Ingredient Name"
              defaultValue={item.name}
            />

            <DeleteIngr type="button" onClick={() => remove(index)}>
              Remove
            </DeleteIngr>
          </div>
        ))}
        <IngredientButton type="button" onClick={() => append({})}>
          Add Ingredients
        </IngredientButton>

        <NameP style={{ marginBottom: -10 }}>Picture</NameP>
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
          {selectedFile && (
            <img
              className="selected-file-preview"
              src={URL.createObjectURL(selectedFile)}
              alt={selectedFile.name}
            />
          )}
          {!selectedFile?.name && (
            <img className="selected-file-preview" src={dishInfo.image} />
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
  padding-bottom: 50px;
  margin-bottom: 50px;
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

const IngrInput = styled.input`
  padding: 10px;
  width: 40%;
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

const Select1 = styled.select`
  outline: none;
  width: 200px;
  padding: 10px;
  margin-left: 18px;
  margin-bottom: 10px;
`;
