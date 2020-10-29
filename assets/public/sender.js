const app = require('electron').remote.app;
const { remote } = require('electron');

class Sender {
    constructor(){
    }

    showMain() {
        if (document.getElementById('main').style.display == "none" ){
            document.getElementById('transactions').style.display = "none"
            document.getElementById('settings').style.display = "none"
            document.getElementById('main').style.display = ""
        }
    }

    showTransactions() {
        if (document.getElementById('transactions').style.display == "none" ){
            document.getElementById('main').style.display = "none"
            document.getElementById('settings').style.display = "none"
            document.getElementById('transactions').style.display = ""
        }
    }

    showSettings() {
        if (document.getElementById('settings').style.display == "none" ){
            document.getElementById('transactions').style.display = "none"
            document.getElementById('main').style.display = "none"
            document.getElementById('settings').style.display = ""
        }
    }

    close(){
        app.quit()
    }

    minimize(){
        remote.getCurrentWindow().minimize()
    }
}

module.exports = Sender;