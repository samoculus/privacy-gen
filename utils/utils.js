const axios = require('axios');

const listCards = (key_store) => {
    let card = axios({
    method: 'get',
    url: 'https://api.privacy.com/v1/card',
    headers: {
        'Authorization':'api-key ' + key_store
    }
  }).then( (response) => {
    return response;
  }).catch( (error) => {
    return error;
  })

  return card;
};

const listTransactions = (key_store) => {
    let transactions = axios({
        method: 'get',
        url: 'https://api.privacy.com/v1/transaction/all',
        headers: {
          'Authorization':'api-key ' + key_store,
        }
      }).then( (response) => {
        return response;
      }).catch( (error) => {
        return error;
      })
    
      return transactions;
};

const getLoginToken = async (account) => {
  const url = 'https://privacy.com/auth/local';
  const options = {
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Mobile Safari/537.36',
		'content-type': 'application/json;charset=UTF-8',
    'connection': 'keep-alive',
    'cookie': 'referringSite=www.google.com; http-referrer=https%3A%2F%2Fwww.google.com%2F; sessionID=76a98d6c-1f73-4882-ab34-0249fe01decd; experiments=CiRlZjNjY2Q3Mi1mNTdiLTQxZTEtODg4Ni1kYjc3NDk4MmM5ZmYSM0oZc2hvdWxkU2hvd0FjY291bnRTZXR0aW5nc2oWc2hvd09sZFNwZW5kTGltaXRNb2RhbA%3D%3D; ETag="ps26i5unssI="'
  };

  const user = {
    'email': account.username,
    'password': account.password,
    'extensionInstalled': false,
    'captchaResponse': null
  };

  let response = axios.post(url, user, options);

  return response;
};

const getValidToken = async (code, token) => {
  let validToken = axios({
    method: 'post',
    url: 'https://privacy.com/auth/local/code',
    headers: {
      'cookie': 'referringSite=www.google.com; http-referrer=https%3A%2F%2Fwww.google.com%2F; sessionID=76a98d6c-1f73-4882-ab34-0249fe01decd; experiments=CiRlZjNjY2Q3Mi1mNTdiLTQxZTEtODg4Ni1kYjc3NDk4MmM5ZmYSM0oZc2hvdWxkU2hvd0FjY291bnRTZXR0aW5nc2oWc2hvd09sZFNwZW5kTGltaXRNb2RhbA%3D%3D; ETag="ps26i5unssI="',
      'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Mobile Safari/537.36',
      'content-type': 'application/json;charset=UTF-8',
      'connection': 'keep-alive'
    },
    data: {
      'code': code,
      'rememberDevice': true,
      'userToken': token
    }
  }).then((response) => {
    return response;
  }).catch((error) => {
    return error;
  });

  return validToken;
}

const createCard = async (data, token) => {
  const card_url = 'https://privacy.com/api/v1/card';
  const card_options = {
    'Authorization':'Bearer ' + token,
    'connection': 'keep-alive',
    'cookie':'referringSite=www.google.com; http-referrer=https%3A%2F%2Fwww.google.com%2F; sessionID=76a98d6c-1f73-4882-ab34-0249fe01decd; experiments=CiRlZjNjY2Q3Mi1mNTdiLTQxZTEtODg4Ni1kYjc3NDk4MmM5ZmYSM0oZc2hvdWxkU2hvd0FjY291bnRTZXR0aW5nc2oWc2hvd09sZFNwZW5kTGltaXRNb2RhbA%3D%3D; ETag="ps26i5unssI="; token=' + token,
    'user-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
  }

  const card = {
    'memo': data.memo,
    'meta': {'hostname':""},
    'spendLimit': data.limit,
    'spendLimitDuration': data.duration,
    'style': null,
    'type': data.type,
    'unused': true
  };

  let result = axios({
    method: 'post',
    url: card_url,
    headers: card_options,
    data: card
  })
  .then((response) => {
    return response;
  }).catch((error) => {
    return error;
  });

  return result;
};

module.exports = {
    listCards, 
    listTransactions,
    getLoginToken,
    getValidToken,
    createCard
}