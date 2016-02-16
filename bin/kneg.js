#!/usr/bin/env node

var fs          = require('fs'),
    program     = require('commander'),
    jsonfile    = require('jsonfile'),
    _           = require('underscore'),
    chalk       = require('chalk'),
    moment      = require('moment');

//temp
jsonfile.spaces = 4;
//

var file = './data/data.json';

var data = {};
try {
    fs.accessSync(file, fs.F_OK);
    data = jsonfile.readFileSync(file, {
        throws: false
    });
} catch (e) {
    data = {
        tasks: []
    };
}

program
    .version('0.1.0')
    .option('-t, --task <id>', 'Select task')
    .option('-v, --verbose', 'Include completed tasks when displaying tasks.')
    .option('-d, --deadline <deadline>', 'Set deadline for task')
    .option('-a, --add <task>', 'Add new task', addTask)
    .option('-c, --complete <id>', 'Complete task', complete)
    .option('-s, --show <id>', 'Display a single task', printDetail)
    .option('-b, --beta <date>', 'Remove me in production', parseDeadline)
    .parse(process.argv);

printAll();

function complete(taskId) {
    var task = getTask(taskId);
    if (task) {
        markAsCompleted(task);
        recComplete(task.tasks);

        save();
    } else {
        console.log('No task with id: ' + taskId);
    }
}

function recComplete(tasks) {
    _.each(tasks, function(t) {
        markAsCompleted(t);
        recComplete(t.tasks);
    });
}

function markAsCompleted(task) {
    task.completed = true;
    task.completedDate = new Date();
}

function addTask(desc) {
    var newTask = {
        id: NaN,
        desc: desc,
        completed: false,
        addDate: new Date(),
        tasks: []
    };

    if (program.deadline) {
        newTask.deadline = parseDeadline(program.deadline);
    }

    if (program.task) {
        var supertask = getTask(program.task);
        if (!supertask) {
            console.log('No task with that id.');
            return;
        }

        //TODO Handle add tasks to completed tasks?
        newTask.id = supertask.tasks.length + 1;
        supertask.tasks.push(newTask);
    } else {
        newTask.id = data.tasks.length + 1;
        data.tasks.push(newTask);
    }

    save();
}

function printAll() {
    recPrintAll(data.tasks, 1);
}

function recPrintAll(tasks, offset) {
    var sortedTasks = _.sortBy(tasks, function(t) { return t.completed });
    _.each(sortedTasks, function(t) {
        printTask(t, offset);
        recPrintAll(t.tasks, offset + 1);
    });
}

function printTask(t, offsetCount) {
    var offset = '';
    for (var i = 0; i < offsetCount; i++) {
        offset += '   ';
    }

    if (t.completed == false) {
        console.log(offset + t.id + ' │ ' + t.desc);
    } else if (program.verbose) {
        console.log(offset + chalk.dim(t.id + ' │ ' + t.desc));
    }
}

function printDetail(t) {
    var task = getTask(t);
    if (task) {
        console.log('---------------------------------' + '\n' +
            '   ' + task.desc + '\n' +
            'Subtasks: ' + task.tasks.length + '\n' +
            'Added: ' + task.addDate
        );
        if (task.done) console.log('Completed: ' + task.completedDate);
        if (task.deadline) console.log('X days left');
        console.log('---------------------------------');
    }
}

function getTask(input) {
    var ids = parseIds(input);

    var task = {
        tasks: data.tasks
    };

    for (var i = 0; i < ids.length; i++) {
        task = _.findWhere(task.tasks, { id: ids[i] });
    }

    if (task && task.id) {
        return task;
    } else {
        return null;
    }
}

function parseIds(input) {
    return _.map(input.split('.'), function(id) {
        return parseInt(id)
    });
}

function parseDeadline(d) {
    var date = moment(d, ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm'], true);
    if (date.isValid()) {
        return date;
    } else {
        var re = /^([0-9]+)([mhdwMy]){1}$/;
        var test = re.exec(d);

        if (test) {
            var num = test[1];
            var char = test[2];
            var fromNow = moment().add(num, char);
            return fromNow;
        } else {
            //Not valid
        }
    }
}

function save() {
    jsonfile.writeFile(file, data, function(err) {
        if (err) {
            console.log(chalk.red('Something went wrong while saving: ' + err.message));
        }
    });
}