
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import Root from './components/Root';
import MainImage from './components/pages/MainImage';
import HomePage from './components/pages/HomePage';
import Categories from './components/pages/Categories';
import AddCategories from './components/pages/AddCategories';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = '/' element={<Root/>}>
       <Route index={true}  element={<HomePage/>}/>
       <Route path="/MainImage"  element={<MainImage/>}/>
       <Route path="/Categories"  element={<Categories/>}/>
       <Route path="/Categories/AddCategories"  element={<AddCategories/>}/>
      
    </Route>
    

    
  )
)

function App() {
  return (
    <RouterProvider router = {router}/>
    
  );
}



export default App;
