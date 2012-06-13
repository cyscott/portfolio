define(
  ['models/project',
   'collections/project',
   'backbone',
   'hbsruntime',
   'hbstemplates'
   ],

 function(Models, Collections) {

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
       var left = this.$el.data('left');
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

      console.log('Init main app');

      Collections.ProjectCollection.bind('reset', this.addAll, this);
      Collections.ProjectCollection.bind('selected', this.tileSelected, this);

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

      Collections.ProjectCollection.each(function(e) {
        var view = new ProjectTileView({ model:e });
        var tile = view.render().el;
        $(_this.el).append(tile);

        // calculate absolute positions
        var col = index % 3;
        var row = Math.floor(index / 3);
        var left = col * leftOffset;
        var top = row * topOffset;

        setTimeout(function() {
          $(tile).addClass('visible').css('left', left).css('top', top).data('left', left).data('top', top);
        }, 10);
        index++;
      });
    },

    tileSelected: function(e) {
      var active = Collections.ProjectCollection.any(function(project) {
        return project.get('selected');
      });
      console.log('any active? ' + active);
      Collections.ProjectCollection.each(function(project) {
        var selected = e.get('name') === project.get('name') && e.get('selected');
        project.set({'selected':selected, 'active': active});
      });
    },

    toggle: function(e) {
      $(this.el).toggleClass('selected');
    }

  });


  return {
    App: App
  };

});
