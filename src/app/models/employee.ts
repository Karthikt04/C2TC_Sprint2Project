export interface Employee {
    id?: number;
    name: string;
    designation: string;
    salary: number;
    shop?: {
        id: number;
        shopName: string;
    };
}