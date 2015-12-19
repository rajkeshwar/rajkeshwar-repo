

angular.module('foodReport', [])
	.constant('base_usda_url', 'http://api.nal.usda.gov/ndb/reports/')
	.value('api_key', 'DEMO_KEY')
	.controller('FoodController', function( $scope, $http, base_usda_url, api_key ){
		
		var itemList = [];
		for (var i = 10001; i <= 10010; i++) {
			itemList.push(i);
		}

		$scope.itemList = itemList;

		$scope.$watch('itemNumber', function(newValue, oldValue){
			if (oldValue !== newValue) {
				$http.get(base_usda_url + '?ndbno='+newValue+'&type=f&format=json&api_key=DEMO_KEY')
					.then(populateReport);
			} 			
		});

		$scope.getFoodReport = function(){
			$http.get(base_usda_url + '?ndbno=01009&type=f&format=json&api_key=DEMO_KEY')
				.then(populateReport);
		}

		function populateReport( resp ){
			$scope.data = resp.data;
		}

		$scope.$watch('selectedItem', function(newValue, oldValue){
			if (oldValue !== newValue) {
				$http.get(base_usda_url + '?ndbno='+newValue+'&type=f&format=json&api_key=DEMO_KEY')
					.then(populateBasicReport);
			} 
			
		});

		function populateBasicReport( resp ){
			$scope.nutrients = resp.data.report.food.nutrients;
		}		
	})
	.filter('notEmptyOrArray', function(){
		return function( food ){
			//console.log(food);
			var foodArray = [];
			angular.forEach(food, function(key, value){
				console.log(key);
				var item = key && !angular.isArray(key);
				foodArray.push(item);
			});
			return foodArray;
		}
	})
	.filter('limitObjectFromTo', function() {
      return function(obj, limitFrom, limitTo) {
         var newObj = {},
          	 i = 0, item;
          for (var p in obj) {
          	item = obj[p];
            if (item && !angular.isArray(item)){
            	newObj[p] = item;
            }
          }
        return newObj;
      };
  	});