export default interface IUser {
    avatarUrl: string;
    createdDate: string;
    email: string;
    gender: string;
    id: number;
    isEnabled: boolean;
    lastModifiedBy: string;
    lastModifiedDate: string;
    locked: boolean;
    name: string;
    password: string;
    phoneNumber: string;
    username: string;
}

export interface IInfoProfileUser {
    username: string;
    name: string;
    email: string;
    phoneNumber: string;
    gender: string;
    avatarUrl: string;
}
