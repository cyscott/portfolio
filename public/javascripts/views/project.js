define(
  ['models/project',
   'collections/project',
   'showdown',
   'backbone',
   'hbsruntime',
   'hbstemplates'
   ],
 function(Models, Collections) {


   var ProjectSummaryView = Backbone.View.extend({

    tagName: 'div',

    template: Handlebars.templates['project/summary'],

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

   });

   var ProjectDetailsView = Backbone.View.extend({

    tagName: 'div',

    template: Handlebars.templates['project/details'],

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

   });

   var ProjectTileView = Backbone.View.extend({

    tagName: 'div',

    className: 'tile',

    template: Handlebars.templates['project/tile'],

    events: {
      'click' : 'clicked'
    },

    initialize: function() {
      this.model.bind('change', this.modelChanged, this);
      this.model.view = this;
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    clicked: function(e) {
      var selected = this.model.get('selected');
      this.model.set({'selected': !selected});
      this.model.trigger('selected', this.model);
    },

    modelChanged: function(e) {

     this.$el.toggleClass('topZ', this.model.get('selected'));

     var css = {};
     if(this.model.get('active')) {

       // A project is activated, so move to 0 position
       var random = Math.floor(Math.random()*11) - 5;
       css = {
          'left':'0',
          'top':'0',
          'transform':'rotate('+random+'deg)',
          '-webkit-transform':'rotate('+random+'deg)',
          '-moz-transform':'rotate('+random+'deg)'
       };
       this.$el.css(css);

     } else {

       // Project inactivated, move back to original position
       css = {
         'left':this.$el.data('left'),
         'top':this.$el.data('top'),
         'transform':'rotate(0deg)',
         '-webkit-transform':'rotate(0deg)',
         '-moz-transform':'rotate(0deg)'
       };
       this.$el.css(css);
     }
    }
  });

   var App = Backbone.View.extend({

    el: '#projects',

    initialize: function() {

      Collections.ProjectCollection.bind('reset', this.addAll, this);
      Collections.ProjectCollection.bind('selected', this.tileSelected, this);

      // Grab all elements from Parse to kick this off
      var query = Parse.Query(Models.ProjectModel);
      Collections.query = query;
      Collections.ProjectCollection.fetch();
    },

    events: {
      'click .tile' : 'toggle'
    },

    addAll: function() {
      var _this = this
        , index = 0
        , topOffset = 220
        , leftOffset = 300;

      var converter = new Showdown.converter();

      _this.$('#tiles').empty();

      Collections.ProjectCollection.each(function(e) {

        // Convert Markdown to Html
        var text = e.get('details');
        var html = converter.makeHtml(text);
        e.set({ details: html });

        // Build the tiles
        var view = new ProjectTileView({ model:e });
        var tile = view.render().el;
        _this.$('#tiles').append(tile);

        // Calculate absolute positions
        // Doing this so the CSS transition works properly
        var col = index % 3;
        var row = Math.floor(index / 3);
        var left = col * leftOffset;
        var top = row * topOffset;

        // slow it down a bit with a timeout for animation
        setTimeout(function() {
          $(tile).addClass('visible').css({ 'left': left, 'top': top })
            .data('left', left).data('top', top);
        }, 10);

        index++;
      });
    },

    tileSelected: function(e) {

      var selectedProject
        , active
        , summaryView
        , detailsView;

      active = Collections.ProjectCollection.hasSelected();//typeof selectedProject !== 'undefined' && selectedProject !== null;
      Collections.ProjectCollection.each(function(project) {
        var selected = e.get('name') === project.get('name') && e.get('selected');
        project.set({'selected':selected, 'active': active});
      });


      // Render details
      if(active) {

        selectedProject = Collections.ProjectCollection.getSelected();

        // Populate summary
        summaryView = new ProjectSummaryView({ model:selectedProject });
        this.$('#summary').html(summaryView.render().el);

        // Populate details
        detailsView = new ProjectDetailsView({ model:selectedProject });
        this.$('#details').html(detailsView.render().el);
      }


    },

    toggle: function(e) {
      $(this.el).toggleClass('selected', Collections.ProjectCollection.hasSelected());
    }

  });

  Handlebars.registerHelper('toClassName', function(value) {
    return value.toLowerCase().replace(/ /g, '-');
  });


  return {
    App: App
  };

});
