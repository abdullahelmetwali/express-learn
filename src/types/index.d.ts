export interface ValidationErrors {
    [key: string]: string;
};

export interface UserTypo {
    slug: string;
    name: string;
    email: string;
    password: string;
    gender: "male" | "female";
};

export interface ProductTypo {
    slug: string;
    name: string;
    description: string,
    image: string,
    colors: string[];
    category: string;
    sizes: string[];
    price: number;
};