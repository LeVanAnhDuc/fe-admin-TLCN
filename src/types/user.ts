export default interface IUser {
    avatarUrl: string;
    createdDate: string;
    email: string;
    gender: string;
    id: number;
    isEnabled: boolean | string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    locked: boolean | string;
    name: string;
    password: string;
    phoneNumber: string;
    username: string;
}

export interface IInfoProfileUserInputUpdate {
    username: string;
    name: string;
    email: string;
    phoneNumber: string;
    gender: string;
}
