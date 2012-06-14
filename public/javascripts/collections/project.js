define(['backbone', 'models/project'], function(Backbone, Models) {

  var ProjectCollection = Parse.Collection.extend({
    model: Models.ProjectModel,

    comparator: function(project) {
      return project.get("order");
    },

    // will return true/false depending on if there is a selected item
    hasSelected: function() {

      return this.any(function(project) {
        return project.get('selected');
      });
    },

    // get the selected project from the collection
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
