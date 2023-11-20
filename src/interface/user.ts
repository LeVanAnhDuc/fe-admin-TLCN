export default interface IUser {
    avatarUrl: string | null;
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
