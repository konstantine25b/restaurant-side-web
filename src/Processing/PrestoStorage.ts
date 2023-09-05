// Handles the storage of data. This class is made so that PrestoAPI.ts can remain the same accross React Native and React Web.
// React Web implementation
export class PrestoStorage {
    public static async getItem(key: string): Promise<string | null> {
        return localStorage.getItem(key);
    }
    public static async setItem(key: string, value: string): Promise <void> {
        localStorage.setItem(key, value);
    }

    public static async removeItem(key: string): Promise<void> {
        localStorage.removeItem(key);
    }
}