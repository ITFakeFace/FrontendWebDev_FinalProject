import {openDB} from 'idb';

const DB_NAME = 'ImageStorage';
const STORE_NAME = 'images';

// ✅ Khởi tạo DB
export const initDB = () =>
    openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });

// ✅ Lưu Blob với ID
export async function saveImageBlob(id, blob) {
    const db = await initDB();
    await db.put(STORE_NAME, blob, id);
}

// ✅ Lấy Blob bằng ID
export const getImageBlob = async (id) => {
    try {
        const db = await initDB();
        return await db.get(STORE_NAME, id);
    } catch (error) {
        console.error('❌ Không thể lấy ảnh từ IndexedDB:', error);
        return null;
    }
};

// ✅ base64 → Blob
export const dataURLtoBlob = (dataUrl) => {
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)?.[1] ?? '';
    const bstr = atob(base64);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], {type: mime});
};

// ✅ Blob → base64
export const blobToDataURL = (blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

/**
 * ✅ Duyệt <img src="data:image/...">, lưu Blob, thay thành `image://id` + data-image-id
 */
export const processEditorContentAndSaveImages = async (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');

    for (const img of images) {
        const src = img.getAttribute('src');
        if (src?.startsWith('data:image')) {
            const blob = dataURLtoBlob(src);
            const id = crypto.randomUUID();

            await saveImageBlob(id, blob);

            img.setAttribute('data-image-id', id);
            img.setAttribute('src', `image://${id}`);
        }
    }

    return doc.body.innerHTML;
};

/**
 * ✅ Duyệt <img data-image-id="...">, thay `src` thành `URL.createObjectURL(blob)`
 */
export const replaceImageSrcWithBlobUrls = async (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img[data-image-id]');

    for (const img of images) {
        const id = img.getAttribute('data-image-id');
        const blob = await getImageBlob(id);
        if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            img.setAttribute('src', blobUrl);
        }
    }

    return doc.body.innerHTML;
};

/**
 * ✅ Nếu bạn cần export HTML về base64 → dùng cái này
 */
export const replaceImageSrcWithBase64 = async (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img[data-image-id]');

    for (const img of images) {
        const id = img.getAttribute('data-image-id');
        const blob = await getImageBlob(id);
        if (blob) {
            const dataUrl = await blobToDataURL(blob);
            img.setAttribute('src', dataUrl);
        }
    }

    return doc.body.innerHTML;
};
