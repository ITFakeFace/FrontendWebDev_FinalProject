import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { replaceImageSrcWithBlobUrls } from "../../util/imageUtil";

export const TestEditor = () => {
  const { content } = useParams();
  const [html, setHtml] = useState("");

  useEffect(() => {
    const process = async () => {
      try {
        const decoded = atob(decodeURIComponent(content));
        const updated = await replaceImageSrcWithBlobUrls(decoded);
        setHtml(updated);
      } catch (error) {
        console.error("Lỗi giải mã content:", error);
        setHtml("<p>Lỗi khi hiển thị nội dung</p>");
      }
    };

    process();
  }, [content]);

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
};
