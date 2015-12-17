angular.module("uiRouterExample", [
    'ui.router'
])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html'
            })
            .state('list', {
                url: '/list',
                templateUrl: 'views/list.html',
                controller: 'ListCtrl'
            })
            .state('list.item', {
                url: '/:item',
                templateUrl: 'views/list.item.html',
                controller: function($scope, $stateParams) {
                    $scope.item = $stateParams.item;
                }
            })
        ;


    })

.controller('ListCtrl', function ($scope) {
        $scope.shoppingList = [
            {name: 'Desert'},
            {name: 'Hydrangeas'},
            {name: 'Jellyfish'},
            {name: 'Koala'},
            {name: 'Lighthouse'},
            {name: 'Chrysanthemum'},
            {name: 'Penguins'},
            {name: 'Tulips'}
        ];

        $scope.selectItem = function (selectedItem) {
            // _($scope.shoppingList).each(function (item) {
            //     item.selected = false;
            //     if (selectedItem === item) {
            //         selectedItem.selected = true;
            //     }
            // });

            $.each( $scope.shoppingList, function (idx) {
               
                $scope.shoppingList[idx].selected = false;
                if (selectedItem === $scope.shoppingList[idx]) {
                    selectedItem.selected = true;
                }
            });
        };
    })

;