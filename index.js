const roll = require('./roll')
const TelegramBot = require('node-telegram-bot-api')
const TOKEN = process.env.TELEGRAM_TOKEN

const options = {
  webHook: {
    port: process.env.PORT
  }
}
const url = process.env.APP_URL || 'https://super-dice-roll.herokuapp.com:443'
const bot = new TelegramBot(TOKEN, options)

bot.setWebHook(`${url}/bot${TOKEN}`)

// Matches /help
bot.onText(/\/help/, (msg) => {
  let helpMessage = 'Using Inline chat command:\n' +
    'Just type, in any chat, @SuperDiceRoll_bot and' +
    '\nchoose in the menu which dice you want to roll.\n\n' +
    'Or using /roll command:\n'
  helpMessage += roll.errorMessage
  bot.sendMessage(msg.chat.id, helpMessage)
})

// Matches /roll
bot.onText(/\/roll(?!.+)/, (msg) => {
  bot.sendMessage(msg.chat.id, roll.errorMessage)
})

// Matches /roll [whatever]
bot.onText(/\/roll (.+)/, (msg, match) => {
  const inputMessage = match[1]

  let parsedRoll = roll.parseMessage(inputMessage)
  let rollData = roll.calculateInput(parsedRoll)
  let outMessage = roll.outputMessage(msg.from.username, inputMessage, rollData)

  bot.sendMessage(msg.chat.id, outMessage)
})

// Matches InlineQuery
bot.on('inline_query', function (msg) {
  let results = roll.getInlineDiceList(msg.from.username, msg.query)
  bot.answerInlineQuery(msg.id, results, {cache_time: 0})
})
