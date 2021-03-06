import axios from '@/framework/http/axios'
const model = 'user';
let getUrl = `api/${model}/get`;
let searchUrl = `api/${model}/searchByPhoneAndName`;
let countUrl = `api/${model}/count`;
let deleteUrl = `api/${model}/delete`;
let batchDeleteUrl = `api/${model}/delete`;
let enableUrl = `api/${model}/enable`;
let disableUrl = `api/${model}/disable`;
let saveUrl = `api/${model}/save`;
let culculateDiscountUrl = `api/${model}/culculateDiscount`;
let reduceBalanceUrl = `api/${model}/reduceBalance`
let rechargeBalanceUrl = `api/${model}/rechargeBalance`
let culculateLevelUrl = `api/${model}/culculateLevel`

export function culculateDiscount(param, callback) {
  axios.post(culculateDiscountUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function reduceBalance(param, callback) {
  axios.post(reduceBalanceUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function rechargeBalance(param, callback) {
  axios.post(rechargeBalanceUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}




export function get(param, callback) {
  axios.post(getUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function save(param, callback) {
  axios.post(saveUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function culculateLevel(param, callback) {
  axios.post(culculateLevelUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}




export function search(param, callback) {
  axios.post(searchUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function count(param, callback) {
  axios.post(countUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function  del(param, callback) {
  axios.post(countUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function enable(param, callback) {
  axios.post(enableUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function disable(param, callback) {
  axios.post(disableUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function findById(param, callback) {
  axios.post(`api/${model}/findById`, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}
