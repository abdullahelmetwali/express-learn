export const restoreUtility = async (
    id: string,
    Model: any,
    modelName: string
) => {
    const itemToRestore = await Model.findOne({ _id: id, isDeleted: true });

    if (!itemToRestore) {
        throw new Error(`This ${modelName} is not found`);
    };

    itemToRestore.isDeleted = false;
    await itemToRestore.save();

    return itemToRestore.toObject();
};