import { IBlockRow } from '@/app/interfaces'

/**
 * Gets all numbers from the start value to the end value, inclusive
 * 
 * @param start {number} - The start value
 * @param end {number} - The end value
 */
export const getRange = (start: number = 0, end: number = 9) => {
    return [...Array(end - start + 1)].map((_, i) => start + i);
}

export function shortenHash(string: string) {
    return string.slice(0, 5) + '...' + string.slice(string.length - 4, string.length)
}

export function displayBigNumbers(number: number) {
    const formattedUS = number.toLocaleString('en-US')
    return formattedUS
}

export function formatBlockTableRows(blocks: any, reversed: boolean) {
    const result: IBlockRow[] = [];
    blocks.forEach((block: any) => {
        // console.log(block)
        result.push({
            number: block[1].block.header.b_num,
            blockHash: block[0],
            status: 'Unknown',
            nbTx: block[1].block.transactions.length,
            age: 'Na',
        } as IBlockRow)
    });

    return reversed ? result.reverse() : result
}

export function isHash(value: string) {
    const regex = /^[a-fA-F0-9]{64,65}$/;
    console.log(regex.test(value))
    console.log('len', value.length)
    return regex.test(value)
}

export function isNum(value: string) {
    const regex = /^[0-9]+$/;
    return regex.test(value)
}