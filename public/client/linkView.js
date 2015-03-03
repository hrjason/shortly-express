Shortly.LinkView = Backbone.View.extend({
  //create a div
  className: 'link',
  //pull sreference back
  template: Templates['link'],

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});
