module.exports = {
  name: 'act',
  signature:   {
    name: 'act',
    description: 'As a player character, take an action that will update the game state.',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          description: 'the action the player wants to take'
        },
        target: {
          type: 'string',
          bool: 'Does the players action require a target?',
          description: 'Who or want the player wants to act appon'
        }
      },
      required: ['object']
    }
  },
  getConfirmationMessage(args){
    return `Do you want to ${args.action} the ${args.target}.`
  },
  handleInputmatch: function handleInputmatch(inputString) {},
  buildPrompt : function buildPrompt(args) {
    return `You are now the game master. I am a character in your game. I atempt to ${args.action} the ${args.target}. Describe what the results.`
  }
}
