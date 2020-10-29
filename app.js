const electron = require('electron');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        resizable: false,
        width: 1000,
        height: 600,
        frame: false,
        chromeWebSecurity: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });

    // load html
    mainWindow.loadURL('file://' + __dirname + '/assets/public/index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);

});

const edit = {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll',
      },
    ],
  };


const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {label:'Quit',
             accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
             click(){
             app.quit()
            }}
        ]},
        edit
    ];


if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}