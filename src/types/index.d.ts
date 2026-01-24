export interface ValidationErrors {
    [key: string]: string;
};

export interface UserTypo {
    slug: string;
    name: string;
    email: string;
    password: string;
    gender: "male" | "female";
    role: "admin" | "customer"
};

export interface ProductTypo {
    slug: string;
    name: string;
    description: string,
    image: string,
    colors: string[];
    categories: string[];
    sizes: string[];
    price: number;
    oldPrice?: number,
    discount?: number,
    status: "0" | "1"
};