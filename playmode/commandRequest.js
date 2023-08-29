class CommandRequest {
  constructor(originalInput, command, args) {
    this.originalInput = originalInput;
    this.command = command;
    this.args = args
  }
}

module.exports = {
  CommandRequest: CommandRequest
};
