import { API } from "../RestaurantAPI";
async function testBackendClient() {

    const registrationSuccess = await API.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassworD1*',
    });
    console.log('Registration:', registrationSuccess);

    const loginSuccess = await API.login('test@example.com', 'testpassworD1*');
    console.log('Login:', loginSuccess);

    // Get Restaurants
    const restaurants = await API.getRestaurants();
    console.log('Restaurants:', restaurants.length > 0);

    // Get Restaurant by ID
    const restaurantById = await API.getRestaurantById(1);
    console.log('Restaurant by ID:', restaurantById !== null);

    // Get Restaurant by Title
    const restaurantByTitle = await API.getRestaurantByTitle('McDonalds');
    console.log('Restaurant by Title:', restaurantByTitle !== null);

    // Get Top Restaurants
    const topRestaurants = await API.getTopRestaurants(5);
    console.log('Top Restaurants:', topRestaurants.length > 0);

    // Get Restaurants by Page and Quantity
    const restaurantsByPageAndQuantity = await API.getRestaurantsByPageAndQuantity(2, 10);
    console.log('Restaurants by Page and Quantity:', restaurantsByPageAndQuantity.length > 0);

    // Search Restaurants
    const searchedRestaurants = await API.searchRestaurants('Pizza');
    console.log('Searched Restaurants:', searchedRestaurants.length > 0);

    // Get Restaurants by Tag
    const restaurantsByTag = await API.getRestaurantsByTag('Italian');
    console.log('Restaurants by Tag:', restaurantsByTag.length > 0);

    // Get Image
    const image = await API.getImage('_103039565_tinycat.jpg');
    console.log('Image:', image !== null);

    // Edit Email Test
    const editEmailData = {
        email: 'newemail1@example.com',
        password: 'testpassworD1*',
    };
    const editEmailSuccess = await API.editEmail(editEmailData);
    console.log('Edit Email:', editEmailSuccess);

    // Edit Phone Test
    const editPhoneData = {
        phone: '1234567890',
        password: 'testpassworD1*',
    };
    const editPhoneSuccess = await API.editPhone(editPhoneData);
    console.log('Edit Phone:', editPhoneSuccess);

    // Create Order Test
    const orderItem = {
        dishId: 1,
        notes: 'Extra cheese',
    };
    const orderData = {
        restaurantId: 1,
        orderItems: [orderItem],
    };
    const createOrderSuccess = await API.createOrder(orderData);
    console.log('Create Order:', createOrderSuccess);

    // Delete Account Test
    const deleteAccountData = {
        password: 'testpassworD1*',
    };

    const deleteAccountSuccess = await API.deleteAccount(deleteAccountData);
    console.log('Delete Account:', deleteAccountSuccess);
}

testBackendClient();