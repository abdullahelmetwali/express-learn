import slugify from "slugify";

export const makeSlug = async (name: string, Model: any) => {
    const baseSlug = slugify(name, {
        trim: true,
        strict: true,
        locale: "en"
    });

    let slug = baseSlug;
    let counter = 1;

    while (await Model.exists({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};
