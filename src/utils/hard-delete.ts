export const hardDeleteUtility = async (
    id: string,
    Model: any,
    modelName: string
) => {
    const itemToDelete = await Model.findOne({ _id: id, isDeleted: true });

    if (!itemToDelete) {
        throw new Error(`This ${modelName} is not found`);
    };

    await Model.deleteOne({ _id: id });
    return itemToDelete.toObject();
};