export default interface ICategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    createdBy: string;
    lastModifiedBy: string;
    createdDate: string;
    lastModifiedDate: string;
    parentId: number;
}

export interface IUpdateCategory {
    name: string;
    description: string;
    parentId: number | null;
}
