export const convertNumberToVND = (textToConvert?: number | string) => {
    if (textToConvert) {
        if (typeof textToConvert === 'string') {
            return parseInt(textToConvert).toLocaleString('vi-VN');
        } else {
            return textToConvert.toLocaleString('vi-VN');
        }
    } else {
        return 0;
    }
};

export const convertNumberToTwoChar = (textToConvert: number) => {
    if (textToConvert < 10) {
        return `0${textToConvert}`;
    }
    return textToConvert;
};
