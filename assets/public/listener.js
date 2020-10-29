const Store = require('electron-store');
const Send = require('./sender');
const utils = require('../../utils/utils');
const crypto = require('../../utils/crypto');

const schema = {
    api_key: {
        type: 'string',
        default: ''
    },
    account: {
        type: 'array',
        default: []
    },
    token: {
        type: 'string',
        default: ''
    },
    validToken: {
        type: 'string',
        default: ''
    }
};

const store = new Store({
    schema
});


// Start up data load
document.getElementById('transactions').style.display = "none";
document.getElementById('settings').style.display = "none";

document.addEventListener('DOMContentLoaded', async () => {
    let key_store = store.get('api_key');
    let account_email = store.get('account');
    document.getElementById('key-content').innerHTML = key_store;
    document.getElementById('account-content').innerHTML = account_email[0].username;
    let table_body = document.getElementById('tableBody');
    let transaction_body = document.getElementById('transactionsBody');

    let cards = await utils.listCards(key_store);
    let transactions = await utils.listTransactions(key_store);
    
    for ( card of cards.data.data ) {
        table_body.innerHTML += `<tr class="table-row">
        <td data-label="Memo">${card.memo}</td>
        <td data-label="Last4">${card.last_four}</td>
        <td data-label="Limit">$${(card.spend_limit * .01).toFixed(2)}</td>
        <td data-label="State">${card.state}</td>
        <td data-label="Type">${card.type}</td>
        </tr>`
    }

    for ( transaction of transactions.data.data ) {
        transaction_body.innerHTML += `<tr class="table-row">
        <td data-label="Card">${transaction.card.last_four}</td>
        <td data-label="Amount">$${(transaction.amount * .01).toFixed(2)}</td>
        <td data-label="Merchant">${transaction.merchant.descriptor}</td>
        <td data-label="Status">${transaction.status}</td>
        </tr>`
    }

});

// Navigation
document.getElementById('mainBtn').addEventListener("click", () => {
    new Send().showMain()
});

document.getElementById('transactionsBtn').addEventListener("click", () => {
    new Send().showTransactions()
});

document.getElementById('settingsBtn').addEventListener("click", () => {
    new Send().showSettings()
});

document.getElementById('closeBtn').addEventListener("click", () => {
    new Send().close()
});

document.getElementById('minimizeBtn').addEventListener("click", () => {
    new Send().minimize()
});

// Save API Key
let api_button = document.getElementById('api-button');
let code_button = document.getElementById('code-button');
let account_button = document.getElementById('account-button');

api_button.addEventListener('click', () => {
    let key = document.getElementById('api-input').value;
    store.set('api_key', key);
    document.getElementById('key-content').innerHTML = '';
    document.getElementById('key-content').innerHTML = key;
    document.getElementById('api-input').value = '';
    document.getElementById('api-input').value
});

// Save login information and grab tokens.
account_button.addEventListener('click', async () => {
    let modal = document.getElementById('modal');
    let username = document.getElementById('email-input').value;
    let password = document.getElementById('password-input').value;

    let encrypted = crypto.encrypt(password);
    let user_data = {
        username: username,
        password: encrypted
    };

    store.set('account', [user_data]);

    document.getElementById('account-content').innerHTML = '';
    document.getElementById('account-content').innerHTML = username,
    document.getElementById('email-input').value = '';
    document.getElementById('password-input').value = '';

    let token = await utils.getLoginToken({
        username: username,
        password: password
    });
    
    try {
        store.set('token', token.data.userToken);
        modal.style.display = 'block';
    } catch {
        store.set('validToken', token.data.token);
        document.getElementById('message').value = '';
        document.getElementById('message').value = 'All good no pop up needed! 👍'
    };

});

code_button.addEventListener('click', async () => {
    let code = document.getElementById('code-input').value;
    let initialToken = store.get('token');
    let validToken = await utils.getValidToken(code, initialToken);
    store.set('validToken', validToken.data.token)

    modal.style.display = 'none';
})

// Create Cards
let create_button = document.getElementById('create-button');

create_button.addEventListener('click', async () => {
    let card_token = store.get('validToken');
    let card_key = store.get('api_key');
    let card_data = {
        memo: document.getElementById('memo-input').value,
        limit: Number(document.getElementById('limit-input').value),
        duration: document.getElementById('duration').value,
        type: document.getElementById('use-type').value
    };
    
    let card_result = await utils.createCard(card_data, card_token);

    let card_body = document.getElementById('tableBody');
    let new_cards = await utils.listCards(card_key);
    
    document.getElementById('memo-input').value = '';
    document.getElementById('limit-input').value = '';
    card_body.innerHTML = '';

    for ( card of new_cards.data.data ) {
        card_body.innerHTML += `<tr class="table-row">
        <td data-label="Memo">${card.memo}</td>
        <td data-label="Last4">${card.last_four}</td>
        <td data-label="Limit">$${(card.spend_limit * .01).toFixed(2)}</td>
        <td data-label="State">${card.state}</td>
        <td data-label="Type">${card.type}</td>
        </tr>`
    };
});