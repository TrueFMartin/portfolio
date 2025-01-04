
class ImageMetadata {
    path: string;
    height: number;
    width: number;

    constructor(path: string, height: number, width: number) {
        this.path = path;
        this.height = height;
        this.width = width;
    }
}

class ImagesMetadata {
    enabled: boolean;
    images: ImageMetadata[];
    constructor(enabled: boolean, images: ImageMetadata[]) {
        this.enabled = enabled;
        this.images = images;
    }
}

export const work: Map<string, ImagesMetadata> = new Map([
    ["secureworks", new ImagesMetadata(true, [new ImageMetadata("/images/about/work/secureworks.jpg", 9, 16)])],
    ["walmart", new ImagesMetadata(true, [new ImageMetadata("/images/about/work/walmart.jpg", 9, 16)])],
]);

export const skills: Map<string, ImagesMetadata> = new Map([
    ["languages", new ImagesMetadata(true, [new ImageMetadata("/images/about/skills/go.png", 8, 8), new ImageMetadata("/images/about/skills/springboot.png", 8, 8)])],
    ["infrastructure", new ImagesMetadata(true, [new ImageMetadata("/images/about/skills/kubernetes.png", 8, 8)])],
    ["data", new ImagesMetadata(true, [new ImageMetadata("/images/about/skills/apache.png", 8, 5), new ImageMetadata("/images/about/skills/spark.png", 8, 16), new ImageMetadata("/images/about/skills/starrocks.png", 8, 8)])],
    ["cloud", new ImagesMetadata(true, [new ImageMetadata("/images/about/skills/aws.png", 8, 12)])],
    ["database", new ImagesMetadata(true, [new ImageMetadata("/images/about/skills/postgres.png", 8, 8), new ImageMetadata("/images/about/skills/gremlin.png", 8, 8)])],
]);

export const education: Map<string, ImagesMetadata> = new Map([
    ["uark", new ImagesMetadata(true, [new ImageMetadata("/images/about/education/uark.png", 12, 8)])],
]);