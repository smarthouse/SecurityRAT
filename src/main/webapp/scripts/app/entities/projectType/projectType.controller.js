'use strict';

angular.module('sdlctoolApp')
    .controller('ProjectTypeController', function ($scope, ProjectType, ProjectTypeSearch, $filter, sharedProperties) {
        $scope.projectTypes = [];
        $scope.loadAll = function() {
            ProjectType.query(function(result) {
               $scope.projectTypes = result;
               angular.forEach($scope.projectTypes, function(type) {
            	   angular.extend(type, {selected: false});
               });
            });
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            ProjectType.get({id: id}, function(result) {
                $scope.projectType = result;
                $('#deleteProjectTypeConfirmation').appendTo("body").modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            ProjectType.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteProjectTypeConfirmation').modal('hide');
                    $scope.clear();
                });
        };
        $scope.selectAllTypes = function() {
    		  angular.forEach($scope.projectTypes, function(type) {
    			  type.selected = true;
    		  });
  	  	}
        $scope.deselectAllTypes = function() {
  		  angular.forEach($scope.projectTypes, function(type) {
  			  type.selected = false;
  		  });
	  	}
        
        $scope.bulkChange = function() {
        	sharedProperties.setProperty($filter('orderBy')($filter('filter')($scope.projectTypes, {selected: true}), ['showOrder']));
        }
        $scope.search = function () {
            ProjectTypeSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.projectTypes = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.projectType = {name: null, description: null, showOrder: null, active: null, id: null};
        };
    });
