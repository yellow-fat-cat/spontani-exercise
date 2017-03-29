angular.module('starter.controllers', ['ngStorage'])
    .controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $state, $rootScope) {
        $scope.logout = function() {
            $localStorage.supplier_id = null;            
            $rootScope.supplierLoggedIn = null;
            $state.go('app.login');
        }

        $scope.openSupplierSettings = function() {

            if ($localStorage.supplier_id) {

                $state.go('app.supplier_settings');

            } else {

                $state.go('app.login');

            }
        };
    })

.controller('HomeCtrl', function($scope, $http, $ionicModal, $localStorage, $ionicPopup, $state, $rootScope) {
    $scope.jopa = [];

    $http.get('http://tapper.co.il/spontani_backup/php/getSapakimWithoutDistance.php').then(successCallback, errorCallback);

    function successCallback(response) {
        console.log(response);

        var result = [];

        for (var i = 0; i < response.data.length; i++) {
            var item = response.data[i];
            if (item.deals.length > 0) {
                result.push(item);
            }
        }

        $scope.jopa = result;
    }

    function errorCallback(data) {
        console.log(data);
    }

    var newMass = $scope.jopa.filter(function(number) {
        return number > 0;
    });

    $scope.openInfo = function(item) {
        $scope.item = item;
        $scope.popup = $ionicPopup.show({
            templateUrl: 'views/task.html',
            scope: $scope,
            cssClass: 'openNewInfo'
        });

        $scope.closeInfo = function() {
            $scope.popup.close();
        }
    }

    $scope.addToFavorites = function(supplierId) {
        if ($rootScope.isLoggedIn()) {
            $rootScope.addToFavorites(supplierId);
        } else {
            $scope.popup = $ionicPopup.show({
                templateUrl: 'views/star.html',
                scope: $scope,
                cssClass: 'formLogin'
            });
        }
    }

    $scope.replaceLineBreaks = function(str) {
        return str.replace(/---/g, "<br/>");
    }

    $scope.$on('$ionicView.enter', function() {

        $rootScope.stateCurrentName = $state.current.name;

    });

    $scope.$on('makeRegistration', function() {

        $scope.checkClientLogin();

    });

    $scope.login = {};


    $scope.addNewUser = function() {
        if (!$scope.login.username || !$scope.login.phonenumber || $scope.login.username == "" || $scope.login.phonenumber == "") {
            $ionicPopup.alert({
                title: 'שם משתמש או סיסמה שגוים נא לתקן',
                buttons: [{
                    text: 'אשר',
                    type: 'button-positive'
                }]
            });
        } else {
            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            $http.post($rootScope.imageUrl + '/user_registration.php', $scope.login).then(
                function(data) { // on success
                    $localStorage.clientid = data.data.response.userid;
                    $scope.popup.close();
                    console.log($scope.login.username);
                    console.log($scope.login.phonenumber);
                },

                function() { // on error
                    $ionicPopup.alert({
                        title: 'אין התחברות לבסיס נתונים 33',
                        buttons: [{
                            text: 'אשר',
                            type: 'button-positive'
                        }]
                    });
                });
        }
    };

    $scope.userLogout = function() {
        $localStorage.clientid = null;
    };

    $scope.closeLoginPopup = function() {
        $scope.popup.close();
    };

    $scope.toggleEditMode = function() {
        $scope.editMode = !$scope.editMode;
    };
})

.controller('LoginCtrl', function($scope, $http, $ionicPopup, $localStorage, $state, $ionicModal, $rootScope) {
    $scope.$on('$ionicView.enter', function() {
        $rootScope.stateCurrentName = $state.current.name;
        $rootScope.enterScreen = false;
    });

    $scope.showSettings = function(item) {
        console.log("hi");
        $scope.item = item;
        $scope.popup = $ionicPopup.show({
            templateUrl: 'templates/new_deal.html',
            scope: $scope,
            cssClass: 'new_deal'
        });
        $scope.closeSettings = function() {
            $scope.popup.close();
        }
    };

    $scope.isLoggedIn = function() {
        if ($localStorage.supplier_id) {
            $state.go('app.supplier_settings');
        } else {
            $state.go('app.login');
        }
    };
    
    /*
    $localStorage.users = [{
            "supplier_id": 1,
            "login": "fatCat",
            "password": "123",
            "phone_number": "052",
            "favorites": [262]

        }, {
            "supplier_id": 2,
            "login": "Zena",
            "password": "1234",
            "phone_number": "053",
            "favorites": []
        }
    ];
    */

    $scope.logout = function() {
        console.log("Hi");
        $localStorage.supplier_id = null;            
        $rootScope.supplierLoggedIn = null;
        console.log("hohoho");
        $state.go('app.login');
    }

    $scope.login = {
        "username": "",
        "password": ""
    };

    $scope.login = function() {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        if ($scope.login.username == "") {
            $ionicPopup.alert({
                title: 'יש להזין שם משתמש',
                buttons: [{
                    text: '3אשר',
                    type: 'button-positive'
                }]
            });

        } else if ($scope.login.password == "") {
            $ionicPopup.alert({
                title: 'יש להזין סיסמא',
                buttons: [{
                    text: '2אשר',
                    type: 'button-positive'
                }]
            });
        } else {
            var login_data = {
                "username": $scope.login.username,
                "password": $scope.login.password
            };

            $http.post($rootScope.imageUrl + '/supplier_login.php', login_data).then(
                function(data) { // on success

                    $localStorage.supplier_id = data.data[0].index;
                    $rootScope.supplierLoggedIn = $localStorage.supplier_id;

                    $scope.login = {
                        "username": "",
                        "password": ""
                    };

                    $state.go('app.supplier_settings');

                },
                function() { // on error
                    $ionicPopup.alert({
                        title: 'שם משתמש או סיסמה שגוים נא לתקן',
                        buttons: [{
                            text: '1אשר',
                            type: 'button-positive'
                        }]
                    });

                });
        }
    }
});