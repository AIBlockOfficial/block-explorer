/** NETWORK */
export const STORAGE_URL = 'https://storage.a-block.net'
export const MEMPOOL_URL = 'https://compute.a-block.net'
// export const MEMPOOL_URL = 'http://49.12.234.10:3003'
// export const STORAGE_URL = 'http://49.12.234.10:3001'

export const EXP_BACKEND = 'http://loki.explorer.se3ker.com/api'

/** BLOCKS */
export const BLOCK_TABLE_HEADERS = ["Number", "Block Hash", "Nb of Tx", "Age"]
export const BLOCK_TABLE_HEADERS_SHORT = ["Number", "Block Hash", "Nb of Tx", "Age"]
export const BLOCK_FIELDS = ['Block Hash', 'Previous Hash', 'Block Number', 'Timestamp', 'Merkle Root Hash', 'Unicorn Seed', 'Unicorn Witness', 'Byte Size', 'Version']
export const ITEMS_PER_CHUNK = 20;
export const ITEMS_PER_PAGE_SHORT = 6;

/** TRANSACTIONS */
export const TXS_TABLE_HEADERS = ["Transaction Hash", "Block Hash", "Type", "Age"]
export const TXS_TABLE_HEADERS_SHORT = ["Tx Hash", "Block Hash", "Type", "Age"]
export const TXS_FIELDS = ['Transaction Hash', 'Block Hash', 'Block Number', 'Transaction Type', 'Timestamp']
export const TXS_IN_FIELDS = ['Previous Out', 'Script Sig']
export const TXS_TK_OUT_FIELDS = ['Address', 'Tokens', 'Fractionated Tokens', 'Locktime']
export const TXS_IT_OUT_FIELDS = ['Address', 'Items', 'Metadata', 'Locktime']

/** TOKEN */
export const TOKEN_FRACTION = 25200
export const TOKEN_CURRENCY = 'ABC'

