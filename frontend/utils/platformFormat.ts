type PlatformItem = {
    id: number;
    title: string;
    src: string;
};

const platformList = (platforms: string[]): PlatformItem[] => {
    return platforms.map((platform, index) => ({
        id: index + 1,
        title: platform[0],
        src: platform[2]
    }));
}


export {platformList};