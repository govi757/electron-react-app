console.log("Hello world");

const {
  win,
  BrowserWindow,
  app,
  ipcMain,
  Notification,
  dialog,
} = require("electron");
const fs = require("fs");
const rootPath = require("electron-root-path").rootPath;
const { shell } = require("electron");

const isDev = !app.isPackaged;
const path = require("path");
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}
if (isDev) {
  require("electron-reload")(__dirname, {
    elctron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

ipcMain.on("notify", (event, message) => {
  new Notification({ title: "Notification", body: message }).show();
});

ipcMain.on("create-file", async (event, path, fileName, content) => {

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  const filePath = path + "/" + fileName;
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    }
  // if (!fs.existsSync(path)) {
  //   await fs.mkdirSync(path, { recursive: true });
  //   const filePath = `${path}/${fileName}`;
  //   if (!fs.existsSync(filePath)) {
  //     fs.writeFileSync(filePath, content);
  //   }
  // } else {
  //   console.log("File already exists.");
  // }

  
});

ipcMain.on("write-file", (event, path, fileName, content = "{}") => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  const filePath = path + "/" + fileName;
  fs.writeFileSync(filePath, content);
});

ipcMain.handle("open-folder", async (event, message) => {
  // shell.showItemInFolder("")
  //   dialog.showOpenDialog({properties: ['openFile','openDirectory'] }).then(function (response) {
  //     if (!response.canceled) {
  //     createFile(response.filePaths[0],'testFile.txt',"content");
  //     return response.filePaths[0];
  //     } else {
  //       console.log("no file selected");
  //     }
  // });

  const response = await dialog.showOpenDialog({
    properties: ["openFile", "openDirectory"],
  });
  return response;
});

ipcMain.handle("read-dir", async (event, src) => {
  console.log(src, "PAth is this");
  const response = await fs.readdirSync(src);
  console.log(response, "response");
  return response;
});

ipcMain.handle("copy-base-folder", async (event, destUrl) => {
  // const filePath = `${dest}/baseConfig.json`
  // console.log(filePath,"filePath")
  // fs.readFile(filePath,'utf8',(err, jsonString) => {
  //   const json = JSON.parse(jsonString);
  //   if (err) {
  //     console.log("File read failed:", err);
  //     return;
  //   }
  //   console.log(jsonString);
  const sourceStaticFolder = path.join(__dirname, "template");
  //   const destUrl = `${dest}/${json.name}`
  console.log(destUrl, "Dest  url is this");
  if (!fs.existsSync(destUrl)) {
    fs.cpSync(sourceStaticFolder, destUrl, { recursive: true });
  }
  // });
});

ipcMain.handle("read-file", async (event, src) => {
  const p = new Promise((res) => {
    fs.readFile(src, "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        res("{}");
      }
      console.log("File data:", jsonString);
      res(jsonString);
    });
  });

  return p;
});

ipcMain.handle("is-file-exist", async (event, src) => {
  const response = await fs.existsSync(src);
  console.log(response, "response");
  return response;
});

createFile = (path, fileName, content = "Content") => {
  const filePath = path + "/" + fileName;
  if (!fs.existsSync(filePath)) {
    // File doesn't exist, create it and write the content
    fs.mkdir(path, { recursive: true }, function (err) {
      if (err) {
      }
      fs.writeFile(filePath, content, () => {});
    });
    console.log("File created successfully.");
  } else {
    console.log("File already exists.");
  }
};

app.whenReady().then(createWindow);
