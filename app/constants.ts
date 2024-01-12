/** NETWORK */
export const STORAGE_URL = 'https://storage.a-block.net'
export const MEMPOOL_URL = 'https://compute.a-block.net'

/** BLOCKS */
export const BLOCK_TABLE_HEADERS = ["Number", "Block Hash", "Status", "Nb of Tx", "Age"]
export const BLOCK_TABLE_HEADERS_SHORT = ["Number", "Block Hash", "Status", "Age"]
export const BLOCK_FIELDS = ['Block Hash', 'Previous Hash', 'Block Number', 'Block Status', 'Timestamp', 'Merkle Root Hash', 'Unicorn Seed', 'Unicorn Witness', 'Byte Size', 'Version']
export const BLOCKS_PER_CHUNK = 20;
export const BLOCK_PER_PAGE_SHORT = 6;

/** TRANSACTIONS */
export const TXS_TABLE_HEADERS = ["Transaction Hash", "Block Num.", "Type", "Status", "Address", "Age"]
export const TXS_TABLE_HEADERS_SHORT = ["TxHash", "Type", "Status", "Age"]
export const TXS_FIELDS = ['Transaction Hash', 'Previous Hash', 'Block Number', 'Transaction Type', 'Transaction Status', 'Sender Address', 'Timestamp']
