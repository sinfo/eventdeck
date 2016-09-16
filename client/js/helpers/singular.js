module.exports = function (el) {
  el.innerHTML = el.innerText.substring(0, el.innerText.length - 1)
}
