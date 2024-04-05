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
