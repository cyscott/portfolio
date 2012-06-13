define(['backbone', 'models/project'], function(Backbone, Models) {
  console.log('Project collection');

  var ProjectCollection = Parse.Collection.extend({
    model: Models.ProjectModel
  });

  return {
    ProjectCollection: new ProjectCollection()
  };

});
