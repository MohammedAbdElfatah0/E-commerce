// import { Category } from "@model/index";

const generateMessage = (entity: string) => ({
    notFound: `${entity} not found`,
    alreadyExist: `${entity} already exist`,
    created: `${entity} created successfully`,
    updated: `${entity} updated successfully`,
    deleted: `${entity} deleted successfully`,
    failCreate: `Failed to create ${entity}`,
    failUpdate: `Failed to update ${entity}`,
    failDelete: `Failed to delete ${entity}`,
});

export const message = {
    Category: { ...generateMessage("Category") },
    Brand: { ...generateMessage("Brand") },
    Product: { ...generateMessage("Product") },
    User: { ...generateMessage("User") },
    Coupon: { ...generateMessage("Coupon") },
    Order: { ...generateMessage("Order") },
}