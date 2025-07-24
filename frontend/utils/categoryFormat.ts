type SubCategoryItem = {
  id: number;
  title: string;
  src: string;
//   href: string;
};

const subCategoryList = (subcategories: string[]): SubCategoryItem[] => {
    const slugify = (text: string): string =>
        text
            .toLowerCase()
            .replace(/[\s&]+/g, '_')
            .replace(/[^\w_]/g, '');

    return subcategories.map((category, index) => ({
        id: index + 1,
        title: category,
        src: `/Categories/${slugify(category)}.png`,
        // href: `/explore/${slugify(category)}`
    }));
}

export {subCategoryList};