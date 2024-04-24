import env from "@beam-australia/react-env";

/** NETWORK */
export const STORAGE_URL = env("STORAGE_URL")
export const EXP_BACKEND = env("EXP_BACKEND")
export const NETWORK = env("NETWORK")
export const WEBSITE = env("WEBSITE")

/** BLOCKS */
export const BLOCK_TABLE_HEADERS = ["Number", "Block Hash", "Previous Hash", "Nb of Tx", "Age"]
export const BLOCK_FIELDS = ['Block Hash', 'Previous Hash', 'Block Number', 'Timestamp', 'Merkle Root Hash', 'Unicorn Seed', 'Unicorn Witness', 'Byte Size', 'Version']
export const ITEMS_PER_CHUNK = 20
export const ITEMS_PER_PAGE_SHORT = 6

/** TRANSACTIONS */
export const TXS_TABLE_HEADERS = ["Transaction Hash", "Block Hash", "Type", "Age"]
export const TXS_FIELDS = ['Transaction Hash', 'Block Hash', 'Block Number', 'Transaction Type', 'Timestamp']
export const TXS_IN_FIELDS = ['Previous Out', 'Script Sig']
export const TXS_TK_OUT_FIELDS = ['Address', 'Tokens', 'Fractionated Tokens', 'Locktime']
export const TXS_IT_OUT_FIELDS = ['Address', 'Items', 'Genesis Tx Hash','Metadata', 'Locktime']
export const COINBASE_FIELDS = ['Coinbase Hash', 'Token Reward', 'Fractionated Token Reward', 'Version', 'Script Public Key', 'Locktime']

/** TOKEN */
export const TOKEN_FRACTION = 72072000 // Will change on network update
export const TOKEN_CURRENCY = 'ABC$'
export const TOKEN_SUPPLY = 1250000000
export const HARDCODED_SUPPLY = 94444444

/** ADDRESS */
export const ADDRESS_FIELDS = ['Address', 'Balance', 'Fractionated Token']

