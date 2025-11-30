import { Model, HydratedDocument, RootFilterQuery, ProjectionType, QueryOptions, UpdateQuery, Types } from "mongoose";

export class AbstractRepository<T> {
    constructor(
        protected readonly model: Model<T>
    ) { }

    public async create(item: Partial<T>): Promise<HydratedDocument<T>> {
        const doc = new this.model(item);
        return doc.save() as Promise<HydratedDocument<T>>;
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

    public async getAll(
        filter: RootFilterQuery<T>,
        updateQuery: UpdateQuery<T>,
        option?: QueryOptions): Promise<HydratedDocument<T>[] | null> {
        return this.model.find(filter, updateQuery, option);
    }
    //soft delete as update in doc of schema field "deletedAt"
    public async softDeleteOne(
        id: string | Types.ObjectId, updateQuery: UpdateQuery<T>,
    ): Promise<T | null> {
        return this.model.findOneAndUpdate(
            { _id: id },
            updateQuery,
            {
                new: true,
            })
    }

    public async hardDelete(id: string | Types.ObjectId): Promise<boolean> {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }
    
}
