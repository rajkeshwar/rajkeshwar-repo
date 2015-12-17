'use strict';

angular.module('mytodoApp')
  .controller('MainCtrl', function ( $scope, localStorageService ) {
    //$scope.todos = ['item1', 'item2', 'item3'];

    var todoInStore = localStorageService.get('todos');
    $scope.todos = todoInStore && todoInStore.split('\n') || [];

    $scope.$watch(function(){
    	localStorageService.add('todos', $scope.todos.join('\n'));
    });

    $scope.addTodo = function(){
    	$scope.todos.push($scope.todo);
    	$scope.todo = "";
    }

    $scope.removeTodo = function( index ){
    	$scope.todos.splice(index, 1);
    }
  });
