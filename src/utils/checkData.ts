// libs
import lodash from 'lodash';

export const objectsAreEqual = (obj1: object, obj2: object): boolean => {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    } else {
        return false;
    }
};

export const arraysAreEqual = <T>(array1: T[], array2: T[]): boolean => {
    const sortedArray1 = lodash.sortBy(array1, (item: T) => JSON.stringify(item));
    const sortedArray2 = lodash.sortBy(array2, (item: T) => JSON.stringify(item));

    return lodash.isEqual(sortedArray1, sortedArray2);
};
