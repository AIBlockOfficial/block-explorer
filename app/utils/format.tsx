export function shorten_hash(string: string) {
    return string.slice(0, 5) + '...' + string.slice(string.length - 4, string.length)
}

export function display_big_numbers(number: number) {
    const formattedUS = number.toLocaleString('en-US')
    return formattedUS
}