require.config({
  baseUrl:'./javascripts/',
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'hbstemplates': {
      deps: ['hbsruntime'],
      exports: 'Templates'
    }
  },
  paths: {
    jquery: 'libs/jquery-1.7.2.min',
    parse: 'libs/parse-1.0.3.min',
    underscore: 'libs/underscore-min',
    backbone: 'libs/backbone-min',
    hbsruntime: 'libs/handlebars.runtime',
    showdown: 'libs/showdown',
    hbstemplates: 'templates/templates'
  }
});

require(
   [
      'views/project'
    , 'jquery'
    , 'backbone'
    , 'parse'
    , 'showdown'
    , 'hbstemplates'
    , 'collections/project'
   ], function(Views, $) {


  Parse.initialize("tY9LjpSFpTWVbdIyZrqT0r3isxjagjsa5wUxLrIf", "rOKfFIrtXhojHgeSlupoQXllfDupGExIsSSYfbfM");

  var app = new Views.App();


});
