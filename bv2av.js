function dec(x) {
  var table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
  var s = [11, 10, 3, 8, 4, 6]
  var tr = {}
  for (let i = 0; i < 58; i++) {
    tr[table[i]] = i
  }
  var xor = 177451812
  var add = 8728348608
  let r = 0
  for (let i = 0; i < 6; i++) {
    r += tr[x[s[i]]] * Math.pow(58, i)
  }
  const temp = (r - add) ^ xor
  return 'av' + temp
}

function enc(x) {
  var table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
  var xor = 177451812
  var add = 8728348608
  var s = [11, 10, 3, 8, 4, 6]
  x = x.slice(2)
  x = (x ^ xor) + add
  var r = 'BV1  4 1 7  '.split('')
  for (let i = 0; i < 6; i++) {
    r[s[i]] = table[Math.floor(x / Math.pow(58, i)) % 58]
  }
  return r.join('')
}

export { dec, enc }
