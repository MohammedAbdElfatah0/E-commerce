import { Model, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

export class AbstractRepository<T> {
    constructor(private readonly model: Model<T>) { }


    //create 
    public async create(item: Partial<T>) {
        const doc = new this.model(item);
        return doc.save();
    }
    // get one 
    public async getOne(filter: RootFilterQuery<T>, projection?: ProjectionType<T>, option?: QueryOptions) {
        return this.model.findOne(filter, projection, option)
    }
    //update one and find one
    public async updateOne(filter: RootFilterQuery<T>, updateQuery: UpdateQuery<T>, option?: QueryOptions) {
        return this.model.findByIdAndUpdate(filter, updateQuery, option)
    }
}