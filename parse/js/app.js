/*
    script for the index.html file
*/

Parse.initialize("hAdeEEc3LxxubodWolcdUYqY2eYgqOT5jfYbFDEt", "4oaHNOtTYKlNlNkhtG0dWlufXlb1pEehg6JiQPAS");

$(function() {
    'use strict';

    var Task = Parse.Object.extend('Task');
    var tasksQuery = new Parse.Query(Task);
    tasksQuery.ascending('createdAt');

    //reference to the task list element
    var tasksList = $("#tasks-list");
    //reference to the error message alert
    var errorMessage = $('#error-message');

    //current set of tasks
    var tasks = [];

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
           $(document.createElement('li'))
               .text(task.get('title'))
               .appendTo(tasksList);
        });
    }

    //when the user submits the new task form
    $("#new-task-form").submit(function(evt) {
       evt.preventDefault();

        var titleInput = $(this).find('[name="title"]');
        var title = titleInput.val();
        var task = new Task();
        task.set('title', title);
        task.save().then(fetchTasks, displayError).then(function() {
            titleInput.val('');
        });

        return false;

        window.setInterval(fetchTasks, 3000);
    });

    //go and fetch tasks from Parse
    fetchTasks();
});