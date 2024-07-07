import { PRECISION_FACTOR } from './constants';

export const normalizeCueTime = (cueTime: number) => Math.round(cueTime * PRECISION_FACTOR) / PRECISION_FACTOR;
