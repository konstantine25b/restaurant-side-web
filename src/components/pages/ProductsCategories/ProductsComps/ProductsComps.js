import React from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../../Processing/PrestoAPI";
import styled from "@emotion/styled";
import COLORS from "../../../../themes/colors";

export default function ProductsComps({
  restInfo,
  index1,
  index,
  handleChangeAvaibility,
  dish,
  item,
}) {
  const navigate = useNavigate();

  const handleDelete = (deleteDishID, deleteDishTitle) => {
    if (window.confirm("Are you sure you want to delete?")) {
      handleDeleteDish(deleteDishID, deleteDishTitle).then(() => {
        window.location.reload(true);
      });
    }
  };
  const handleDeleteDish = async (deleteDishID, deleteDishTitle) => {
    const deleteDishSuccess = await API.deleteDish(
      deleteDishID,
      deleteDishTitle
    );
    alert(
      deleteDishSuccess ? "Dish deleted successfully!" : "Dish deletion failed."
    );
  };

  return (
    <Bottom1 key={index + dish.title}>
      <BottomItem1>{dish.title}</BottomItem1>
      <CorrectionButton
        onClick={() => {
          navigate(`/HomePage/Products/Details`, {
            state: {
              restInfo: restInfo,
              categoryIndex: index1,
              dishIndex: index,
            },
          });
        }}
      >
        See full details
      </CorrectionButton>
      {dish.available ? (
        <BottomItemAvaible1
          onClick={() => handleChangeAvaibility(dish, item.Title, false)}
        >
          Available
        </BottomItemAvaible1>
      ) : (
        <BottomItemAvaible2
          onClick={() => handleChangeAvaibility(dish, item.Title, true)}
        >
          Not Available
        </BottomItemAvaible2>
      )}

      <CorrectionButton
        onClick={() => {
          navigate(`/HomePage/Products/CorrectProduct`, {
            state: {
              restInfo: restInfo,
              categoryIndex: index1,
              dishIndex: index,
              Img: dish.Image,
            },
          });
        }}
      >
        Correcting
      </CorrectionButton>
      <DeleteButton onClick={() => handleDelete(dish.id, dish.title)}>
        Delete
      </DeleteButton>
    </Bottom1>
  );
}

const Bottom1 = styled.ul`
  all: unset;
  width: 100%;
  display: flex;

  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.light};
  border: 0.5px solid ${COLORS.insideBlue};
  margin: 0px;
  padding: 0px;
`;

const BottomItem1 = styled.li`
  all: unset;
  padding: 15px;
  box-sizing: border-box !important;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 5) !important;
`;

const BottomItemAvaible1 = styled.li`
  all: unset;
  padding: 15px;
  box-sizing: border-box !important;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 5) !important;
  background-color: ${COLORS.green};
  color: ${COLORS.lightBlue};
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const BottomItemAvaible2 = styled.li`
  all: unset;
  padding: 15px;
  box-sizing: border-box !important;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 5) !important;
  background-color: ${COLORS.iconColor};
  color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const CorrectionButton = styled.li`
  all: unset;
  height: 100% !important;
  padding: 15px;
  background-color: ${COLORS.lightBlue};
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 6);
  text-align: center;
  color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
const DeleteButton = styled.li`
  all: unset;
  padding: 15px;
  background-color: ${COLORS.red};
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 6);
  text-align: center;
  color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
