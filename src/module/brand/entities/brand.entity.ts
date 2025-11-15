import { Types } from "mongoose";

export class Brand {
    readonly _id: Types.ObjectId;
    name: string;
    slug: string;
    createdBy: Types.ObjectId;
    updateBy: Types.ObjectId;
    logo: Object;//todo
}
