export const cacheDirectory = "file:///cache/";
export const EncodingType = { Base64: "base64", UTF8: "utf8" };
export const writeAsStringAsync = jest.fn().mockResolvedValue(undefined);
export const readAsStringAsync = jest.fn().mockResolvedValue("");
export const deleteAsync = jest.fn().mockResolvedValue(undefined);
