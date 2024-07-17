interface IProductChildrenCart {
    id: number;
    name: string;
    quantityAvailable: number;
}

export interface IValue {
    valueName: string;
    imageUrl?: string | File;
}
export interface ISku {
    originalPrice: number;
    quantity: number;
    price: number;
    sku?: string;
    skuId?: number;
    optionValues: Array<IValue>;
}

export interface ISkuCreate {
    originalPrice: number;
    quantity: number;
    price: number;
    optionValues: Array<IValue>;
    quantityAvailable?: number;
    sold?: number;
}

export default interface IProductCart {
    id: number;
    orderId: number;
    imageUrl: string;
    price: number;
    product: IProductChildrenCart;
    quantity: number;
    sku: ISku;
    subTotal: number;
}
