export const softDeleteUtility = async (
    id: string,
    Model: any,
    modelName: string
) => {
    const itemToDelete = await Model.findOne({ _id: id, isDeleted: false });

    if (!itemToDelete) {
        throw new Error(`This ${modelName} is not found`);
    };

    // if isDeleted is here , make it true
    if ('isDeleted' in itemToDelete) {
        (itemToDelete as any).isDeleted = true;
    } else {
        // set isDeleted if not set
        (itemToDelete as any).$set("isDeleted", true);
    }

    if ('deletedAt' in itemToDelete) {
        (itemToDelete as any).deletedAt = new Date();
    } else {
        (itemToDelete as any).$set("deletedAt", new Date());
    }

    await itemToDelete.save();
    return itemToDelete.toObject();
}