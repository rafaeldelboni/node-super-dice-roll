const roll = require('./roll')

describe('Roll', () => {
  describe('Parse Roll Message', () => {
    it('2d6+2 should parse to equal 2 dices of 6 faces plus modifier of +2', () => {
      expect(roll.parseMessage('2d6+2')).toEqual({
        'times': 2,
        'dice': 6,
        'modifier': 2
      })
    })
    it('d12 should parse to equal 1 dice of 12 faces with no modifier', () => {
      expect(roll.parseMessage('d12')).toEqual({
        'times': 1,
        'dice': 12,
        'modifier': 0
      })
    })
    it('D20+1 should parse to equal 1 dice of 20 faces with modifier of +1', () => {
      expect(roll.parseMessage('D20+1')).toEqual({
        'times': 1,
        'dice': 20,
        'modifier': 1
      })
    })
    it('3D4 should parse to equal 3 dices of 4 faces with no modifier', () => {
      expect(roll.parseMessage('3D4')).toEqual({
        'times': 3,
        'dice': 4,
        'modifier': 0
      })
    })
    it('101D6 shouldnt parse and return false', () => {
      expect(roll.parseMessage('101D6')).toEqual(false)
    })
    it('Completely wrong input message shouldnt parse and return false', () => {
      expect(roll.parseMessage('wrong')).toEqual(false)
    })
    it('Not so wrong input message shouldnt parse and return false', () => {
      expect(roll.parseMessage('dwrong+d-')).toEqual(false)
    })
  })

  describe('Calculate Parsed Message', () => {
    it('d20 should parse to equal 1 dice of 20 faces', () => {
      let parsedRoll = roll.parseMessage('d20')
      let rollData = roll.calculateInput(parsedRoll)
      expect(rollData.rolls.length).toBe(1)
      expect(rollData.sum).toBeGreaterThanOrEqual(1)
      expect(rollData.sum).toBeLessThanOrEqual(20)
    })
    it('2d6+2 should parse to equal 2 dices of 6 faces plus modifier of +2', () => {
      let parsedRoll = roll.parseMessage('2d6+2')
      let rollData = roll.calculateInput(parsedRoll)
      expect(rollData.rolls.length).toBe(2)
      expect(rollData.sum).toBeGreaterThanOrEqual(4)
      expect(rollData.sum).toBeLessThanOrEqual(14)
    })
    it('10d4 should parse to equal 10 dices of 4 faces with no modifier', () => {
      let parsedRoll = roll.parseMessage('10d4')
      let rollData = roll.calculateInput(parsedRoll)
      expect(rollData.rolls.length).toBe(10)
      expect(rollData.sum).toBeGreaterThanOrEqual(10)
      expect(rollData.sum).toBeLessThanOrEqual(40)
    })
    it('d12-2 should parse to equal 1 dice of 12 faces subtract modifier of -2', () => {
      let parsedRoll = roll.parseMessage('d12-2')
      let rollData = roll.calculateInput(parsedRoll)
      expect(rollData.rolls.length).toBe(1)
      expect(rollData.sum).toBeGreaterThanOrEqual(-1)
      expect(rollData.sum).toBeLessThanOrEqual(10)
    })
  })

  describe('Show Output Message', () => {
    it('2d6+2 should parse to equal 2 dices of 6 faces plus modifier of +2', () => {
      let inputMessage = '2d6+2'
      let rollData = {sum: 10, rolls: [5, 3]}
      let outMessage = roll.outputMessage('Rafael', inputMessage, rollData)
      expect(outMessage).toEqual('Rafael rolled 2d6+2 \nEach result: 5, 3 \nTotal: 10')
    })
    it('Wrong input message shouldnt parse and return error message', () => {
      let inputMessage = 'wrong'
      let parsedRoll = roll.parseMessage(inputMessage)
      let rollData = roll.calculateInput(parsedRoll)
      let outMessage = roll.outputMessage('Rafael', inputMessage, rollData)
      expect(outMessage).toMatch('You must specify dice and modifiers in following format:')
    })
    it('Empty input message shouldnt parse and return error message', () => {
      let inputMessage = ''
      let parsedRoll = roll.parseMessage(inputMessage)
      let rollData = roll.calculateInput(parsedRoll)
      let outMessage = roll.outputMessage('Rafael', inputMessage, rollData)
      expect(outMessage).toMatch('You must specify dice and modifiers in following format:')
    })
  })

  describe('Inline Query Message', () => {
    it('should get a list with all avaiable dices', () => {
      let inlineResult = roll.getInlineDiceList('Rafael', '')
      expect(inlineResult.length).toBe(6)
    })
    it('should get a list with one dice d6', () => {
      let inlineResult = roll.getInlineDiceList('Rafael', 'd6')
      expect(inlineResult.length).toBe(1)
      expect(inlineResult[0].title).toEqual('D6')
    })
    it('should get a list with tow dices d10 and d12', () => {
      let inlineResult = roll.getInlineDiceList('Rafael', 'd1')
      expect(inlineResult.length).toBe(2)
    })
  })
})
