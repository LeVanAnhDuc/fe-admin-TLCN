export default interface IAddress {
    id: number;
    fullName: string;
    phoneNumber: string;
    province: string;
    district: string;
    ward: string;
    orderDetails: string;
    isDefault?: boolean;
    userId?: number;

    districtId: number;
    provinceId: number;
    wardCode: string;
}
