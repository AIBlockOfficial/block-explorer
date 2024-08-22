import { EXP_BACKEND, STORAGE_URL } from "../constants"
import { IAPIRoute } from "../interfaces"

/**
 * Fetches blocks count 
 */
export function blocksCount() {
    return fetch(`${EXP_BACKEND}${IAPIRoute.BlocksCount}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.BlocksCount })
    })
}

/**
 * Fetches block with a hash or number
 * 
 * @param id {string} - hash or number of the block to fetch
 */
export function block(id: string) {
    return fetch(`${EXP_BACKEND}${IAPIRoute.Block}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.Block })
    })
}

/**
 *  Fetches a range of latetest blocks
 * 
 * @param limit {string}  - amount to fetch from latest block
 * @param offset {string} - offset from latest block 
 */
export function blocks(limit: string, offset: string, order: string) {
    console.log(`${EXP_BACKEND}${IAPIRoute.Blocks}?limit=${limit}&offset=${offset}&order=${order}`);

    return fetch(`${EXP_BACKEND}${IAPIRoute.Blocks}?limit=${limit}&offset=${offset}&order=${order}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response.status == 200) {
                return Promise.resolve(response.json())
            } else {
                return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.Blocks })
            }
        })
}

/**
 * Fetches block transactions with a hash or number
 * 
 * @param id {string} - hash or number of the block to fetch
 */
export function blockTxs(id: string) {
    return fetch(`${EXP_BACKEND}${IAPIRoute.Block}/${id}${IAPIRoute.Transactions}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.Block + IAPIRoute.Transactions })
    })
}

/**
 *  Fetches a range of latetest transactions
 * 
 * @param limit {string}  - amount to fetch from latest transaction
 * @param offset {string} - offset from latest transaction 
 */
export function transactions(limit: string, offset: string, order: string) {
    return fetch(`${EXP_BACKEND}${IAPIRoute.Transactions}?limit=${limit}&offset=${offset}&order=${order}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response.status == 200)
                return Promise.resolve(response.json())
            else
                return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.Transactions })
        })
}

/**
 * Fetches a transaction with a hash
 * 
 * @param hash {string} - hash of the transaction to fetch
 */
export function transaction(hash: string) {
    return fetch(`${EXP_BACKEND}${IAPIRoute.Transaction}/${hash}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.Transaction })
    })
}

/**
 * Fetches a block or transaction from the blockchain via a POST request containing 
 * the ID of the item to retrieve
 * 
 * @param id {string} - id of the block or transaction to fetch
 * @returns 
 */
export function fetchItem(hash: string) {
    return fetch(`${STORAGE_URL}${IAPIRoute.BlockchainEntry}`, {
        method: 'POST',
        body: JSON.stringify([hash]),
        headers: {
            'Content-Type': 'application/json',
            'x-cache-id': generateRandomString(),
            'x-nonce': '0'
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.BlockchainEntry })
    });
}

/**
 * Fetches address balance with a hash
 * 
 * @param id {string} - hash of the address to fetch
 */
export function address(id: string) {
    return fetch(`${EXP_BACKEND}${IAPIRoute.Address}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.Address })
    })
}

/**
 * Fetches address transactions with a hash
 * 
 * @param id {string} - hash of the address to fetch
 */
export function addressTxs(id: string) {
    return fetch(`${EXP_BACKEND}${IAPIRoute.Address}/${id}${IAPIRoute.Transactions}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.Block + IAPIRoute.Transactions })
    })
}

/**
 * Fetches chain circulating supply
 */
export function circulatingSupply() {
    return fetch(`${EXP_BACKEND}${IAPIRoute.CirculatingSupply}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.CirculatingSupply })
    })
}

/**
 * Generates an alphanumeric string of a 32 byte length
 */
function generateRandomString() {
    return [...Array(32)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
}