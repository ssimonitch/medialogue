// granularity with which the slider can step through values
// we assume this is always a factor of 10 to avoid floating point oddities
export const STEP_GRANULARITY = 0.1;

// number of decimal places to round to when granularity is less than 1
export const CUE_TIME_DIGITS = STEP_GRANULARITY >= 1 ? 0 : STEP_GRANULARITY * 10;
