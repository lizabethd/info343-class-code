/*
    script file for the index.html page
*/

angular.module('ContactsApp', ['ui.router', 'angular-uuid', 'LocalStorageModule'])
    // declare a constant for our local storage key
    .constant('storageKey', 'contacts-list')
    // declare a factory function that will return our array of contacts
    // will be called only once, but return value of this function can be
    // injected into multiple controllers
    .factory('contacts', function(localStorageService, storageKey) {
        return localStorageService.get(storageKey) || [];
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('list', {
                url: '/contacts',
                templateUrl: 'views/contacts-list.html',
                controller: 'ContactsController'
            })
            .state('detail', {
                url: '/contacts/:id',                       // the :id means it can be any id value
                templateUrl: 'views/contact-detail.html',   // and we want access to tha value in the
                controller: 'ContactDetailController'       // $stateParams object injected into the controller
            })
            .state('edit', {
                url: '/contacts/:id/edit',
                templateUrl: 'views/edit-contact.html',
                controller: 'EditContactController'
            });
        $urlRouterProvider.otherwise('/contacts');
    })
    // register a directive for custom validation of dates in the past
    .directive('inThePast', function() {
        return {
          require: 'ngModel',
            link: function(scope, elem, attrs, controller) {
                controller.$validators.inThePast = function(modelValue) {
                    var today = new Date();
                    return (new Date(modelValue) <= today);
                }
            }
        };
    })
    .controller('ContactsController', function($scope, contacts) {
        $scope.contacts = contacts;
    })
    .controller('ContactDetailController', function($scope, $stateParams, $state, contacts) {
        $scope.contact = contacts.find(function(contact) {
           return contact.id === $stateParams.id;
        });
    })
    .controller('EditContactController', function($scope, $stateParams, $state, uuid, localStorageService,
                                                  storageKey, contacts) {
        var existingContact = contacts.find(function(contact) {
           return contact.id === $stateParams.id;
        });

        $scope.contact = angular.copy(existingContact);

        $scope.save = function() {
            if ($scope.contact.id) {
                angular.copy($scope.contact, existingContact);
            } else {
                $scope.contact.id = uuid.v4();
                contacts.push($scope.contact);
            }

            localStorageService.set(storageKey, contacts);

            // go back to list view
            $state.go('list');
        }
    });