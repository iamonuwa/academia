import { SUPPORTED_THEMES, SUPPORTED_DOC_FORMATS } from "../constants";

export function getQueryParam(windowLocation, name) {
  var q = windowLocation.search.match(new RegExp("[?&]" + name + "=([^&#?]*)"));
  return q && q[1];
}
export function checkSupportedTheme(themeName) {
  if (themeName && themeName.toUpperCase() in SUPPORTED_THEMES) {
    return themeName.toUpperCase();
  }
  return null;
}

export const remUnit = px => `${px / 16}rem`;

export const getWidth = value => {
  if (!value) return;

  let width = (value / 12) * 100;
  return `width: ${width}%;`;
};

export const getFlex = value => {
  if (!value) return;

  let flex = (value / 12) * 100;
  return `flex: 0 0 ${flex}%;`;
};

const getFieldName = (name, account) => (account ? `${account}${name}` : name);

export const getStoredValue = (name, account) =>
  localStorage.getItem(getFieldName(name, account));

export const storeValues = (params, account) => {
  const keys = Object.keys(params);
  const values = Object.values(params);
  keys.forEach((key, index) => {
    const value = values[index];
    const name = getFieldName(key, account);
    localStorage.setItem(name, value);
  });
};

export const clearStorageValue = (name, account) =>
  localStorage.removeItem(getFieldName(name, account));

export const getFileExtension = fileName =>
  fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);

export const getContentType = doc => {
  switch (doc) {
    case "pdf":
      return "application/pdf";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
};

export const fileExtension = contentType => {
  switch (contentType) {
    case "application/pdf":
      return "pdf";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";
  }
};

export const validateFile = docType => {
  return SUPPORTED_DOC_FORMATS.includes(docType) ? true : false;
};

export const downloadPDF = (file, docType) => {
  let linkSource = `${file}`;
  let downloadLink = document.createElement("a");
  let fileName = `${new Date().getTime()}-publication.${fileExtension(
    docType
  )}`;

  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
};
