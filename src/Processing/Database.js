import {initializeApp} from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    updateEmail,
    reauthenticateWithCredential} from "firebase/auth";
import {collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc} from 'firebase/firestore/lite';

//region Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyB5MS581oLJ-ruKvabtoDCinZv1NWgQrNs",
    authDomain: "restaurant-app-ge.firebaseapp.com",
    projectId: "restaurant-app-ge",
    storageBucket: "restaurant-app-ge.appspot.com",
    messagingSenderId: "740579522082",
    appId: "1:740579522082:web:957cd0ba3d5b27e39cbc7b",
    measurementId: "G-6NV22X0T27"
};

const app= initializeApp(firebaseConfig);

//endregion

//region Firebase Auth
const auth = getAuth();
let user;

/**
 * Sign up with email and password
 * @param email - email address
 * @param password - password
 */
export const signUp = (email, password)=>{
    return createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials =>{
            user = userCredentials.user
            console.log(user.email + " just signed up.")
        })
        .catch(error => alert(error.message))
}
/**
 * Sign in with email and password
 * @param email - email address
 * @param password - password
 */
export const signIn = (email, password)=>{
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials =>{
            user = userCredentials.user
            console.log(user.email + " just signed in.")
        })
        .catch(error => alert(error.message))
}
/**
 * Sign out the current user
 */
export const signOut = ()=>{
    auth.signOut()
        .then(() => {
            user = null
            console.log("User signed out.")
        })
        .catch(error => alert(error.message))
}
/**
 * Get the current user (local)
 * @returns {*} - user object
 */
export const getUser = ()=>{
    return user
}

/**
 * Subscribe to user login/out event and call the callback function
 * @param callback {function} - function to be called when user logs in
 */
export const subscribeToLogInEvent = (callback)=>{
    auth.onAuthStateChanged((usr)=>{callback(usr)});
}

/**
 * Reset password. Send a reset password email to the user
 * @param email - email address
 * @param resetPasswordEvent - callback function. Must accept a boolean parameter.
 */
export const resetPassword = (email, resetPasswordEvent)=>{
    console.log("Reset password for " + email);
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Reset password email sent to " + email)
            resetPasswordEvent(true);
        })
        .catch((error) => {
            console.log("Error sending reset password email to " + email)
            resetPasswordEvent(false);
            throw error;
        });
}
/**
 * Update password
 * @param oldpassword - old password
 * @param password - new password
 * @param changePasswordEvent - callback function. Must accept a boolean parameter.
 */
export const updateUserPassword = (oldpassword, password, changePasswordEvent)=>{
    reauthenticate(oldpassword, (success)=>{
        if(success){
            console.log("Reauthentication successful.")
            updatePassword(user, password)
                .then(() => {
                    console.log("Password updated.")
                    changePasswordEvent(true)
                })
                .catch((error) => {
                    console.log(error.log);
                    changePasswordEvent(false)
                });
        }
        else{
            changePasswordEvent(false)
        }
    })
}
/**
 * Check if the user is verified.
 * @returns {boolean}
 */
export const checkIfUserIsVerified = ()=>{
    return user.emailVerified;
}
/**
 * Send a verification email to the user
 * @param verificationEmailEVent - callback function. Must accept a boolean parameter.
 */
export const sendVerificationEmail = (verificationEmailEVent)=>{
    sendEmailVerification(user)
        .then(() => {
            verificationEmailEVent(true)
        })
        .catch((error) => {
            console.log(error.log);
            verificationEmailEVent(false)
        });
}
/**
 * Update email
 * @param oldpassword - old password
 * @param email - new email
 * @param updateEmailEvent - callback function. Must accept a boolean parameter.
 */
export const updateUserEmail = (oldpassword, email, updateEmailEvent)=>{
    reauthenticate(oldpassword, (success)=>{
        if(success){
            console.log("Reauthentication successful.")
            updateEmail(user, email)
                .then(() => {
                    console.log("Email updated.")
                    updateEmailEvent(true)
                })
                .catch((error) => {
                    console.log(error.log);
                    updateEmailEvent(false)
                });
        }
        else{
            updateEmailEvent(false)
        }
    })
}
/**
 * Reauthenticate the user. Use this before updating email or password.
 * @param password - password
 * @param reauthenticateEvent - callback function. Must accept a boolean parameter.
 */
export const reauthenticate = (password, reauthenticateEvent)=>{
    const credential = auth.EmailAuthProvider.credential(user.email, password)
    reauthenticateWithCredential(user, credential)
        .then(() => {
            reauthenticateEvent(true)
        })
        .catch((error) => {
            console.log(error.log);
            reauthenticateEvent(false)
        });
}
//endregion

//region Firebase Database
const db = getFirestore(app);

let RestaurantStorage;
let FullRestaurantStorage = {};
let EditableRestaurant;
let OwnedRestaurant;

//region administration
/**
 * Get the restaurant that the user can edit.
 * @returns {Promise<*|null>}
 */
export const getRestaurantAdmin = async () => {
    if (EditableRestaurant !== null && EditableRestaurant !== undefined) {
        console.log(EditableRestaurant + " is the editable restaurant.");
        return EditableRestaurant;
    }
    const superUsersCol = collection(db, 'SuperUsers');
    const superUsersSnapshot = await getDocs(superUsersCol);
    const superUsers = superUsersSnapshot.docs.map(doc => doc.data());
    const superUsersId = superUsersSnapshot.docs.map(doc => doc.id);
    for (let i = 0; i < superUsers.length; i++) {
        const restaurant = superUsers[i];
        const id = superUsersId[i];
        if (restaurant.Owner === user.email || restaurant.Editors.includes(user.email)) {
            EditableRestaurant = id;
            return id;
        }
    }
    return null;
}
/**
 * Get the restaurant that the user owns.
 * @returns {Promise<*|null>}
 */
export const getRestaurantOwner = async () => {
    if (OwnedRestaurant !== null && OwnedRestaurant !== undefined) {
        return OwnedRestaurant;
    }
    const superUsersCol = collection(db, 'SuperUsers');
    const superUsersSnapshot = await getDocs(superUsersCol);
    const superUsers = superUsersSnapshot.docs.map(doc => doc.data());
    const superUsersId = superUsersSnapshot.docs.map(doc => doc.id);
    for (let i = 0; i < superUsers.length; i++) {
        const restaurant = superUsers[i];
        const id = superUsersId[i];
        if (restaurant.Owner === user.email) {
            OwnedRestaurant = id;
            return id;
        }
    }
    return null;
}

export const editRestaurant = async (restaurantId, Address, Genre, MainImage, ShortDescription, Tags) => {
    await getRestaurantOwner();
    if(OwnedRestaurant === null || OwnedRestaurant === undefined){
        throw new Error("You do not own a restaurant.");
    }
    const restaurantRef = doc(db, "Restaurants", restaurantId);
    const restaurantSnapshot = await getDoc(restaurantRef);
    const resaurantRefFull = doc(db, "RestaurantsFull", restaurantId);
    const restaurantSnapshotFull = await getDoc(resaurantRefFull);
    console.log(restaurantSnapshot.exists());
    if (restaurantSnapshot.exists()) {
        await updateDoc(restaurantRef, {
            Address: Address,
            Genre: Genre,
            MainImage: MainImage,
            ShortDescription: ShortDescription,
            Tags: Tags,
            Title: restaurantId
        });
    }
    if (restaurantSnapshotFull.exists()) {
        await updateDoc(resaurantRefFull, {
            Address: Address,
            Genre: Genre,
            MainImage: MainImage,
            ShortDescription: ShortDescription,
            Tags: Tags,
            Title: restaurantId
        });
    }
}

/**
 * Adds a SuperUser to the restaurant.
 * @param email
 * @returns {Promise<void>}
 */
export const addSuperUser = async (email) => {
    const restaurantId = await getRestaurantOwner();
    if (restaurantId !== null) {
        const restaurantRef = doc(db, "SuperUsers", restaurantId);
        const restaurantSnapshot = await getDoc(restaurantRef);
        if (restaurantSnapshot.exists()) {
            const restaurantData = restaurantSnapshot.data();
            const editors = restaurantData.Editors;
            editors.push(email);
            await updateDoc(restaurantRef, {
                Editors: editors
            });
        }
    }
}
/**
 * Add a new category to the restaurant.
 * @returns {Promise<void>}
 * @param Title
 * @param Description
 * @param Image
 */
export const addCategory = async (Title, Description, Image) => {
    let dishes = [];
    const restaurantId = await getRestaurantAdmin();
    const restaurantRef = doc(db, "RestaurantsFull", restaurantId);
    const restaurantSnapshot = await getDoc(restaurantRef);
    if (restaurantSnapshot.exists()) {
        const restaurantData = restaurantSnapshot.data();
        const categories = restaurantData.FoodCategories;
        //add the category to the array
        categories.push({Title: Title, Description: Description, Image: Image, dishes: dishes});
        for (const key in categories) {
            console.log(categories[key]);
        }
        await updateDoc(restaurantRef, {
            FoodCategories: categories
        });
        FullRestaurantStorage[restaurantId] = restaurantData;
    }
    else{
        throw new Error("Restaurant doesn't exist");
    }
}
/**
 * Delete a category in the restaurant.
 * @param categoryName
 * @returns {Promise<void>}
 */
export const deleteCategory = async (categoryName) => {
    const restaurantId = await getRestaurantAdmin();
    const restaurantRef = doc(db, "RestaurantsFull", restaurantId);
    const restaurantSnapshot = await getDoc(restaurantRef);
    if (restaurantSnapshot.exists()) {
        const restaurantData = restaurantSnapshot.data();
        const categories = restaurantData.FoodCategories;
        //Remove the category from the array. The array is indexed by numbers, and item.Title is a string.
        for (const key in categories) {
            if (categories[key].Title === categoryName) {
                categories.splice(key, 1);
            }
        }
        await updateDoc(restaurantRef, {
            FoodCategories: categories
        });
        FullRestaurantStorage[restaurantId] = restaurantData;
    }
    else{
        throw new Error("Restaurant doesn't exist");
    }
}

/**
 * Update a category in the restaurant.
 * @returns {Promise<void>}
 * @param Title
 * @param Description
 * @param Image
 */
export const updateCategory = async (Title, Description, Image) => {
    let dishes = [];
    const restaurantId = await getRestaurantAdmin();
    const restaurantRef = doc(db, "RestaurantsFull", restaurantId);
    const restaurantSnapshot = await getDoc(restaurantRef);
    if (restaurantSnapshot.exists()) {
        const restaurantData = restaurantSnapshot.data();
        const categories = restaurantData.FoodCategories;
        //add the category to the array
        categories.push({Title: Title, Description: Description, Image: Image, dishes: dishes});
        for (const key in categories) {
            console.log(categories[key]);
        }
        await updateDoc(restaurantRef, {
            FoodCategories: categories
        });
        FullRestaurantStorage[restaurantId] = restaurantData;
    }
    else{
        throw new Error("Restaurant doesn't exist");
    }
}

/**
 * Add a dish to a category in the restaurant.
 * @returns {Promise<void>}
 * @param CategoryName
 * @param Title
 * @param Description
 * @param Image
 * @param ApproxTime
 * @param Ingredients
 * @param Price
 * @param Availability
 */
export const addDish = async (CategoryName, Title, Description, Image, ApproxTime, Ingredients, Price, Availability) => {
    const restaurantId = await getRestaurantAdmin();
    const restaurantRef = doc(db, "RestaurantsFull", restaurantId);
    const restaurantSnapshot = await getDoc(restaurantRef);
    if (restaurantSnapshot.exists()) {
        const restaurantData = restaurantSnapshot.data();
        const categories = restaurantData.FoodCategories;
        let dishes;
        let CategoryKey;
        for (const key in categories) {
            if (categories[key].Title === CategoryName) {
                dishes = categories[key].dishes;
                CategoryKey = key;
            }
        }
        if (dishes === undefined) {
            throw new Error("Category doesn't exist");
        }
        dishes.push({
            Title: Title,
            Description: Description,
            Image: Image,
            ApproxTime: ApproxTime,
            Ingredients: Ingredients,
            Price: Price,
            Availability: Availability
        });
        console.log(dishes);
        categories[CategoryKey].dishes = dishes;
        await updateDoc(restaurantRef, {
            FoodCategories: categories
        });
    }
    else{
        throw new Error("Restaurant doesn't exist");
    }
}
/**
 * Delete a dish from a category in the restaurant.
 * @param categoryName
 * @param dishName
 * @returns {Promise<void>}
 */
export const deleteDish = async (categoryName, dishName) => {
    console.log("Deleting dish" + dishName + " from category " + categoryName);
    const restaurantId = await getRestaurantAdmin();
    const restaurantRef = doc(db, "RestaurantsFull", restaurantId);
    const restaurantSnapshot = await getDoc(restaurantRef);
    if (restaurantSnapshot.exists()) {
        const restaurantData = restaurantSnapshot.data();
        const categories = restaurantData.FoodCategories;
        let dishes;
        for (const key in categories) {
            if (categories[key].Title === categoryName) {
                dishes = categories[key].dishes;
            }
        }
        if (dishes === undefined) {
            throw new Error("Category doesn't exist");
        }
        //Remove the dish from the array. The array is indexed by numbers, and item.Title is a string.
        for (const key in dishes) {
            if (dishes[key].Title === dishName) {
                dishes.splice(key, 1);
            }
        }
        await updateDoc(restaurantRef, {
            FoodCategories: categories
        });
    }
    else{
        throw new Error("Restaurant doesn't exist");
    }
}
/**
 * Update a dish in a category in the restaurant.
 * @returns {Promise<void>}
 * @param CategoryName
 * @param Title
 * @param Description
 * @param Image
 * @param ApproxTime
 * @param Ingredients
 * @param Price
 * @param Availability
 */
export const updateDish = async (CategoryName, Title, Description, Image, ApproxTime, Ingredients, Price, Availability) => {
    const restaurantId = await getRestaurantAdmin();
    const restaurantRef = doc(db, "RestaurantsFull", restaurantId);
    const restaurantSnapshot = await getDoc(restaurantRef);
    if (restaurantSnapshot.exists()) {
        const restaurantData = restaurantSnapshot.data();
        const categories = restaurantData.FoodCategories;
        let dishes;
        let CategoryKey;
        for (const key in categories) {
            if (categories[key].Title === CategoryName) {
                dishes = categories[key].dishes;
                CategoryKey = key;
            }
        }
        if (dishes === undefined) {
            throw new Error("Category doesn't exist");
        }
        dishes.push({
            Title: Title,
            Description: Description,
            Image: Image,
            ApproxTime: ApproxTime,
            Ingredients: Ingredients,
            Price: Price,
            Availability: Availability
        });
        console.log(dishes);
        categories[CategoryKey].dishes = dishes;
        await updateDoc(restaurantRef, {
            FoodCategories: categories
        });
    }
    else{
        throw new Error("Restaurant doesn't exist");
    }
}
//endregion

//region Restaurant
/**
 * Get all restaurants
 * @returns {Promise<DocumentData[]>}
 */
export const getRestaurants = async () => {
    if (RestaurantStorage !== null) {
        return RestaurantStorage;
    }
    const restaurantsCol = collection(db, 'Restaurants');
    const restaurantSnapshot = await getDocs(restaurantsCol);
    RestaurantStorage = restaurantSnapshot.docs.map(doc => doc.data());
    return RestaurantStorage;
}

/**
 * Get a restaurant by id
 * @param restaurantId
 * @returns {Promise<DocumentData>}
 */
export const getRestaurant = async (restaurantId) => {
    if (FullRestaurantStorage[restaurantId] !== undefined) {
        return FullRestaurantStorage[restaurantId];
    }
    const restaurantRef = doc(db, "RestaurantsFull", restaurantId);
    const restaurantSnapshot = await getDoc(restaurantRef);
    if (restaurantSnapshot.exists()) {
        console.log("Restaurant data:", restaurantSnapshot.data()["MainImage"]);
        FullRestaurantStorage[restaurantId] = restaurantSnapshot.data();
        return restaurantSnapshot.data();
    } else {
        console.log("No such document!");
    }
}
/**
 * Get Restaurants by name filter
 * @param restaurantName
 * @returns {Promise<DocumentData[]>}
 */
export const getRestaurantByNameFilter = async (restaurantName) => {
    if(RestaurantStorage === null){
        await getRestaurants();
    }
    return RestaurantStorage.filter(restaurant => restaurant["Title"].includes(restaurantName));
}

/**
 * Get Restaurants by category filter
 * @param restaurantCategory
 * @returns {Promise<DocumentData[]>}
 */
export const getRestaurantByCategoryFilter = async (restaurantCategory) => {
    if(RestaurantStorage === null){
        await getRestaurants();
    }
    return RestaurantStorage.filter(restaurant => restaurant["Genre"].includes(restaurantCategory));
}
export const getRestaurantByTagFilter = async (restaurantTags) => {
    if(RestaurantStorage === null){
        await getRestaurants();
    }
    return RestaurantStorage.filter(restaurant => restaurant["Tags"].includes(restaurantTags));
}
/**
 * Set a restaurant to a value by id (PRODUCTION ONLY)
 * @param restaurantId
 * @param restaurantData
 * @returns {Promise<void>}
 */
export const setRestaurant = async (restaurantId, restaurantData)=>{
    const restaurantRef = doc(db, "Restaurants", restaurantId);
    const RestaurantStorage = await getDoc(restaurantRef);
    if (RestaurantStorage.exists()) {
        //console.log("Restaurant data:", RestaurantStorage.data());
    } else {
        console.log("No such document!");
    }
    await setDoc(restaurantRef, restaurantData, {merge: true});
}

export const setRestaurantDataFull = async (restaurantId, restaurantData)=>{
    const restaurantRef = doc(db, "RestaurantsFull", restaurantId);
    const RestaurantStorage = await getDoc(restaurantRef);
    if (RestaurantStorage.exists()) {
        //console.log("Restaurant data:", RestaurantStorage.data());
    } else {
        console.log("No such document!");
    }
    await setDoc(restaurantRef, restaurantData, {merge: true});
}

/**
 * Get all Tags of a restaurant. NOTE: THIS RETURNS TAGS, DESPITE THE NAME
 * @param restaurantTitle
 * @returns {Promise<any>}
 */
export const getRestaurantCategories = async (restaurantTitle) => {
    if(RestaurantStorage === null){
        await getRestaurants();
    }
    RestaurantStorage.forEach(restaurant => {
        if (restaurant["Title"] === restaurantTitle) {
            return restaurant["Tags"];
        }
    });
    console.log("Restaurant not found. If a Restaurant was just uploaded, call the 'Refresh' function.");
    return null;
}
/**
 * Get all dishes of a category
 * @param restaurantTitle
 * @param categoryId
 * @returns {Promise<*>}
 */
export const getCategoryDishes = async (restaurantTitle, categoryId) => {
    getRestaurant(restaurantTitle).then(restaurant => {
        return restaurant["FoodCategories"][categoryId]["dishes"];
    });
    console.log("Category not found. If a Category was just uploaded, call the 'Refresh' function.");
    return null;
}
/**
 * Get a dish by id
 * @param restaurantId
 * @param categoryId
 * @param dishId
 * @returns {Promise<*>}
 */
export const getDish = async (restaurantId, categoryId, dishId) => {
    getRestaurant(restaurantId).then(restaurant => {
        return restaurant["FoodCategories"][categoryId]["dishes"][dishId];
    });
    console.log("Dish not found. If a Dish was just uploaded, call the 'Refresh' function.");
    return null;
}
//endregion

//region User
/**
 * Get User Data
 * @param userId
 * @returns {Promise<DocumentData>}
 */
export const getUserData = async (userId) => {
    const userRef = doc(db, "Users", userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
        console.log("User data:", userSnapshot.data());
        return userSnapshot.data();
    } else {
        console.log("No such document!");
    }
}
/**
 * Set a user to a value by id (PRODUCTION ONLY)
 * @param userId
 * @param userData
 * @returns {Promise<void>}
 */
export const setUserData = async (userId, userData)=>{
    const userRef = doc(db, "Users", userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
        console.log("User data:", userSnapshot.data());
    } else {
        console.log("No such document!");
    }
    await setDoc(userRef, userData, {merge: true});
}
/**
 * Create a user by id
 * @param userId
 * @param userData
 * @returns {Promise<void>}„
 */
export const createUser = async (userId, userData)=>{
    const userRef = doc(db, "Users", userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
        console.log("User data:", userSnapshot.data());
    } else {
        console.log("No such document! Creating new user...");
        await setDoc(userRef, userData);
    }
}

export const createUserFromData= async (name, email, phone, image) => {
    await createUser(email, {
        "Name": name,
        "Email": email,
        "Phone": phone,
        "Image": image,
        "Orders": [],
        "Favorites": []
    })
}

//endregion
//endregion

auth.onAuthStateChanged((usr)=>{ user = usr; });