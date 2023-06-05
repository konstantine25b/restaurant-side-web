import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Root from "./components/Root";
import MainImage from "./components/pages/MainImage";
import HomePage from "./components/pages/HomePage";
import Categories from "./components/pages/Categories";
import AddCategories from "./components/pages/AddCategories";
import Products from "./components/pages/Products";
import AddProduct from "./components/pages/AddProduct";
import LoginPage from "./components/pages/LoginPage";
import { createContext, useState } from "react";
import CorrectProduct from "./components/pages/CorrectProducts";
import CorrectCategories from "./components/pages/CorrectCategories";
import DetailsPage from "./components/pages/DetailsPage";
import Address from "./components/pages/Address";
import FullRestInfo from "./components/pages/FullRestInfo";
import Description from "./components/pages/Description";
import Tags from "./components/pages/Tags";



export const UserContext = createContext(null);
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index={true} element={<LoginPage />} />
      <Route path="/HomePage" element={<Root />}>
        <Route index={true} element={<HomePage />} />
        <Route path="/HomePage/MainImage" element={<MainImage />} />
        <Route path="/HomePage/Categories" element={<Categories />} />
        <Route
          path="/HomePage/Categories/AddCategories"
          element={<AddCategories />}
        />
        <Route
          path="/HomePage/Categories/CorrectCategories"
          element={<CorrectCategories />}
        />

        <Route path="/HomePage/Products" element={<Products />} />
        <Route path="/HomePage/Products/AddProduct" element={<AddProduct />} />
        <Route path="/HomePage/Products/Details" element={<DetailsPage />} />
        <Route path="/HomePage/Products/CorrectProduct" element={<CorrectProduct />} />


        <Route path="/HomePage/FullRestInfo" element={<FullRestInfo />} />
        <Route path="/HomePage/Address" element={<Address />} />
        <Route path="/HomePage/Description" element={<Description />} />
        <Route path="/HomePage/RestaurantTags" element={<Tags/>} />
      </Route>
    </Route>
  )
);

function App() {

  const [isLoggedIn, setIsLoggedIn]= useState(false)
  // const[mainUser,setMainUser] = useState(null)
  return (

    // amit anu usercontext provideri gadascems imas shesulia tu ara useri
    // <UserContext.Provider
    //   value={{
    //     isLoggedIn: isLoggedIn,
    //     setIsLoggedIn,
    //     // mainUser: mainUser,
    //     // setMainUser,
    //   }}
    // >
      <RouterProvider router={router} />
    // </UserContext.Provider>
  );
}

export default App;
