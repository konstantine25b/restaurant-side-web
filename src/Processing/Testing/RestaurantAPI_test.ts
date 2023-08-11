import { API } from "../RestaurantAPI";
async function testBackendClient() {
    const loginSuccess = await API.login('kfcadmin@prestoreserve.ge', '9kp3QMQP&#LOw{p');
    console.log('Login:', loginSuccess);

    if (loginSuccess) {
        //Test getOwnedRestaurant
        const getOwnedRestaurantSuccess = await API.getOwnedRestaurant();
        console.log('Get owned restaurant:', getOwnedRestaurantSuccess!=-1);

        // Test updateRestaurant
        const updateRestaurantSuccess = await API.updateRestaurant(4, {
            shortdescription: 'New description',
            address: '123 New St, City',
        });
        console.log('Update Restaurant:', updateRestaurantSuccess);

        // Test updateCategory
        const updateCategorySuccess = await API.updateCategory(7, {
            title: 'Burgera',
            description: 'New category description',
        });
        console.log('Update Category:', updateCategorySuccess);

        // Test deleteCategory
        const deleteCategorySuccess = await API.deleteCategory(7, 'Burgers');
        console.log('Delete Category:', deleteCategorySuccess);

        // Test updateDish
        const updateDishSuccess = await API.updateDish(8, {
            title: 'New Cheesburger',
            price: 8,
        });
        console.log('Update Dish:', updateDishSuccess);

        // Test deleteDish
        const deleteDishSuccess = await API.deleteDish(8, 'New Cheesburger');
        console.log('Delete Dish:', deleteDishSuccess);


        // Test addCategoryToRestaurant
        const addCategorySuccess = await API.addCategoryToRestaurant(4, {
            title: 'New Category',
            description: 'New category added',
            image: 'new_category_image.jpg',
        });
        console.log('Add Category:', addCategorySuccess);

        // Test addDishToCategory
        const addDishSuccess = await API.addDishToCategory(7, {
            title: 'New Dish',
            price: 10,
            approxtime: 15,
            description: 'New dish added',
            image: 'new_dish_image.jpg',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            categoryId: 1,
        });
        console.log('Add Dish:', addDishSuccess);
    }
}

testBackendClient();