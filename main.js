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

ipcMain.on("create-file", (event, filePath,content) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log('File created successfully.');
} else {
    console.log('File already exists.');
}
});

ipcMain.on("write-file", (event, path,fileName,content="{}") => {
  if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
  }

  const filePath = path + '/' + fileName;
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

const response = await dialog.showOpenDialog({properties: ['openFile','openDirectory'] });
return response;
});

ipcMain.handle("read-dir", async (event, src) => {
  const response = await fs.readdirSync(src);
  console.log(response,"response")
  return response;
});

ipcMain.handle("read-file", async (event, src,res=() => {}) => {
  fs.readFile(src,'utf8',(err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      res("{}");
    }
    console.log("File data:", jsonString);
    res(JSON.stringify(jsonString));
  });
  // return response;
});

ipcMain.handle("is-file-exist", async (event, src) => {
  const response = await fs.existsSync(src)
  console.log(response,"response")
  return response;
});


createFile = (path,fileName,content="Content") =>  {
    const filePath = path+'/'+fileName;
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
}

app.whenReady().then(createWindow);
