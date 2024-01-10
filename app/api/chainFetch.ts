import { STORAGE_URL } from "../constants";
import { IAPIRoute } from "../interfaces";

/**
 * Generates an alphanumeric string of a 32 byte length
 */
function generateRandomString() {
    return [...Array(32)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
}

/** Fetches a block/s by their numbers */
export function fetchBlocks(blockNumbers: number[]) {
    return fetch(`${STORAGE_URL}${IAPIRoute.BlockByNum}`, {
        method: 'POST',
        body: JSON.stringify(blockNumbers),
        headers: {
            'Content-Type': 'application/json',
            'x-cache-id': generateRandomString(),
            'x-nonce': '0'
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.BlockByNum })
    })
}

/** Fetches a block/s by their numbers */
export function fetchLatest() {
    return fetch(`${STORAGE_URL}${IAPIRoute.LatestBlock}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-cache-id': generateRandomString(),
            'x-nonce': '0'
        }
    }).then((response) => {
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.LatestBlock })
    });
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
        body: JSON.stringify(hash),
        headers: {
            'Content-Type': 'application/json',
            'x-cache-id': generateRandomString(),
            'x-nonce': '0'
        }
    }).then((response) => {
        console.log(response.status, response.statusText)
        if (response.status == 200)
            return Promise.resolve(response.json())
        else
            return Promise.reject({ reason: response.statusText, status: response.status, route: IAPIRoute.BlockchainEntry })
    });
}