const NumberUtils = {
  inRange(value: number, min: number, max: number) {
    return value >= min && value <= max
  },
  isNumericString(str: string) {
    return /^-?\d+$/.test(str)
  },
}

export default NumberUtils
