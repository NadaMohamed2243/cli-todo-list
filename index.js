const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

// Function to read todos from file
function readTodos() {
    if (fs.existsSync('./db.json')) {
        const data = fs.readFileSync('./db.json', 'utf-8');
        return data ? JSON.parse(data) : [];
    }
    return [];
}

// Function to write todos to file
function writeTodos(todos) {
    fs.writeFileSync('./db.json', JSON.stringify(todos, null, 4), 'utf-8');
}

program.command('add')
    .description('Add entry to our to do list')
    .requiredOption('-t, --title <string>', 'the title of entry (required)')
    .action((options) => {
        const todos = readTodos();

        // Generate a new ID (max existing ID + 1, or 1 if empty)
        const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;

        const todo = {
            id: newId,
            title: options.title,
            status: 'to-do'  // Default status
        };

        todos.push(todo);
        writeTodos(todos);
        console.log("Todo added successfully.");
    });

program.command('list')
    .description('List all Entries')
    .option('-s, --status <string>', 'filter by status [to-do, in progress, done]')
    .action((options) => {
        const todos = readTodos();

        if (todos.length === 0) {
            console.log("No todos found.");
            return;
        }

        let filteredTodos = todos;
        if (options.status) {
            const validStatuses = ['to-do', 'in progress', 'done'];
            if (!validStatuses.includes(options.status)) {
                console.log(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
                return;
            }
            filteredTodos = todos.filter(todo => todo.status === options.status);
            if (filteredTodos.length === 0) {
                console.log(`No todos found with status: ${options.status}`);
                return;
            }
        }

        console.log(filteredTodos);
    });

program.command('edit')
    .description('Edit the entry through the id')
    .option('-t, --title <string>', 'the editing title')
    .option('-s, --status <string>', 'new status [to-do, in progress, done]')
    .requiredOption('-i, --id <int>', 'the id of the editing entry (required)')
    .action((options) => {
        if (!options.title && !options.status) {
            console.log('At least one of --title or --status must be specified');
            return;
        }

        const targetId = parseInt(options.id);
        if (isNaN(targetId)) {
            console.log("Invalid ID - must be a number.");
            return;
        }

        const todos = readTodos();
        const todoIndex = todos.findIndex(todo => todo.id === targetId);

        if (todoIndex === -1) {
            console.log("Todo not found.");
            return;
        }

        if (options.title) {
            todos[todoIndex].title = options.title;
        }

        if (options.status) {
            const validStatuses = ['to-do', 'in progress', 'done'];
            if (!validStatuses.includes(options.status)) {
                console.log(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
                return;
            }
            todos[todoIndex].status = options.status;
        }

        writeTodos(todos);
        console.log(`Todo ${options.id} updated successfully.`);
    });

program.command('delete <id>')
    .description('delete the entry using the id')
    .action((id) => {
        const targetId = parseInt(id);
        if (isNaN(targetId)) {
            console.log("Invalid ID - must be a number.");
            return;
        }

        const todos = readTodos();
        const todoIndex = todos.findIndex(todo => todo.id === targetId);

        if (todoIndex === -1) {
            console.log("Todo not found.");
            return;
        }

        todos.splice(todoIndex, 1);
        // Update the IDs of the remaining todos
        for (let i = todoIndex; i < todos.length; i++) {
            todos[i].id = i + 1;
        }

        writeTodos(todos);
        console.log(`Todo ${targetId} deleted successfully.`);
    });

program.parse();