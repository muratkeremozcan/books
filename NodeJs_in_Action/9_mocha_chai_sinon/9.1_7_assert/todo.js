class Todo {
  constructor() {
    this.todos = [];
  }

  add(item) {
    if (!item) throw new Error('Todo.prototype.add requires an item');
    this.todos.push(item); // add the item to the todo array
  }

  deleteAll() {
    this.todos = [];
  }

  get length() {
    return this.todos.length;
  }

  doAsync(cb) {
    setTimeout(cb, 2000, true);
  }
}

module.exports = Todo;