angular.module('starter', ['ionic', 'starter.controllers', 'ngStorage', 'ngCordova'])

.run(function($rootScope, $ionicPlatform, $http, $localStorage, $cordovaGeolocation) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    var posOptions = { timeout: 10000, enableHighAccuracy: true };
    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
            $rootScope.lat = position.coords.latitude;
            $rootScope.long = position.coords.longitude;
            console.log($rootScope.long, $rootScope.lat);
            var coordinates = {
                'lat': String($rootScope.lat),
                'lng': String($rootScope.long)
            };
            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            $http.post('http://tapper.co.il/spontani_backup/php/getSapakim.php', coordinates).then(successCallback, errorCallback);

            function successCallback(response) {
                console.log(response);
            }

            function errorCallback(data) {
                console.log(data);
            }

        }, function(err) {
            console.log(err);
        });


    $rootScope.imageUrl = "http://tapper.co.il/spontani_backup/php";
    $rootScope.backend = $rootScope.imageUrl;

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

    $rootScope.favorites = [];

    $rootScope.loadFavorites = function() {
        var send_data = {
            'user': $localStorage.clientid
        };

        $http.post($rootScope.backend + '/getFavorites.php', send_data).then(
            function(data) { // on success
                for (var i = 0; i < data.data.length; i++) {
                    var supplierId = data.data[i].supplier_id;
                    $rootScope.favorites.push(supplierId);
                }
                console.log('favoriteSuppliers', $rootScope.favorites);
            },
            function() { // on error
                $ionicPopup.alert({
                    title: 'אין התחברות לבסיס נתונים',
                    buttons: [{
                        text: 'אשר',
                        type: 'button-positive'
                    }]
                });

            });
    };

    $rootScope.isLoggedIn = function() {
        return $localStorage.clientid != null && $localStorage.clientid != undefined;
    };

    $rootScope.addToFavorites = function(supplierId) {
        console.log("going to add supplier to favorites: " + supplierId);

        var userId = $localStorage.clientid;

        var data = {
            "supplier_id": supplierId,
            "user_id": userId
        };

        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

        $http.post($rootScope.backend + '/add_favorite.php', data).then(
            function(data) {
                $rootScope.favorites.push(supplierId);
                console.log("added supplier to favorites: " + supplierId);
            },

            function() {
                $ionicPopup.alert({
                    title: 'אין התחברות לבסיס נתונים, המסעדה לא נוספה למעודפים',
                    buttons: [{
                        text: 'אשר',
                        type: 'button-positive'
                    }]
                });
            });
    };

    $rootScope.deleteFromFavorites = function(supplierId) {
        var userId = $localStorage.clientid;

        var data = {
            "supplier": supplierId,
            "user": userId
        };

        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

        $http.post($rootScope.backend + '/delete_favorites.php', data).then(
            function(data) {
                var index = $rootScope.favorites.indexOf(supplierId);
                $rootScope.favorites.splice(index, 1);
                console.log("removed supplier from favorites: " + supplierId);
            },

            function() {
                $ionicPopup.alert({
                    title: 'אין התחברות לבסיס נתונים, המסעדה לא נוספה למעודפים',
                    buttons: [{
                        text: 'אשר',
                        type: 'button-positive'
                    }]
                });
            });
    };

    $rootScope.isFavoriteSupplier = function(supplierId) {
        return $rootScope.favorites.indexOf(supplierId) >= 0;
    };

    if ($rootScope.isLoggedIn()) {
        $rootScope.loadFavorites();
    } else {
        console.log("User is not logged in, not going to load favorites from the server");
    }

})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

    .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('app.login', {
            url: '/login',
            views: {
                'menuContent': {
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('app.conditions', {
            url: '/conditions',
            views: {
                'menuContent': {
                    templateUrl: 'templates/conditions.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('app.orders', {
            url: '/orders',
            views: {
                'menuContent': {
                    templateUrl: 'templates/orders.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('app.favourites', {
            url: '/favourites',
            views: {
                'menuContent': {
                    templateUrl: 'templates/favourites.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('app.full_conditions', {
            url: '/full_conditions',
            views: {
                'menuContent': {
                    templateUrl: 'templates/full_conditions.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('app.supplier_settings', {
            url: '/supplier_settings',
            views: {
                'menuContent': {
                    templateUrl: 'templates/supplier_settings.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('app.new_deal', {
            url: '/new_deal',
            views: {
                'menuContent': {
                    templateUrl: 'templates/new_deal.html',
                    controller: 'LoginCtrl'
                }
            }
        })

    $urlRouterProvider.otherwise('/app/home');
});