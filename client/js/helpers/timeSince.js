module.exports = function (date) {
  date = new Date(date)
  var seconds = Math.floor((Date.now() - date) / 1000)

  var suffix = 'ago'
  if (seconds < 0) {
    seconds = Math.abs(seconds)
    suffix = 'to go'
  }

  var interval = Math.floor(seconds / 31536000)

  if (interval > 1) {
    return interval + ' years ' + suffix
  }
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) {
    return interval + ' months ' + suffix
  }
  interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return interval + ' days ' + suffix
  }
  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    return interval + ' hours ' + suffix
  }
  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    return interval + ' minutes ' + suffix
  }

  return Math.floor(seconds) + ' seconds ' + suffix
}
