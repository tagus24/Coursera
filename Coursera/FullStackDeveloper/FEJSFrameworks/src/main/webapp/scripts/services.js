'use strict';

angular.module('confusionApp')
	
		.constant("baseURL","http://localhost:3000/")

        .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

            return $resource(baseURL + "dishes/:id", null, {
                'update': {
                    method: 'PUT'
                }
            });

			}])

			.factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
						return $resource(baseURL + "promotions/:id");

			}])


        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
           var corpfac = {};
    
           corpfac.getLeaders = function(){
               return $resource(baseURL+"leadership/:id",null,  {'update':{method:'PUT' }});
               
           };
           
           return corpfac;

        }])
        
        
       .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
           var feedbackfac = {};
    
           feedbackfac.getFeedback = function(){
               return $resource(baseURL+"feedback/:id",null,  {'update':{method:'PUT' }});
           };
           
           return feedbackfac;

        }])

;
