// granularity with which the slider can step through values
// we assume this is always a factor of 10 to avoid floating point oddities
export const STEP_GRANULARITY = 0.1;

// factor used to readjust values that have been scaled down by STEP_GRANULARITY
// named "precision factor" because it is used to round values to the expected precision
export const PRECISION_FACTOR = STEP_GRANULARITY >= 1 ? 1 : 1 / STEP_GRANULARITY;

// number of decimal places to round to when granularity is less than 1
export const CUE_TIME_DIGITS = STEP_GRANULARITY >= 1 ? 0 : PRECISION_FACTOR;
