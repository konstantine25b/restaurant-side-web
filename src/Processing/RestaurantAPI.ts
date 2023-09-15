import axios from 'axios';
import {OrderData, PrestoAPI} from "./PrestoAPI";

interface RestaurantUpdateData {
    shortdescription?: string;
    description?: string;
    address?: string;
    images?: string[];
    tags?: string[];
}

interface CategoryUpdateData {
    title?: string;
    description?: string;
    image?: string;
}

interface DishUpdateData {
    categoryId?: number;
    title?: string;
    price?: number;
    approxtime?: number;
    description?: string;
    image?: string;
    ingredients?: string[];
    available?: boolean;
}

interface CategoryAddData {
    title: string;
    description: string;
    image: string;
}

interface DishAddData {
    title: string;
    price: number;
    approxtime: number;
    description: string;
    image: string;
    ingredients: string[];
    categoryId: number;
    available?: boolean;
}

interface OrderDataResponse extends OrderData {
    orderState: number;
}

export class RestaurantAPI extends PrestoAPI{
        async getRestaurantOrders(id: number): Promise<OrderData[]> {
        await this.loginIfNeeded();
        try {
            const response = await axios.get(`${this.baseUrl}/restaurant/${id}/orders`, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return response.data;
        } catch (error) {
            return [];
        }
    }

    async confirmOrDenyRestaurantOrder(orderId: number, action:boolean): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.patch(`${this.baseUrl}/order/${orderId}/${action}`, null, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async deleteRestaurantOrder(orderId: number): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.delete(`${this.baseUrl}/order/${orderId}`, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getOwnedRestaurant(): Promise<number>{
        await this.loginIfNeeded();
        try{
            const response = await axios.get(`${this.baseUrl}/restaurant/owner`, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return response.data;
        }
        catch (error){
            return -1;
        }
    }

    async updateRestaurant(id: number, data: RestaurantUpdateData): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.patch(`${this.baseUrl}/restaurant/id/${id}`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async updateCategory(id: number, data: CategoryUpdateData): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.patch(`${this.baseUrl}/category/${id}`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async deleteCategory(id: number, categoryName: string): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.delete(`${this.baseUrl}/category/${id}`, {
                data: categoryName,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async updateDish(id: number, data: DishUpdateData): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.patch(`${this.baseUrl}/dish/${id}`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async deleteDish(id: number, dishName: string): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.delete(`${this.baseUrl}/dish/${id}`, {
                data: dishName,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async uploadImage(id: number, image: File): Promise<string> {
        await this.loginIfNeeded();
        const formData = new FormData();
        formData.append('file', image);
        try {
            const a = await axios.put(`${this.baseUrl}/restaurant/${id}/uploadimage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${this.token}`,
                },
            });
            return a.data;
        } catch (error) {
            return "";
        }
    }

    async addCategoryToRestaurant(id: number, data: CategoryAddData): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.put(`${this.baseUrl}/restaurant/${id}/addcategory`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async addDishToCategory(id: number, data: DishAddData): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.put(`${this.baseUrl}/category/${id}/adddish`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Usage
export var API = new RestaurantAPI('https://api.prestoreserve.ge')