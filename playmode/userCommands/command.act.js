module.exports = {
  name: 'act',
  signature:   {
    name: 'act',
    description: 'A broad default function for handling any kind of action.',
    parameters: {
      type: 'object',
      properties: {
        mainVerb: {
          type: 'string',
          description: 'the main verb from the players input'
        },
        directObject: {
          type: 'string',
          description: 'If the main verb takes a direct object, this is the direct object. should be a noun phrase. Can be null'
        },
        indirectObject: {
          type: 'string',
          description: 'If the main verb takes an indirect object, this is the indirect object. should be a noun phrase. Can be null'
        },
        playerIntent: {
          type: 'string',
          description: 'summerize the players goal briefly.'
        }
      },
      required: ['object']
    }
  },
  getConfirmationMessage(args) {
    const argsString = JSON.stringify(args);
    return `Freeform action with ${argsString}.`;
  },
  handleInputmatch: function handleInputmatch(inputString) {},
  buildPrompt : function buildPrompt(args) {
    return `I atempt to ${args.mainVerb} the ${args.directObject}. Describe what the results.`
  }
}
