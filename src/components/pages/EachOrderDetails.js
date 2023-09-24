import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import COLORS from "../../themes/colors";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { API } from "../../Processing/RestaurantAPI";

const OrderDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OrderSection = styled.div`
  width: 85%;
  margin: 20px 0;
  margin-left: -8%;
  border: 2px solid #007bff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  background-color: transparent;
  transition: transform 0.2s;
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 30px;
  font-size: 18px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  transition: transform 0.2s;
  background-color: #ffff99;
`;

const OrderItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  gap: 10px;
`;

const OrderItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const OrderItemNote = styled.div`
  font-size: 14px;
  color: #888;
  margin-top: 5px;
`;

const UserId = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 15px;
`;

const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 16px;
  padding: 5px;
  margin-top: 5px;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const TitleItem = styled.div`
  flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  padding: 5px;
  color: ${(props) =>
    props.timeRemainingColor === "red"
      ? "red"
      : props.timeRemainingColor === "warning"
      ? "orange"
      : "black"};
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
const OrderItemImage = styled.img`
  width: 50px;
  height: 50px;
  border: 1px solid black; // You can adjust the border color
 
  object-fit: cover;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.1); // Add a scaling effect on hover
  }
`;

function EachOrderDetails() {
  const { state } = useLocation();
  const {
    orderItems,
    totalPrice,
    userId,
    orderNotes,
    orderSent,
    orderRequestedDate,
  } = state;
  const navigate = useNavigate();
  const [fetchedDishes, setFetchedDishes] = useState([]);

  const requestedTime = new Date(orderRequestedDate);
  // Calculate time remaining till orderRequestedDate
  const calculateTimeRemaining = () => {
    const currentTime = new Date();

    // console.log(requestedTime);

    

    if (isNaN(requestedTime)) {
      return "Invalid Date"; // Handle invalid date
    }

    const timeDiff = requestedTime - currentTime;
    // console.log(timeDiff);

    if (timeDiff <= 0) {
      // If the requested time has already passed, return "Time has passed"
      return "Time has passed";
    }

    const hours = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60))); // Ensure hours is not negative
    const minutes = Math.max(0, Math.floor((timeDiff / (1000 * 60)) % 60)); // Ensure minutes is not negative
    const seconds = Math.max(0, Math.floor((timeDiff / 1000) % 60)); // Ensure seconds is not negative

    return `${hours}:${minutes}:${seconds}`;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  async function getDishesArr() {
    
    const fetchedDishes = [];
  
    for (let i = 0; i < orderItems.length; i++) {
      const dish = await API.getDishById(orderItems[i]);
      fetchedDishes.push(dish);
      setFetchedDishes([...fetchedDishes]); // Update the state with the new dish
    }
    console.log(fetchedDishes)
  }

  
  useEffect(()=>{
    getDishesArr();
    
  },[orderItems])

  useEffect(() => {
    // Recalculate and update time remaining every second
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [orderRequestedDate]);

  return (
    <OrderDetailsContainer>
      <OrderSection>
        <BackButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeftIcon style={{ width: 20, color: "white" }} />
        </BackButton>
        <TitleContainer>
          <TitleItem>User ID: {userId}</TitleItem>
          <TitleItem>Price: ₾{totalPrice}</TitleItem>
          <TitleItem
            timeRemainingColor={
              timeRemaining.includes("Time has passed") ||
              timeRemaining.includes("Invalid Date")
                ? "red"
                : timeRemaining.startsWith("0:") ||
                  timeRemaining.startsWith("00:")
                ? "warning"
                : "black"
            }
          >
            Time Remaining: {timeRemaining}
          </TitleItem>
        </TitleContainer>

        <OrderItemContainer>
          {orderItems.map((item, index) => (
             <OrderItem key={index}>
             <OrderItemDetails>
               <div>
                 <strong>Item ID{index + 1}:</strong> {item.id}
               </div>
               <div>
                 <strong>Item Name{index + 1}:</strong>{" "}
                 {fetchedDishes[index]?.title}
               </div>
               <OrderItemNote>
                 <strong>Notes:</strong> {orderNotes[index]}
               </OrderItemNote>
             </OrderItemDetails>
             <div>
               <OrderItemImage
                 src={fetchedDishes[index]?.image}
                 alt={fetchedDishes[index]?.title}
               />
             </div>
           </OrderItem>
          ))}
        </OrderItemContainer>
        <TimeContainer>
          <div>
            <strong>Order Requested Date:</strong>{" "}
            {requestedTime.toLocaleString()}
          </div>
          <div>
            <strong>Order Sent Date:</strong>{" "}
            {orderSent ? orderSent : "Not Sent Yet"}
          </div>
        </TimeContainer>
      </OrderSection>
    </OrderDetailsContainer>
  );
}

export default EachOrderDetails;
