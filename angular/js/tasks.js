/* 
    script for the tasks.html file 
*/

angular.module('Tasks', [])
    .constant('taskKey','tasks')
    .controller('TasksController', function($scope, tasksKey) {
        'use strict';

        //initialize tasks property on the scope to an empty array
        $scope.tasks = angular.fromJson(localStorage.getItem('tasks')) || [];
        //initialize newTask to an empty object
        $scope.newTask = {};

        function saveTasks() {
            localStorage.setItem(tasksKey, angular.toJson($scope.tasks));
        }

        // add function to add new Task to the array
        $scope.addTask = function() {
            //Push current value of newTask into asks array
            $scope.tasks.push($scope.newTask);

            //save the tasks
            saveTasks();

            // reset newTask to an empty objects
            $scope.newTask = {};
        };

        // function to ggle task done state
        $scope.toggleDone = function(task) {
            task.done = !task.done;
        }
    });