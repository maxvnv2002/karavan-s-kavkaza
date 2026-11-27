function openFiles() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const connection = window.indexedDB.open("karavan.admin.files", 1);
    connection.onupgradeneeded = () => connection.result.createObjectStore("files");
    connection.onsuccess = () => resolve(connection.result);
    connection.onerror = () => reject(connection.error);
  });
}

async function fileOperation<T>(mode: IDBTransactionMode, access: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await openFiles();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction("files", mode);
      const request = access(transaction.objectStore("files"));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error ?? request.error);
    });
  } finally {
    db.close();
  }
}

export const writeFile = (id: string, file: File) => fileOperation("readwrite", (store) => store.put(file, id));
export const readFile = (id: string): Promise<File | undefined> => fileOperation("readonly", (store) => store.get(id));
export const removeFile = (id: string) => fileOperation("readwrite", (store) => store.delete(id));

export async function downloadFile(id: string, name: string) {
  const file = await readFile(id);
  if (!file) throw new Error("Файл отсутствует в этом браузере.");
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
