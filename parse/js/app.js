/*
 script for the index.html file
 */

Parse.initialize("hAdeEEc3LxxubodWolcdUYqY2eYgqOT5jfYbFDEt", "4oaHNOtTYKlNlNkhtG0dWlufXlb1pEehg6JiQPAS");

$(function() {
    'use strict';

    var Task = Parse.Object.extend('Task');
    var tasksQuery = new Parse.Query(Task);
    tasksQuery.ascending('createdAt');
    tasksQuery.notEqualTo('done', true);

    //reference to the task list element
    var tasksList = $("#tasks-list");
    //reference to the error message alert
    var errorMessage = $('#error-message');

    //current set of tasks
    var tasks = [];

    //reference to rating element
    var ratingElem = $("#rating");

    function displayError(err) {
        errorMessage.text(err.message);
        errorMessage.fadeIn();
    }

    function clearError() {
        errorMessage.hide();
    }

    function showSpinner() {
        $('.fa-spin').show();
    }

    function hideSpinner() {
        $('.fa-spin').hide();
    }

    function fetchTasks() {
        showSpinner();
        tasksQuery.find()
            .then(onData, displayError)
            .always(hideSpinner);
    }

    function onData(results) {
        tasks = results;
        renderTasks();
    }

    function renderTasks() {
        tasksList.empty();
        tasks.forEach(function(task) {
            var li = $(document.createElement('li'))
                .text(task.get('title'))
                .addClass(task.get('done') ? 'completed-task' : '')
                .appendTo(tasksList)
                .click(function() {
                    task.set('done', !task.get('done'));
                    task.save().then(renderTasks, displayError);
                });
            $(document.createElement('span'))
                .raty({readOnly: true,
                    score: (task.get('rating') || 1),
                    hints: ['crap', 'awful', 'ok', 'nice', 'awesome']})
                .appendTo(li);
        });
    }

    function showMessage(message) {
        message = message || 'Hello';
        alert(message);
    }

    //when the user submits the new task form
    $("#new-task-form").submit(function(evt) {
        evt.preventDefault();

        var titleInput = $(this).find('[name="title"]');

        //get current value
        var title = titleInput.val();

        //create a new Task and set the title
        var task = new Task();
        task.set('title', title);
        task.set('rating', ratingElem.raty('score'));
        task.save().then(fetchTasks, displayError).then(function() {
            titleInput.val('');
            ratingElem.raty('set', {});
        });

        return false;
    });

    //go and fetch tasks from Parse
    fetchTasks();
    ratingElem.raty();

    window.setInterval(fetchTasks, 3000);
});