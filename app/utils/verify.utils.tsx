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
    } else if (value.length == 6) { // Check if genesis block transaction (fixed lenght of 6 and starts with 0)
        console.log('?')
        const genesisTxRegex = /0{5}[0-9]/; 
        console.log(genesisTxRegex.test(value))
        return genesisTxRegex.test(value)
    } 
    return false
}

/**
 * Verify if value is a number
 * @param value 
 * @returns boolean
 */
export function isNum(value: string): boolean {
    const regex = /^[0-9]+$/;
    return regex.test(value)
}