module.exports = {
  name: 'move',
  signature:   {
    name: 'move',
    description: 'As a player character move to a new location.',
    parameters: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          description: 'Where the player wants to go'
        },
        conveyance: {
          type: 'string',
          bool: 'Did the player specify a conveyance?',
          description: 'How the player wants to get there'
        }
      },
      required: ['object']
    }
  },
  getConfirmationMessage(args){
    if(args.conveyance) return `Do you want to Move to ${args.destination}, by ${args.conveyance}.`
    return `Do you want to Move to ${args.destination}.`
  },
  handleInputmatch: function handleInputmatch(inputString) {},
  buildPrompt : function buildPrompt(args) {
    return `You are now the game master. I am a character in your game. I to Move to ${args.destination}, by ${args.conveyance}. Describe what the results.`
  }
}
