import { ICategoryName } from './category';
import { ISku } from './productCart';
export interface IValue {
    valueId?: number;
    valueName: string;
    imageUrl?: string;
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
    price: number;
    quantity: number;
    quantityAvailable: number;
    category: ICategoryName;
    slug: string;
    promotionalPrice: string;
    sold: number;
    rating: number;
    numberOfRatings: number;
    favoriteCount: number;
    isActive: boolean;
    isSelling: boolean;
    createdDate: string;
    lastModifiedDate: string;
    createdBy: string;
    lastModifiedBy: string;
    listImages: Array<string>;
    options: Array<IOption>;
    skus: Array<ISku>;
}
