// libs
import React from 'react';
// types
import IProductCart from '@/types/productCart';
// components
import Image from '@/components/Image';
// others
import { convertNumberToVND } from '@/utils/convertData';

const ItemsOrder = ({ products }: { products: IProductCart[] }) => {
    return (
        <div className="bg-white rounded-lg p-5 space-y-4">
            <div className="font-semibold text-lg">Danh sách sản phẩm</div>
            {products.map((item: IProductCart) => (
                <React.Fragment key={item.id}>
                    <div className="h-0.5 bg-gray-200"></div>
                    <div className="size-full flex gap-5 bg-white rounded overflow-hidden p-2 dark:bg-dark-600">
                        <>
                            <Image
                                src={item.imageUrl}
                                alt={'image' + item.product.name}
                                className="object-cover object-center size-28 cursor-pointer"
                            />
                            <div className="text-sm flex flex-col justify-between ">
                                <div className="line-clamp-1 font-semibold mb-3">{item.product.name}</div>
                                <div className="flex justify-between items-center flex-wrap gap-1">
                                    <aside>
                                        <div className="flex gap-1">
                                            <span className="font-bold w-18">Phân loại:</span>
                                            <span className="font-medium">
                                                {item.sku?.optionValues?.map((option, index) => (
                                                    <React.Fragment key={index}>
                                                        {option.valueName}
                                                        {index < item.sku.optionValues.length - 1 ? ' - ' : ''}
                                                    </React.Fragment>
                                                ))}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <span className="font-bold w-18">Đơn giá: </span>
                                            <span className="not-italic font-medium text-red-500 flex gap-1">
                                                {convertNumberToVND(item.price)}
                                                <span className="text-xs"> đ</span>
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <span className="font-bold w-18">Số lượng: </span>
                                            {convertNumberToVND(item.quantity)}
                                        </div>
                                        <div className="flex gap-1">
                                            <span className="font-bold w-18">Tổng giá:</span>
                                            <div className="not-italic font-medium text-red-500 flex gap-1">
                                                {convertNumberToVND(item.subTotal)}
                                                <span className="text-xs">đ</span>
                                            </div>
                                        </div>
                                    </aside>
                                </div>
                            </div>
                        </>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default ItemsOrder;
