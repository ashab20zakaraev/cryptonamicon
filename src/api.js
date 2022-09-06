const API_KEY =
  "f9cbd292644411f0bc26a419347cc0a8531bec717c4f91da916b15be9ed9a8b7"

const tickersHandlers = new Map()
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
)
const AGGREGATE_INDEX = "5"

socket.addEventListener("message", (event) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(event.data)

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return
  }

  const handlers = tickersHandlers.get(currency) ?? []
  handlers.forEach((fn) => fn(newPrice))
})

function sendToWebSocket(message) {
  const stringifidMessage = JSON.stringify(message)

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifidMessage)
    return
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifidMessage)
    },
    { once: true }
  )
}

function subscribeToTockerOnWebSocket(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  })
}

function unsubscribeFromTockerOnWebSocket(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  })
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || []
  tickersHandlers.set(ticker, [...subscribers, cb])

  subscribeToTockerOnWebSocket(ticker)
}

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker)

  unsubscribeFromTockerOnWebSocket(ticker)
}

export const getAllTickers = () => {
  return fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  )
    .then((response) => response.json())
    .then((data) => Object.getOwnPropertyNames(data.Data))
}
