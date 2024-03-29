const tryPrice = document.getElementById('try-price')
const usdPrice = document.getElementById('usd-price')
const feePercentage = document.getElementById('mostaql-fee')
const warner = document.getElementById('warning')

const onPaymentInfo = ({ originalPrice, taxedPrice, priceLimit, TRY }) => {
  if (originalPrice) {
    warner.innerText = ''
    if (originalPrice < priceLimit) {
      tryPrice.style.color = warner.style.color = '#df4578'
      warner.innerText = `Price should be higher than ${priceLimit}$`
    }

    const mostaqlFee = taxedPrice / originalPrice * 100
    const paypalFee = taxedPrice * 0.96
    const tryFinalPrice = paypalFee * TRY - 70
    const usdFinalPrice = tryFinalPrice / TRY

    tryPrice.innerText = `₺${Math.floor(originalPrice * TRY)} → ₺${Math.floor(tryFinalPrice)}`
    usdPrice.innerText = `$${Math.floor(originalPrice)} → $${Math.floor(usdFinalPrice)}`
    feePercentage.innerText = `${Math.floor(mostaqlFee) - 100}%`
  } else {
    tryPrice.innerText = 'N/A'
    usdPrice.innerText = 'N/A'
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const queryInfo = {
    active: true,
    currentWindow: true,
  }

  chrome.tabs.query(queryInfo, (tabs) => {
    const tabId = tabs[0].id
    const messageInfo = { from: 'popup', subject: 'paymentInfo' }

    chrome.tabs.sendMessage(tabId, messageInfo, onPaymentInfo)
  })
})
