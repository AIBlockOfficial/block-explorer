/** ------------ FORMAT VERIFICATION ------------ */
/**
 * Verify if value is a hash
 * Lenght of hash is specified to be 65 because of leading letter (e.g 'b' for block & 'g' for transactions)
 * @param value 
 * @returns 
 */
export function isHash(value: string): boolean {
    if (value[0] == 'b' || value[0] == 'g') { //Valid hash from the chain
        const hashRegex = /^[a-fA-F0-9]{65}$/; // Determine why hash lenght is 65 when it should be 64
        return hashRegex.test(value)
    }
    return false
}

/**
 * Verify if value is a number
 * @param value 
 * @returns boolean
 */
export function isNum(value: string): boolean {
    if (isGenesisTx(value))
        return false
    const regex = /^[0-9]+$/;
    return regex.test(value)
}

/**
 * Check if genesis block transaction
 * @param value 
 * @returns 
 */
export function isGenesisTx(value: string): boolean {
    if (value.length == 6) {
        const genesisTxRegex = /0{4}[0-1]{2}/;
        return genesisTxRegex.test(value)
    }
    return false
}