/** ------------ DISPLAY FORMAT ------------ */

import { FetchedTransaction, TransactionData } from "@/app/interfaces";

/**
 * Gets all numbers from the start value to the end value, inclusive
 * 
 * @param start {number} - The start value
 * @param end {number} - The end value
 */
export const getRange = (start: number = 0, end: number = 9) => {
  return [...Array(end - start + 1)].map((_, i) => start + i);
}

/**
 * Shorten hash for display.
 * Used first 5 and last 4 chars in hash (e.g b003f943cd06 -> b003f...cd06)
 * @param string 
 * @returns hash string in shortened format
 */
export function shortenHash(string: string): string {
  return string.slice(0, 5) + '...' + string.slice(string.length - 4, string.length)
}

/**
 * Format number (includes commas, e.g 1000 -> 1,000)
 * @param number | string
 * @returns string with formated number
 */
export const formatNumber = (num: string | number): string => {
  let target = "";
  if (num) {
    if (typeof num === "number") target = num.toString();
    else target = num;
  }
  return target.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatAddressForDisplay = (address: string, nbChar: number) => {
  if (address) {
    let displayAddress = address;
    if (address.length > nbChar) {
      displayAddress =
        address.substring(0, nbChar / 2) +
        "..." +
        address.substring(address.length - nbChar / 2, address.length);
    }
    return displayAddress;
  } else {
    return "N/A";
  }
};

export const formatAmount = (tx: FetchedTransaction, aggregated: boolean) => {
  let result = 0;
  if (tx.outs.length > 1) {
    if (tx.outs[0].valueType == 'token') {
      if (!aggregated)
        result = parseInt(tx.outs[0].amount)
      else
        result = tx.outs.reduce(
          (acc: number, o: any) => acc + o.value,
          0
        );
    }
  } else if (tx.outs.length != 0) {
    if (tx.outs[0].valueType == 'token') {
      result += parseInt(tx.outs[0].amount);
    }
  }
  return formatNumber((result / 25200).toFixed(2));
};

/**
 * Get unicorn seed from raw unicorn value
 * @param rawUnicornArray 
 * @returns string
 */
export const getUnicornSeed = (rawUnicornArray: any[]): string => {
  const unicornSplit = getUnicornSplit(rawUnicornArray);
  return unicornSplit[0];
};

/**
 * Get unicorn witness from raw unicorn value
 * @param rawUnicornArray 
 * @returns string
 */
export const getUnicornWitness = (rawUnicornArray: any[]): string => {
  const unicornSplit = getUnicornSplit(rawUnicornArray);
  return unicornSplit[1];
};

/**
 * Split unicorn value into seed and witness values
 * @param rawUnicornArray 
 * @returns Array of string
 */
export const getUnicornSplit = (rawUnicornArray: any[]): string[] => {
  const unicornSeed = binToString(rawUnicornArray);
  return unicornSeed.split("-");
};

/**
 * Binary to string
 * @param array 
 * @returns string
 */
export const binToString = (array: any[]): string => {
  return String.fromCharCode.apply(String, array);
};

export const timestampElapsedTime = (date: string) => {
  const current = new Date(date)
  const now = new Date()
  const elapsed = now.getTime() - current.getTime();
  const seconds = Math.round(elapsed / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)
  const months = Math.round(days / 30)
  const years = Math.round(months / 12)

  if (seconds < 60)
    return seconds + 's'
  else if (minutes < 60)
    return minutes + 'min'
  else if (hours < 24)
    return hours + 'h'
  else if (days < 30)
    return days + 'd'
  else if (months < 12)
    return months + 'm'
  else
    return years + 'y'
}