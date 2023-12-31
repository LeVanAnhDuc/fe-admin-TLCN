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
    price?: number;
    sku?: string;
    skuId?: number;
    optionValues: Array<IValue>;
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
