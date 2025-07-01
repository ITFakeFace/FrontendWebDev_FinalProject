import { getImageBlob } from "./imageUtil";

export const restoreImagesInDescription = async (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const images = doc.querySelectorAll("img[data-img-id]");

  for (const img of images) {
    const id = img.getAttribute("data-img-id");
    const blob = await getImageBlob(id);
    if (blob) {
      const url = URL.createObjectURL(blob);
      img.setAttribute("src", url);
    } else {
      img.setAttribute("alt", "[Image missing]");
    }
  }

  return doc.body.innerHTML;
};
