import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";
import COLORS from "../../themes/colors";
import { signIn, subscribeToLogInEvent } from "../../Processing/Database";

export default function LoginPage() {
  // const context = useContext(UserContext);

  const navigate = useNavigate();

  const[user, setUser] =useState(null)


  // es aris localstorageshi shenaxuli data
  const [data, setData] = useState(null);

  const [dataIsUploaded, setDataIsUploaded] = useState(false);

  // // am metods vamateb imitom rom ise iloopeboda da amitom check rom gaketdes
  // const[tempUser, setTempUser]= useState(null)

  const { register, handleSubmit, formState: { errors }} = useForm();
  const onSubmit = data => {
    // console.log(data);
    signIn(data.Email, data.Password);
    // setTempUser(tempUser);
  }

  
  useEffect(() => {
    subscribeToLogInEvent((user) => {
      setUser(user);
      // context.setMainUser(user.email);
      localStorage.setItem('User', JSON.stringify(user))
    
      // kotem daamata
      // console.log(user)
      
    });
    const savedData = localStorage.getItem("User");
    if (savedData) {
      setData(JSON.parse(savedData));
      setDataIsUploaded(true);
    }


    // console.log(user)
    // if(user){
    //   context.setIsLoggedIn(true);
    //   // console.log(context)
    // }
    // if (context?.isLoggedIn) {
    //   navigate(`/HomePage`);
    // }
  }, [user]);

  useEffect(()=>{

    if (dataIsUploaded && data) {
      setTimeout(()=>{
        navigate(`/HomePage`);
      },[500])
     
     }
  },[dataIsUploaded , data])

  return (
    
    <MainDiv>
      <FormDiv>
      <TopP>Sign In to the Fast Order</TopP>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <NameInput type="email" placeholder="Enter Your Email" {...register("Email", { required: true })} />
        {errors.Email?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            Email is required
          </p>
        )}
        <NameInput type="password"  placeholder="Enter Your Password" {...register("Password", { required: true })} />
        {errors.Password?.type === "required" && (
          <p style={{ color: "red", margin: 0, paddingLeft: 18 }} role="alert">
            Password is required
          </p>
        )}
        <SubmitInput  type="submit" value={"Sign In"}/>
      </Form>
      {/* <button
        onClick={() => {
          context?.setIsLoggedIn((current) => !current);
          console.log(context);
        }}
      >
        {context?.isLoggedIn ? "log in" : "log out"}
      </button> */}
      </FormDiv>
      </MainDiv>

  );
}

const MainDiv = styled.div`

width: 100%;
display: flex; 
align-items: center;
justify-content: center;
`;

const FormDiv = styled.div`
  width: 50%;
  margin-top: 40px;
  background-color: ${COLORS.light2};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
  margin-bottom: 50px;
  margin-top: 50px;
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
  margin-top: 38px;
  margin-left: 18px;
  margin-bottom: 30px;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;


const Form= styled.form`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TopP = styled.p`
  font-size: 20px;
`;