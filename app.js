(function () {

	'use-strict';

	angular
		.module('NarrowItDownApp', [])
		.controller('NarrowItDownController', NarrowItDownController)
		.service('MenuSearchService', MenuSearchService)
		.directive('foundItems', FoundItemsDirective);


	function FoundItemsDirective() {
		var ddo = {
			templateUrl: 'loader/template.html',
			restrict: 'E',
			scope: {
				found: '<',
				removeItem: '&'
			},
			controller: 'NarrowItDownController as nidCtrl',
			bindToController: true
		};
		return ddo;
	};


	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController(MenuSearchService) {

		var nidCtrl = this;

		nidCtrl.lookForItems = function () {
			if (nidCtrl.searchTerm == undefined || nidCtrl.searchTerm == "") {
				nidCtrl.message = "Specify a search criteria.";
				return;
			};
			nidCtrl.message = "";	
			nidCtrl.found = "";			
			var promise = MenuSearchService.getMatchedMenuItems(nidCtrl.searchTerm);
			promise.then( function (response ) {
				nidCtrl.found = response;
				if (nidCtrl.found == "") { nidCtrl.message = "Nothing found!" };
			})
			.catch(function (error) {
				nidCtrl.message = error.statusText + ' (' + error.status + ')';
			});			
		}; // nidCtrl.lookForItems

		nidCtrl.removeItem = function (index) {
			nidCtrl.found.splice(index.index,1);
		};

	}; // function NarrowItDownController


	MenuSearchService.$inject = ['$http'];
	function MenuSearchService ($http) {

		var service = this;

		service.getMatchedMenuItems = function (searchTerm){
			var response = $http({
				method: "GET",
				url: "https://davids-restaurant.herokuapp.com/menu_items.json"
				})
				.then( function(result){
					var foundItems = [];
					for (i = 0; i < result.data.menu_items.length; i++) {
						if (result.data.menu_items[i].description.indexOf(searchTerm) != -1) {
							foundItems.push(result.data.menu_items[i]);
						};
					};
					return foundItems;
				});
			return response;
		}; // service.getMatchedMenuItems

	}; // function MenuSearchService

})();
