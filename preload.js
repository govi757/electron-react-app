const { ipcRenderer, contextBridge } = require("electron");

ipcRenderer;
contextBridge.exposeInMainWorld("electron", {
  notificationApi: {
    sendNotification(message) {
      console.log(message, "Message received");
      ipcRenderer.send("notify", message);
    },
  },
  filesApi: {
    writeFile(src, fileName, content) {
      console.log("Write file");
      // const filePath = `${src}/${fileName}`;
      ipcRenderer.send("write-file", src, fileName,content);
    },
    createFile(src, fileName,content="{}") {
      console.log("Create file");
      const filePath = `${src}/${fileName}`;
      ipcRenderer.send("create-file", filePath,content);
    },
    readFile(src, fileName, res=() => {}) {
      const filePath = `${src}/${fileName}`;
      ipcRenderer.invoke("read-file", filePath,content => {
        console.log(content)
        res(content);
      });
    },
    openFolder(res = () => {}) {
      ipcRenderer.invoke("open-folder", "Hello").then((response) => {
        res(response);
      });
    },
    readDir(src, res = () => {}) {
      ipcRenderer.invoke("read-dir", src).then((response) => {
        res(response);
      });
    },
    isFileExists(src, fileName) {
      const filePath = src + fileName;
      ipcRenderer.invoke("is-file-exist", filePath).then((response) => {
        res(response);
      });
    },
  },
  batteryApi: {},
});
