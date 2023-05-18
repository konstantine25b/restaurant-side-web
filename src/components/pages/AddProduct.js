import React, { useEffect, useState } from "react";
import COLORS from "../../themes/colors";
import styled from "@emotion/styled";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm,useFieldArray } from "react-hook-form";
import "./MainImage.css";


export default function AddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm();
  const onSubmit = (data) => console.log(data);
  const navigate = useNavigate();

  const { state } = useLocation();
  const { restInfo } = state;

 
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
    
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  const categories = restInfo.FoodCategories.map((item) => {
    return item.Title;
  });

  const Select = React.forwardRef(
    ({ onChange, onBlur, name, valueData }, ref) => (
      <>
        <Select1 name={name} ref={ref} onChange={onChange} onBlur={onBlur}>
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
            navigate(-1);
          }}
        >
          <ArrowLeftIcon style={{ width: 20, color: "white" }} />
        </BackButton>
        <TopP>Add or Correct Product Info</TopP>
      </Top>
      <Bottom onSubmit={handleSubmit(onSubmit)}>
        <NameP>Name (English)</NameP>
        <NameInput
          placeholder="Add Product Name (English)"
          {...register("NameEng", { required: true })}
        />
        {errors.NameEng?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            English Name is required
          </p>
        )}
        <NameP>Name (Georgian)</NameP>
        <NameInput
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
          placeholder="0"
          {...register("Price", { required: true, pattern: /^\d+$/ })}
        />
        {errors.Price?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            price is required
          </p>
        )}

        <NameP>Aprroximate Time (Minutes)</NameP>
        <NameInput
          placeholder="0"
          {...register("AproxTime", { required: true, pattern: /^\d+$/ })}
        />
        {errors.AproxTime?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            price is required
          </p>
        )}

        <NameP> Desctiption</NameP>
        <NameInput
          placeholder="Add small description"
          {...register("Description", {})}
        />



        <NameP>Category Name</NameP>
        <Select valueData={categories} {...register("Category")} />


        <NameP>Ingredients</NameP>
        {fields.map((item, index) => (
        <div key={item.id} style = {{display: 'flex'}}>
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
        </div>
        {!selectedFile?.name && (
          <p
            style={{
              color: "yellow",
              margin: 0,
              marginTop: -10,
              paddingLeft: 18,
            }}
            role="alert"
          >
            picture is not selected
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
`
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
`



const Select1 = styled.select`
  outline: none;
  width: 200px;
  padding: 10px;
  margin-left: 18px;
  margin-bottom: 10px;
`;
