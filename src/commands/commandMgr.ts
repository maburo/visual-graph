export interface Command {
  execute(): void;
  undo(): void;
}

export default class CommandManager {
  private readonly historySize: number;
  private readonly undoStack: Command[] = [];
  private readonly redoStack: Command[] = [];

  constructor(historySize: number = 10) {
    this.historySize = historySize;
  }

  execute(cmd: Command) {
    cmd.execute();
    this.redoStack.length = 0;
    this.internalExecute(cmd);
  }

  private internalExecute(cmd: Command) {
    console.log('execute', cmd);
    
    this.undoStack.push(cmd);
    if (this.undoStack.length > this.historySize) {
      this.undoStack.shift();
    }
  }

  undo() {
    if (this.undoStack.length > 0) {
      const cmd = this.undoStack.pop();
      console.log('undo', cmd);
      
      cmd.undo();
      this.redoStack.push(cmd);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      this.internalExecute(this.redoStack.pop());
    }
  }
}