// libs
import { UseFormSetValue } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// types
import IProduct, { IOption, IProductInputUpdate } from '@/types/product';
import { ISkuCreate } from '@/types/productCart';
// apis
import { getSingleProduct } from '@/apis/productApi';
// others
import { checkVariableIsNil } from '@/utils/checkData';
import config from '@/config';

const GetProduct = ({
    idProduct,
    setValue,
    setDescription,
    setImagesDisplay,
    setListImageCurrent,
    setOptionsSize,
    setOptionsColor,
    setSku,
    setErrorAPI,
    setProduct,
}: {
    idProduct?: string;
    setValue: UseFormSetValue<IProductInputUpdate>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    setImagesDisplay: React.Dispatch<React.SetStateAction<string[]>>;
    setListImageCurrent: React.Dispatch<React.SetStateAction<string[]>>;
    setOptionsSize: React.Dispatch<React.SetStateAction<IOption>>;
    setOptionsColor: React.Dispatch<React.SetStateAction<IOption>>;
    setSku: React.Dispatch<React.SetStateAction<ISkuCreate[]>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setProduct: React.Dispatch<React.SetStateAction<IProduct | undefined>>;
}) => {
    const navigate = useNavigate();

    const getProduct = async () => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                const response = await getSingleProduct(+idProduct);

                if (response.status === 200) {
                    const product: IProduct = response.data;
                    setProduct(product);

                    setValue('categoryName', product.categoryName);
                    setValue('name', product.name);
                    setValue('quantity', product.quantity);
                    setValue('originalPrice', product.originalPrice);
                    setValue(
                        'percentDiscount',
                        checkVariableIsNil(product.percentDiscount) ? 0 : product.percentDiscount,
                    );
                    setValue('sold', product.sold);
                    setValue('quantityAvailable', product.quantityAvailable);
                    setValue('createdDate', product.createdDate);
                    setValue('lastModifiedDate', product.lastModifiedDate);

                    setDescription(product.description);
                    setImagesDisplay(product.listImages);
                    setListImageCurrent(product.listImages);

                    setOptionsSize(product.options.filter((item: IOption) => item.optionName === 'Size')[0]);
                    setOptionsColor(product.options.filter((item: IOption) => item.optionName === 'Màu')[0]);

                    setSku(product.skus);
                } else {
                    toast.error(response.data.message || response.data);
                    navigate(config.Routes.listProduct);
                }
            }
        } catch {
            setErrorAPI(true);
        }
    };

    useEffect(() => {
        getProduct();
    }, []);

    return null;
};

export default GetProduct;
