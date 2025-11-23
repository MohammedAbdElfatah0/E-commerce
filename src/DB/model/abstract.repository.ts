import { Model, HydratedDocument, RootFilterQuery, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";

export class AbstractRepository<T> {
    constructor(
        protected readonly model: Model<T>
    ) { }

    public async create(item: Partial<T>) {
        const doc = new this.model(item);
        return doc.save();
    }

    public async getOne(
        filter: RootFilterQuery<T>,
        projection?: ProjectionType<T>,
        option?: QueryOptions
    ): Promise<HydratedDocument<T> | null> {
        return this.model.findOne(filter, projection, option);
    }

    public async updateOne(
        filter: RootFilterQuery<T>,
        updateQuery: UpdateQuery<T>,
        option?: QueryOptions
    ): Promise<HydratedDocument<T> | null> {
        return this.model.findOneAndUpdate(filter, updateQuery, {
            new: true,
            ...option,
        });
    }
}
