export interface LayoutOptions {
    width: number;
    widthTailwind: string;
    height: number;
    heightTailwind: string;
    node: {
        sourceX: number;
        targetX: number;
        yIncrement: number;
        width: number;
        widthTailwind: string;
        height: number;
        heightTailwind: string;
    };
    topPadding: number;
    bottomPadding: number;
}

export const defaultLayout: LayoutOptions = {
    width: 384,
    widthTailwind: 'w-96',
    height: 384,
    heightTailwind: 'h-96',
    node: {
        sourceX: 10,
        targetX: 248,
        yIncrement: 50,
        width: 128,
        widthTailwind: 'w-32',
        height: 40,
        heightTailwind: 'h-10',
    },
    topPadding: 10,
    bottomPadding: 10,
};