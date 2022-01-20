export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };
  export const lerp = (start, end, time = 0.05) => {
    return start * (1 - time) + end * time;
  };
  export const mapRange = (value, inMin, inMax, outMin, outMax) => {
    value = clamp(value, inMin, inMax);
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };