type PlatformItem = {
    id: number;
    title: string;
    src: string;
};

const platformList = (platforms: string[]): PlatformItem[] => {
    const slugify = (text: string): string =>
        text
            .toLowerCase()
            .replace(/[\s&]+/g, '_')
            .replace(/[^\w_]/g, '');

    return platforms.map((platform, index) => ({
        id: index + 1,
        title: platform[0],
        src: `/Platforms/${slugify(platform[0])}.png`,
    }));
}


export {platformList};