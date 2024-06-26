import { ICategoryName } from './category';
import { ISku } from './productCart';
export interface IValue {
    valueId?: number;
    valueName: string;
    imageUrl?: string | File;
}

export interface IValueColorCreate {
    valueName: string;
    imageString: string;
    imageFile?: File;
}
export interface IValueSizeCreate {
    valueName: string;
}
export interface IOption {
    optionId?: number;
    optionName: string;
    values: Array<IValue>;
}

export default interface IProduct {
    id: number;
    name: string;
    description: string;
    originalPrice: number;
    percentDiscount: number;
    price: number;
    quantity: number;
    quantityAvailable?: number;
    category: ICategoryName;
    categoryId?: number;
    categoryName: string;
    slug?: string;
    promotionalPrice?: number;
    sold?: number;
    rating?: number;
    numberOfRatings?: number;
    favoriteCount?: number;
    isActive?: boolean;
    isSelling?: boolean;
    status?: string;
    createdDate?: string;
    lastModifiedDate?: string;
    createdBy?: string;
    lastModifiedBy?: string;
    listImages: Array<string>;
    options: Array<IOption>;
    skus: Array<ISku>;
}

export interface IProductCreate {
    name: string;
    description: string;
    originalPrice: number;
    percentDiscount: number;
    categoryName: string;
    listImages: Array<string>;
    options: Array<IOption>;
    skus: Array<ISku>;
}

export interface IProductInputCreate {
    name: string;
    originalPrice: number;
    percentDiscount: number;
    categoryName: string;
}

export interface IProductUpdate {
    name: string;
    description: string;
    originalPrice: number;
    percentDiscount: number;
    categoryName: string;
    listImages: Array<string>;
    options: Array<IOption>;
    skus: Array<ISku>;
}

export interface IProductInputUpdate {
    name: string;
    description?: string;
    originalPrice: number;
    percentDiscount: number;
    quantity?: number;
    quantityAvailable?: number;
    categoryName: string;
    sold?: number;
    createdDate?: string;
    lastModifiedDate?: string;
}
