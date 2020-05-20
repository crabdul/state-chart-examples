export const flatten = (value) => {
  if (typeof value === "object") {
    return Object.entries(value)[0].join(".");
  }
  return value;
};
