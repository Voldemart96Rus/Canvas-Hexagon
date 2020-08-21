export const MIN_SIZE = 1;
export const MAX_SIZE = 30;

export const L_INITIAL_VALUE = 3;
export const M_INITIAL_VALUE = 5;
export const N_INITIAL_VALUE = 7;

export const LESS = [
    [-1, -1],
    [0, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 0],
];
export const EVEN = [
    [-1, -1],
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 1],
    [-1, 0],
];
export const MORE = [
    [0, -1],
    [1, -1],
    [1, 0],
    [0, 1],
    [-1, 1],
    [-1, 0],
];

export const HEXAGON_ANGLE = 0.523598776; // 30 градусов в радианах
export const SIDE_LENGTH = 55; // Длина стороны гексогона в пикселях
export const HEX_HEIGHT = Math.sin(HEXAGON_ANGLE) * SIDE_LENGTH;
export const HEX_RADIUS = 52; //Math.cos(HEXAGON_ANGLE) * SIDE_LENGTH; //47.5 //52
export const HEX_RECTANGLE_WIDTH = 104; // 2 * HEX_RADIUS; //95 //104;
export const GAP = 5; //104;
export const COLOR = '#389ce4'; // Цвет гексогона по умолчанию
