// libs
import { useEffect } from 'react';
// types
import { IOption } from '@/types/product';
import { ISkuCreate } from '@/types/productCart';
// others
import { arraysAreEqual } from '@/utils/checkData';

const GenerateSKU = ({
    optionsSize,
    optionsColor,
    setSku,
}: {
    optionsSize: IOption;
    optionsColor: IOption;
    setSku: React.Dispatch<React.SetStateAction<ISkuCreate[]>>;
}) => {
    useEffect(() => {
        if (optionsSize.values.length <= 0 && optionsColor.values.length <= 0) return;

        for (let i = 0; i < optionsSize?.values.length; i++) {
            for (let j = 0; j < optionsColor?.values.length; j++) {
                setSku((prev) => {
                    const optionValues = [optionsSize.values[i], optionsColor.values[j]];
                    const optionValueNames = [optionsSize.values[i].valueName, optionsColor.values[j].valueName];

                    const alreadyExists = prev.some((item) =>
                        arraysAreEqual(
                            [item.optionValues[0].valueName, item.optionValues[1].valueName],
                            optionValueNames,
                        ),
                    );

                    if (alreadyExists) {
                        return prev.map((item) => {
                            if (
                                arraysAreEqual(
                                    [item.optionValues[0].valueName, item.optionValues[1].valueName],
                                    optionValueNames,
                                )
                            ) {
                                return {
                                    ...item,
                                    optionValues,
                                };
                            }
                            return item;
                        });
                    }

                    return [
                        ...prev,
                        {
                            optionValues,
                            originalPrice: 0,
                            price: 0,
                            quantity: 0,
                        },
                    ];
                });
            }
        }
    }, [optionsSize, optionsColor]);

    return null;
};

export default GenerateSKU;
