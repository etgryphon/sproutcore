// ========================================================================
// SproutCore -- JavaScript Application Framework
// Copyright ©2006-2008, Sprout Systems, Inc. and contributors.
// ========================================================================


/** Default namespace for designer-specific classes */
SC.Designer = SC.Object.extend({
  
});

SC.mixin(SC.Designer,{
  pages: [],
  
  controllers: [],
  
  registerPage: function(page){
    SC.Designer.pages.pushObject(page);
  },
  
  registerController: function(controller){
    SC.Designer.controllers.pushObject(controller);
  }
  
});
