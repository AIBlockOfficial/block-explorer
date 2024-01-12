/** ------------ FORMAT VERIFICATION ------------ */
/**
 * Verify if value is a hash
 * Lenght of hash is specified to be 65 because of leading letter (e.g 'b' for block & 'g' for transactions)
 * @param value 
 * @returns 
 */
export function isHash(value: string): boolean {
    const regex = /^[a-fA-F0-9]{64,65}$/; // Determine why hash lenght is 65 when it should be 64
    return regex.test(value)
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