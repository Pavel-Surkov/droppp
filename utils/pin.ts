export function generatePin(length = 4): string {
  let result = ''

  for (let index = 0; index < length; index += 1) {
    result += Math.floor(Math.random() * 10).toString()
  }

  return result
}

