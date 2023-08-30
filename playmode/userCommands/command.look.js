module.exports = {
  name: 'look',
  signature:   {
    name: 'look',
    description: 'Look at something in the players location',
    parameters: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'What the player wanted to look at'
        }
      },
      required: ['object']
    }
  },
  getConfirmationMessage(args){
    return `Do you want to LOOK at the ${args.target}.`
  },
  handleInputmatch: function handleInputmatch(obj) {},
  buildPrompt : function buildPrompt(args) {
    return ` I look at the ${args.target}. Describe what I see.`
  }
}
