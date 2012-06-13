define(['backbone'], function(Backbone) {

  var ProjectModel = Parse.Object.extend({

    className: 'Project'

  });

  return {
    ProjectModel: ProjectModel
  };
});
