const RouteApi = require("./route_api");
const RouteApiException = require("./hundler/route_api_exception");
const Environment = require("../../src/environment");

class RouteGroupApi {

  groupUrl;
  appId = '';
  routes = [];
  groups = [];
  _middleware;

  constructor(groupUrl, appId) {
    this.groupUrl = groupUrl;
    this.appId = appId;
  }

  createRoute() {
    var route = new RouteApi();
    this.routes.push(route);
    return route;
  }

  createGroup(groupUrl) {
    var group = new RouteGroupApi(groupUrl, this.appId);
    this.groups.push(group);
    return group;
  }

  middleware(middlewareName) {
    if(!Environment.middlewares[this.appId] || !Environment.middlewares[this.appId][middlewareName])
      throw new RouteApiException("undefined middleware with this name ("+middlewareName+")");
    this._middleware = Environment.middlewares[this.appId][middlewareName];
    return this;
  }

  store() {
    if(!this.routes)
      throw new RouteApiException("The group routes required");
    this.routes.forEach(route => {
      route.routeUrl = this.groupUrl+route.routeUrl;
      if (this._middleware)
        route._middleware = this._middleware;
      route.store();
    });
    this.groups.forEach(group => {
      group.groupUrl = this.groupUrl+group.groupUrl;
      if (this._middleware)
        group._middleware = this._middleware;
      group.store();
    });
  }
  
}

module.exports = RouteGroupApi;