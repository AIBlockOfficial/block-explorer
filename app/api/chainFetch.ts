import { EXP_BACKEND } from "../constants";
import { IAPIRoute } from "../interfaces";

/** Fetches blocks count */
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
    });
}

/**
 * Fetches block from its hash or number
 * 
 * @param id {string} - hash or number of the block to fetch
 * @returns 
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
    });
}

/**
 *  Fetches a range of latetest blocks
 * 
 * @param limit {string}  - amount to fetch
 * @param offset {string} - offset from latest block 
 * @returns 
 */
export function blocks(limit: string, offset: string) {
    return fetch(`${EXP_BACKEND}${IAPIRoute.Blocks}?limit=${limit}&offset=${offset}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response.status == 200)
                return Promise.resolve(response.json())
            else
                return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.Blocks })
        })
}

/**
 * Fetches block transactions from its hash or number
 * 
 * @param id {string} - hash or number of the block to fetch
 * @returns 
 */
export function fetchBlockTxs(id: string) {
    return fetch(`${EXP_BACKEND}${IAPIRoute.Block}/${id}/transactions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.Block })
    });
}

/**
 *  Fetches a range of latetest transactions
 * 
 * @param limit {string}  - amount to fetch
 * @param offset {string} - offset from latest transaction 
 * @returns 
 */
export function transactions(limit: string, offset: string) {
    return fetch(`${EXP_BACKEND}${IAPIRoute.Transactions}?limit=${limit}&offset=${offset}`,
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
 * Fetches a transaction from its hash
 * 
 * @param hash {string} - hash of the transaction to fetch
 * @returns 
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
    });
}