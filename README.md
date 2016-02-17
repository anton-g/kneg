# kneg
kneg is a simple todo list manager for the command line.  

```
$ kneg -a "My first task"
$ kneg
    #1 | My first task
$ kneg -a "My second task"
$ kneg
    #1 | My first task
    #2 | My second task
$ kneg -c 1
$ kneg
    #2 | My second task
```

**Feedback welcome**

## Installation
Soon on npm

## Basic usage

Add a task using the `-a` or `--add` option:
```
$ kneg -a "that thing i need to do"
```

See your tasks by not passing any option:
```
$ kneg
   1 | that thing i need to do
```

Set tasks as completed by passing the `-c` or `--complete` option with task id as value:
```
$ kneg -c 1
```

## Deadlines
You can add deadlines to tasks by passing the `-d` or `--deadline` modifier when adding tasks. The value should follow `YYYY-MM-DD` or `YYYY-MM-DD HH:mm` format:
```
$ kneg -a "task with deadline" -d 2016-05-20
$ kneg
   1 | task with deadline • in 2 months 
```
Additionally you can also specify a delay instead of a fixed date. You specify your delay with the a value and a letter (`s`econds, `m`inutes, `h`ours, `d`ays, `w`eeks, `M`onths or `y`ears).
```
$ kneg -a "Stuff to do" -d 5d
```

## Modify tasks
You can also modify tasks by selecting them with `-t` or `--task` and the task id as value and then applying a modifier:
```
$ kneg
   1 | Stuff to do
$ kneg -t 1 -d 2d
$ kneg
   1 | Stuff to do • in 2 days
```

## Subtasks
Finally, all tasks can have subtasks. They're added by first selecting a task and using the `-a` or `--add` option:

```
$ kneg
   1 | Stuff to do
$ kneg -t 1 -a "Some minor stuff to do"
$ kneg
   1 | Stuff to do
      1 | Some minor stuff to do
```

Subtask id's uses dot notation (supertask.childtask):
```
$ kneg
   1 | Stuff to do
      1 | Some minor stuff to do
      2 | Minor task again
$ kneg -c 1.1
$ kneg
   1 | Stuff to do
      2 | Minor task again
```

Subtasks can have their own subtasks. It's theoretically possible to subtask an infinite amount of subtask levels:
```
$ kneg
   1 | Stuff to do
      1 | Some minor stuff to do
$ kneg -t 1.1 -a "Very minor stuff"
$ kneg
   1 | Stuff to do
      1 | Some minor stuff to do
         1 | Very minor stuff
```

## License
kneg is available under MIT license. See LICENSE file for more information.
