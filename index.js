const fs = require('fs');
const { Command } = require('commander');
const program = new Command();


program.command('add')
    .description('Add entry to our to do list')
    .requiredOption('-t, --title <string>', 'the title of entry (required)')
    .action((options) => {
        // Read the existing todos from the file
        let todos = [];
        // todos = JSON.parse(fs.readFileSync('./db.json', 'utf-8')) || [];
        // Check if the file exists, if not create it

        // Check if file exists and read it
        if (fs.existsSync('./db.json')) {
            const data = fs.readFileSync('./db.json', 'utf-8');
            if (data) {
                todos = JSON.parse(data);
            }
        }

        // Add the new todo to the list

        // Generate a new ID (max existing ID + 1, or 1 if empty)
        const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;

        const todo = {
            id: newId,
            title: options.title,
            status: 'to-do'  // Default status
        };

        todos.push(todo);
        // Write the updated todos back to the file
        fs.writeFileSync('./db.json', JSON.stringify(todos, null, 4), 'utf-8');
        console.log("Todo added successfully.");
    });





program.command('list')
    .description('List all Entries')
    .option('-s, --status <string>', 'filter by status [to-do, in progress, done]')
    .action((options) => {
        // Check if file exists and read it
        if (fs.existsSync('./db.json')) {
            const data = fs.readFileSync('./db.json', 'utf-8');
            if (data) {
                todos = JSON.parse(data);

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
            } else {
                console.log("No todos found.");
            }
        }
    });


program.command('edit')
    .description('Edit the entry through the id')
    .option('-t, --title <string>', 'the editing title (required)')
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

        // Check if file exists and read it
        if (fs.existsSync('./db.json')) {
            const data = fs.readFileSync('./db.json', 'utf-8');
            if (data) {
                todos = JSON.parse(data);
            } else {
                console.log("No todos found.");
                return;
            }
        }

        // Find the todo with the given id
        const todoIndex = todos.findIndex(todo => todo.id === targetId);
        if (todoIndex === -1) {
            console.log("Todo not found.");
            return;
        } else {
            // Update the todo title
            // todos[todoIndex].title = options.title;

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

            // Write the updated todos back to the file
            fs.writeFileSync('./db.json', JSON.stringify(todos, null, 4), 'utf-8');
            console.log(`Todo ${options.id} updated successfully.`);
        }
    });



program.command('delete <id>')
    .description('delete the entry using the id')
    // .option('-i, --id <int>', 'the id of the editing entry (required)')
    .action((id) => {
        // Convert id to number
        const targetId = parseInt(id);
        if (isNaN(targetId)) {
            console.log("Invalid ID - must be a number.");
            return;
        }

        // Check if file exists and read it
        if (fs.existsSync('./db.json')) {
            const data = fs.readFileSync('./db.json', 'utf-8');
            if (data) {
                todos = JSON.parse(data);
            } else {
                console.log("No todos found.");
                return;
            }
        }


        // Find the todo with the given id
        const todoIndex = todos.findIndex(todo => todo.id === targetId);
        if (todoIndex === -1) {
            console.log("Todo not found.");
            return;
        } else {
            // Remove the todo from the list
            todos.splice(todoIndex, 1);
            // Update the IDs of the remaining todos
            for (let i = todoIndex; i < todos.length; i++) {
                todos[i].id = i + 1;
            }
            // Write the updated todos back to the file
            fs.writeFileSync('./db.json', JSON.stringify(todos, null, 4), 'utf-8');
            console.log(`Todo ${todoIndex + 1} deleted successfully.`);
        }
    });


program.parse();