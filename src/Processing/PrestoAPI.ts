import axios from 'axios';

export interface RegistrationData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface EditEmailData {
    email: string;
    password: string;
}

export interface EditPhoneData {
    phone: string;
    password: string;
}

export interface OrderItem {
    dishId: number;
    notes: string;
}

export interface OrderData {
    restaurantId: number;
    orderItems: OrderItem[];
}

export interface DeleteAccountData {
    password: string;
}

export interface Dish {
    id: number;
    title: string;
    price: number;
    approxtime: number;
    description: string;
    image: string;
    ingredients: string[];
    categoryId: number;
}

export interface Category {
    id: number;
    title: string;
    description: string;
    image: string;
    restaurantId: number;
    dishes: Dish[];
}

export interface Restaurant {
    id: number;
    title: string;
    shortdescription: string;
    description: string;
    address: string;
    rating: number;
    ratingquantity: number;
    images: string[];
    tags: string[];
    categories: Category[];
}

export class PrestoAPI {
    readonly baseUrl: string;
    protected token: string | null;
    private email: string | null;
    private password: string | null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.token = null;
        this.email = null;
        this.password = null;
    }

    protected async loginIfNeeded(forced?: boolean): Promise<void> {
        if ((!this.token || forced)) {
            const storedEmail = localStorage.getItem('user_email');
            const storedPassword = localStorage.getItem('user_password');

            if (storedEmail && storedPassword) {
                this.email = storedEmail;
                this.password = storedPassword;

                const loginData: LoginData = { email: this.email, password: this.password };
                try {
                    const response = await axios.post(`${this.baseUrl}/login`, loginData);
                    this.token = response.data.token;
                } catch (error) {
                    //error handling, implement later
                }
            }
        }
    }
    async register(data: RegistrationData): Promise<boolean> {
        try {
            await axios.post(`${this.baseUrl}/register`, data);

            // Store the provided email and password
            this.email = data.email;
            this.password = data.password;

            await this.login(this.email, this.password);

            return true;
        } catch (error) {
            return false;
        }
    }

    async login(email: string, password: string): Promise<boolean> {
        const loginData: LoginData = { email, password };
        try {
            const response = await axios.post(`${this.baseUrl}/login`, loginData);
            this.token = response.data.token;
            this.email = email;
            this.password = password;

            localStorage.setItem('user_email', email);
            localStorage.setItem('user_password', password);

            console.log("Writing data to localstorage...")

            return true;
        } catch (error) {
            throw error;
            return false;
        }
    }

    async editEmail(data: EditEmailData): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.patch(`${this.baseUrl}/user/editemail`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            this.email = data.email;
            await this.loginIfNeeded(true);
            return true;
        } catch (error) {

            return false;
        }
    }

    async editPhone(data: EditPhoneData): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.patch(`${this.baseUrl}/user/editphone`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async createOrder(data: OrderData): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.post(`${this.baseUrl}/order`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {

            return false;
        }
    }

    async deleteAccount(data: DeleteAccountData): Promise<boolean> {
        await this.loginIfNeeded();
        try {
            await axios.delete(`${this.baseUrl}/user/deleteaccount`, {
                data,
                headers: { Authorization: `Bearer ${this.token}` },
            });
            // Clear stored credentials on successful account deletion
            this.token = null;
            this.email = null;
            this.password = null;
            return true;
        } catch (error) {

            return false;
        }
    }

    async getRestaurants(): Promise<Restaurant[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/restaurants`);
            return response.data;
        } catch (error) {

            return [];
        }
    }

    async getRestaurantById(id: number): Promise<Restaurant | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/restaurant/id/${id}`);
            return response.data;
        } catch (error) {

            return null;
        }
    }

    async getRestaurantByTitle(title: string): Promise<Restaurant | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/restaurant/${title}`);
            return response.data;
        } catch (error) {

            return null;
        }
    }

    async getTopRestaurants(quantity: number): Promise<Restaurant[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/restaurants/quantity/${quantity}`);
            return response.data;
        } catch (error) {

            return [];
        }
    }

    async getRestaurantsByPageAndQuantity(page: number, quantity: number): Promise<Restaurant[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/restaurants/quantity/${quantity}/page/${page}`);
            return response.data;
        } catch (error) {

            return [];
        }
    }

    async searchRestaurants(query: string): Promise<Restaurant[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/search/${query}`);
            return response.data;
        } catch (error) {

            return [];
        }
    }

    async getRestaurantsByTag(tag: string): Promise<Restaurant[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/tag/${tag}`);
            return response.data;
        } catch (error) {

            return [];
        }
    }

    async getImage(name: string): Promise<string | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/image/${name}`, { responseType: 'arraybuffer' });
            const base64Image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            console.log(base64Image)
            return `data:image/jpeg;base64,${base64Image}`;
        } catch (error) {
            console.log(error)
            return null;
        }
    }
}

// Usage
export const API = new PrestoAPI('https://api.prestoreserve.ge');