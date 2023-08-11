import React, {useState} from "react";
import {API} from "../RestaurantAPI";

export const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [loginStatus, setLoginStatus] = useState('');
    const [registrationStatus, setRegistrationStatus] = useState('');

    const [restaurantId, setRestaurantId] = useState(0);
    const [restaurantTitle, setRestaurantTitle] = useState('');
    const [quantity, setQuantity] = useState('');
    const [page, setPage] = useState('');

    const [imageName, setImageName] = useState('');
    const [editEmailNew, setEditEmailNew] = useState('');
    const [editPhoneNew, setEditPhoneNew] = useState('');
    const [createOrderDishId, setCreateOrderDishId] = useState('');
    const [createOrderNotes, setCreateOrderNotes] = useState('');
    const [deleteAccountPassword, setDeleteAccountPassword] = useState('');

    const [imageData, setImageData] = useState('');

    const [getOwnedRestaurantResult, setGetOwnedRestaurantResult] = useState('');

    const [updateRestaurantID, setUpdateRestaurantID] = useState(0);
    const [updateRestaurantDescription, setUpdateRestaurantDescription] = useState('');
    const [updateRestaurantAddress, setUpdateRestaurantAddress] = useState('');

    const [updateCategoryID, setUpdateCategoryID] = useState(0);
    const [updateCategoryTitle, setUpdateCategoryTitle] = useState('');
    const [updateCategoryDescription, setUpdateCategoryDescription] = useState('');

    const [deleteCategoryID, setDeleteCategoryID] = useState(0);
    const [deleteCategoryName, setDeleteCategoryName] = useState('');

    const [updateDishID, setUpdateDishID] = useState(0);
    const [updateDishTitle, setUpdateDishTitle] = useState('');
    const [updateDishPrice, setUpdateDishPrice] = useState('');

    const [deleteDishID, setDeleteDishID] = useState(0);
    const [deleteDishTitle, setDeleteDishTitle] = useState('');

    const [image, setImage] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploadLink, setUploadLink] = useState('');

    const handleRegistration = async () => {
        const registrationSuccess = await API.register({
            username,
            email,
            password,
        });
        if (registrationSuccess) {
            setRegistrationStatus('Registration successful!');
        } else {
            setRegistrationStatus('Registration failed.');
        }
    };

    const handleLogin = async () => {
        const success = await API.login(email, password);
        if (success) {
            setLoginStatus('Login successful!');
        } else {
            setLoginStatus('Login failed.');
        }
    };

    const handleGetRestaurants = async () => {
        const restaurants = await API.getRestaurants();
        alert('Restaurants: ' + JSON.stringify(restaurants));
    };

    const handleGetRestaurantById = async () => {
        const restaurantById = await API.getRestaurantById(parseInt(restaurantId));
        alert('Restaurant by ID: ' + JSON.stringify(restaurantById));
    };

    const handleGetRestaurantByTitle = async () => {
        const restaurantByTitle = await API.getRestaurantByTitle(restaurantTitle);
        alert('Restaurant by Title: ' + JSON.stringify(restaurantByTitle));
    };

    const handleGetTopRestaurants = async () => {
        const topRestaurants = await API.getTopRestaurants(parseInt(quantity));
        alert('Top Restaurants: ' + JSON.stringify(topRestaurants));
    };

    const handleGetRestaurantsByPageAndQuantity = async () => {
        const restaurantsByPageAndQuantity = await API.getRestaurantsByPageAndQuantity(
            parseInt(page),
            parseInt(quantity)
        );
        alert('Restaurants by Page and Quantity: ' + JSON.stringify(restaurantsByPageAndQuantity));
    };

    const handleGetImage = async () => {
        const image = await API.getImage(imageName); // Replace with your actual API call
        if (image != null) {
            setImageData(image);
            alert('Opening image...');
        } else {
            console.log(image);
            alert('Image not found.');
        }
    };

    const handleEditEmail = async () => {
        const editEmailData = {
            email: editEmailNew,
            password,
        };
        const editEmailSuccess = await API.editEmail(editEmailData);
        alert(editEmailSuccess ? 'Email edited successfully!' : 'Email edit failed.');
    };

    const handleEditPhone = async () => {
        const editPhoneData = {
            phone: editPhoneNew,
            password,
        };
        const editPhoneSuccess = await API.editPhone(editPhoneData);
        alert(editPhoneSuccess ? 'Phone edited successfully!' : 'Phone edit failed.');
    };

    const handleCreateOrder = async () => {
        const orderItem = {
            dishId: parseInt(createOrderDishId),
            notes: createOrderNotes,
        };
        const orderData = {
            restaurantId: 1, // Replace with the desired restaurant ID
            orderItems: [orderItem],
        };
        const createOrderSuccess = await API.createOrder(orderData);
        alert(createOrderSuccess ? 'Order created successfully!' : 'Order creation failed.');
    };

    const handleDeleteAccount = async () => {
        const deleteAccountData = {
            password: deleteAccountPassword,
        };
        const deleteAccountSuccess = await API.deleteAccount(deleteAccountData);
        alert(deleteAccountSuccess ? 'Account deleted successfully!' : 'Account deletion failed.');
    };

    const handleFileUpload = async () => {
        if (image) {
            const uploadSuccess = await API.uploadImage(4, image); // Replace with the correct restaurant ID
            if (uploadSuccess!=="") {
                setUploadStatus('Image uploaded successfully! ');
                setUploadLink(uploadSuccess);
            } else {
                setUploadStatus('Image upload failed.');
            }
        }
    };

    const handleGetOwnedRestaurant = async () => {
        var result = await API.getOwnedRestaurant();
        setGetOwnedRestaurantResult(result !== -1 ? 'Owned restaurant found! '+result : 'No owned restaurant found.');
    };

    const handleUpdateRestaurant = async () => {
        const updateRestaurantData = {
            shortdescription: updateRestaurantDescription,
            address: updateRestaurantAddress,
        };
        const updateRestaurantSuccess = await API.updateRestaurant(updateRestaurantID, updateRestaurantData);
        alert(updateRestaurantSuccess ? 'Restaurant updated successfully!' : 'Restaurant update failed.');
    };

    const handleUpdateCategory = async () => {
        const updateCategoryData = {
            title: updateCategoryTitle,
            description: updateCategoryDescription,
        };
        const updateCategorySuccess = await API.updateCategory(updateCategoryID, updateCategoryData);
        alert(updateCategorySuccess ? 'Category updated successfully!' : 'Category update failed.');
    };

    const handleDeleteCategory = async () => {
        const deleteCategorySuccess = await API.deleteCategory(deleteCategoryID, deleteCategoryName);
        alert(deleteCategorySuccess ? 'Category deleted successfully!' : 'Category deletion failed.');
    };

    const handleUpdateDish = async () => {
        const updateDishData = {
            title: updateDishTitle,
            price: parseInt(updateDishPrice),
        };
        const updateDishSuccess = await API.updateDish(updateDishID, updateDishData);
        alert(updateDishSuccess ? 'Dish updated successfully!' : 'Dish update failed.');
    };

    const handleDeleteDish = async () => {
        const deleteDishSuccess = await API.deleteDish(deleteDishID, deleteDishTitle);
        alert(deleteDishSuccess ? 'Dish deleted successfully!' : 'Dish deletion failed.');
    };

    return (
        <div>
            <h1>Registration</h1>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleRegistration}>Register</button>
                <p>{registrationStatus}</p>
            </div>
            <h1>Login</h1>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                <p>{loginStatus}</p>
            </div>

            <h1>Get Restaurants</h1>
            <div>
                <button onClick={handleGetRestaurants}>Get Restaurants</button>
            </div>

            <h1>Get Restaurant by ID</h1>
            <div>
                <input
                    type="number"
                    placeholder="Restaurant ID"
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                />
                <button onClick={handleGetRestaurantById}>Get Restaurant by ID</button>
            </div>

            <h1>Get Restaurant by Title</h1>
            <div>
                <input
                    type="text"
                    placeholder="Restaurant Title"
                    value={restaurantTitle}
                    onChange={(e) => setRestaurantTitle(e.target.value)}
                />
                <button onClick={handleGetRestaurantByTitle}>Get Restaurant by Title</button>
            </div>

            <h1>Get Top Restaurants</h1>
            <div>
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <button onClick={handleGetTopRestaurants}>Get Top Restaurants</button>
            </div>

            <h1>Get Restaurants by Page and Quantity</h1>
            <div>
                <input
                    type="number"
                    placeholder="Page"
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <button onClick={handleGetRestaurantsByPageAndQuantity}>
                    Get Restaurants by Page and Quantity
                </button>
            </div>


            <h1>Get Image</h1>
            <div>
                <input
                    type="text"
                    placeholder="Image Name"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                />
                <button onClick={handleGetImage}>Get Image</button>
            </div>

            <div>
                {/* Display the image */}
                {imageData && <img src={imageData} alt="Debug Image" />}
            </div>

            <h1>Edit Email</h1>
            <div>
                <input
                    type="email"
                    placeholder="New Email"
                    value={editEmailNew}
                    onChange={(e) => setEditEmailNew(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleEditEmail}>Edit Email</button>
            </div>

            <h1>Edit Phone</h1>
            <div>
                <input
                    type="text"
                    placeholder="New Phone"
                    value={editPhoneNew}
                    onChange={(e) => setEditPhoneNew(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleEditPhone}>Edit Phone</button>
            </div>

            <h1>Create Order</h1>
            <div>
                <input
                    type="number"
                    placeholder="Dish ID"
                    value={createOrderDishId}
                    onChange={(e) => setCreateOrderDishId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Notes"
                    value={createOrderNotes}
                    onChange={(e) => setCreateOrderNotes(e.target.value)}
                />
                <button onClick={handleCreateOrder}>Create Order</button>
            </div>

            <h1>Delete Account</h1>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={deleteAccountPassword}
                    onChange={(e) => setDeleteAccountPassword(e.target.value)}
                />
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>

            <h1>Get Owned Restaurant</h1>
            <div>
                <button onClick={handleGetOwnedRestaurant}>Get Owned Restaurant</button>
                <p>{getOwnedRestaurantResult}</p>
            </div>

            <h1>Update Restaurant</h1>
            <div>
                <input
                    type="number"
                    placeholder="Restaurant ID"
                    value={updateRestaurantID}
                    onChange={(e) => setUpdateRestaurantID(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="New Description"
                    value={updateRestaurantDescription}
                    onChange={(e) => setUpdateRestaurantDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="New Address"
                    value={updateRestaurantAddress}
                    onChange={(e) => setUpdateRestaurantAddress(e.target.value)}
                />
                <button onClick={handleUpdateRestaurant}>Update Restaurant</button>
            </div>

            <h1>Update Category</h1>
            <div>
                <input
                    type="number"
                    placeholder="Category ID"
                    value={updateCategoryID}
                    onChange={(e) => setUpdateCategoryID(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Category Title"
                    value={updateCategoryTitle}
                    onChange={(e) => setUpdateCategoryTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Category Description"
                    value={updateCategoryDescription}
                    onChange={(e) => setUpdateCategoryDescription(e.target.value)}
                />
                <button onClick={handleUpdateCategory}>Update Category</button>
            </div>

            <h1>Delete Category</h1>
            <div>
                <input
                    type="number"
                    placeholder="Category ID"
                    value={deleteCategoryID}
                    onChange={(e) => setDeleteCategoryID(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Category Name"
                    value={deleteCategoryName}
                    onChange={(e) => setDeleteCategoryName(e.target.value)}
                />
                <button onClick={handleDeleteCategory}>Delete Category</button>
            </div>

            <h1>Update Dish</h1>
            <div>
                <input
                    type="number"
                    placeholder="Dish ID"
                    value={updateDishID}
                    onChange={(e) => setUpdateDishID(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Dish Title"
                    value={updateDishTitle}
                    onChange={(e) => setUpdateDishTitle(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Dish Price"
                    value={updateDishPrice}
                    onChange={(e) => setUpdateDishPrice(e.target.value)}
                />
                <button onClick={handleUpdateDish}>Update Dish</button>
            </div>

            <h1>Delete Dish</h1>
            <div>
                <input
                    type="number"
                    placeholder="Dish ID"
                    value={deleteDishID}
                    onChange={(e) => setDeleteDishID(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Dish Title"
                    value={deleteDishTitle}
                    onChange={(e) => setDeleteDishTitle(e.target.value)}
                />
                <button onClick={handleDeleteDish}>Delete Dish</button>
            </div>

            <h1>Upload Image</h1>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <button onClick={handleFileUpload}>Upload</button>
                <p>{uploadStatus}<a href={uploadLink}>{uploadLink}</a></p>
            </div>
        </div>
    );
};