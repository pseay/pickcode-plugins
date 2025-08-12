export type FromRuntimeMessage = {
    drawLine?: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    drawPoint?: {
        x: number;
        y: number;
    };
    drawCircle?: {
        x: number;
        y: number;
        radius: number;
    };
    setColor?: {
        color: string;
    };
    drawVector?: {
        x1: number;
        y1: number;
    };
};

export type ToRuntimeMessage = {};
