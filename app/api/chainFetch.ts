const STORAGE_URL = 'https://storage.a-block.net';
const MEMPOOL_URL = 'https://compute.a-block.net';



/**
 * Generates an alphanumeric string of a 32 byte length
 */
function generateRandomString() {
    return [...Array(32)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
}

/** Fetches a block/s by their numbers */
export function fetchBlocks(blockNumbers: number[]) {
    return fetch(`${STORAGE_URL}/block_by_num`, {
        method: 'POST',
        body: JSON.stringify(blockNumbers),
        headers: {
            'Content-Type': 'application/json',
            'x-cache-id': generateRandomString(),
            'x-nonce': '0'
        }
    }).then(response => response.json())
    .catch(error => console.log("Error:", error));
}

/**
 * Fetches a block or transaction from the blockchain via a POST request containing 
 * the ID of the item to retrieve
 * 
 * @param id {string} - id of the block or transaction to fetch
 * @returns 
 */
export function fetchItem(id: string) {
    console.log({
        method: 'POST',
        body: id,
        headers: {
            'Content-Type': 'application/json',
            'x-cache-id': generateRandomString(),
            'x-nonce': '0'
        }
    });
    return fetch(`${STORAGE_URL}/blockchain_entry`, {
        method: 'POST',
        body: id,
        headers: {
            'Content-Type': 'application/json',
            'x-cache-id': generateRandomString(),
            'x-nonce': '0'
        }
    }).then(response => response.json())
    .catch(error => console.log("Error:", error));
}