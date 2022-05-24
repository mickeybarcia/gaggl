const express = require('express');

const userRoute = require('./user.route');
const locationRoute = require('./location.route');
const searchRoute = require('./search.route');
const likeRoute = require('./like.route');
const matchRoute = require('./match.route');
const authRoute = require('./auth.route');

const router = express.Router();

const defaultRoutes = [
    {
      path: '/users',
      route: userRoute,
    },
    {
      path: '/locations',
      route: locationRoute,
    },
    {
      path: '/search',
      route: searchRoute
    },
    {
      path: '/likes',
      route: likeRoute
    },
    {
      path: '/matches',
      route: matchRoute
    },
    {
      path: '/auth',
      route: authRoute
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
