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
import CorrectCategories from "./components/pages/CorrectCategories";


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
