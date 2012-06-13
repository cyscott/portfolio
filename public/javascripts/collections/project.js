define(['backbone', 'models/project'], function(Backbone, Models) {
  console.log('Project collection');

  var ProjectCollection = Parse.Collection.extend({
    model: Models.ProjectModel,

    // will return true/false depending on if there is a selected item
    hasSelected: function() {

      return this.any(function(project) {
        return project.get('selected');
      });
    },

    getSelected: function() {

      return this.find(function(project) {
        return project.get('selected');
      });
    }

  });

  return {
    ProjectCollection: new ProjectCollection()
  };

});
