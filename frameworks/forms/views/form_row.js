// ==========================================================================
// Project:   Forms.FormRowView
// Copyright: ©2009 Alex Iskander and TPSi.
// ==========================================================================
/*globals Forms */

/** @class
	Represents a single row in a form. Rows have label and any number of other child views.

	
	@extends SC.FormView
	@author Alex Iskander
*/
require("mixins/auto_hide");
require("mixins/edit_mode");
SC.FormRowView = SC.View.extend(SC.FlowedLayout, SC.FormsAutoHide, SC.FormsEditMode,
/** @scope Forms.FormRowView.prototype */ {
  flowSize: { widthPercentage: 1 },
  defaultFlowSpacing: { right: 15, left: 0, top: 0, bottom: 0 },
  
  classNames: ["sc-form-row-view"],
  
  /**
    Walks like a duck.
  */
	isFormRow: YES,
	
	/**
	  The label for the row (string label)
	*/
	label: "",
	
	/**
	  The current size of the labels.
	*/
	rowLabelSize: 0,
	
	/**
	  The current measured size of the label.
	*/
	rowLabelMeasuredSize: 0,
	
	/**
	  A value set so that FormView knows to tell us about the row label size change.
	*/
	hasRowLabel: YES,
	
	/**
	  The label view.
	*/
	labelView: null,
	
	/**
	  Direction of the flow.
	*/
	layoutDirection: SC.LAYOUT_HORIZONTAL,
	
  /**
  Updates keys, content, etc. on fields. Also, handles our "special" field (only-one case)
  */
  createChildViews: function()
  {
    // keep array of keys so we can pass on key to child.
    var cv = SC.clone(this.get("childViews"));
    
    // add label
    if (this.labelView.isClass) {
      this.labelView = this.createChildView(this.labelView, {
        value: this.get("label")
      });
      this.labelView.addObserver("measuredSize", this, "labelSizeDidChange");
      this.get("childViews").unshift(this.labelView);
    }
    
    var content = this.get("content");
    
    sc_super();
    
    // now, do the actual passing it
    var idx, len = cv.length, key, v;
    for (idx = 0; idx < len; idx++) {
      key = cv[idx];
      
      // if the view was originally declared as a string, then we have something to give it
      if (SC.typeOf(key) === SC.T_STRING) {
        // try to get the actual view
        v = this.get(key);
        
        // see if it does indeed exist, and if it doesn't have a value already
        if (v && !v.isClass) {
          if (!v.get("contentValueKey")) {
            //
            // NOTE: WE HAVE A SPECIAL CASE
            //       If this is the single field, pass through our contentValueKey
            if (key === "_singleField")  {
              v.set("contentValueKey", this.get("contentValueKey"));
            } else {
              v.set("contentValueKey", key);
            }
          }
          if (!v.get("content")) {
            v.set("content", content);
          }
        }
        
      }
    }
    

  },
  
  labelDidChange: function() {
    this.get("labelView").set("value", this.get("label"));
  }.observes("label"),
  
  labelSizeDidChange: function() {
    var size = this.get("labelView").get("measuredSize");
    this.set("rowLabelMeasuredSize", size.width);
    
    // alert parent view if it is a row delegate
    var pv = this.get("parentView");
    if (pv && pv.get("isRowDelegate")) pv.rowLabelMeasuredSizeDidChange(this, size);
  },
  
  rowLabelSizeDidChange: function() {
    this.get("labelView").adjust("width", this.get("rowLabelSize"));
  }.observes("rowLabelSize")
  
  
  
});

SC.FormRowView.mixin({
	row: function(label, fieldType)
	{
	  if (!fieldType) {
	    fieldType = label;
	    label = null;
	  }
		// now, create a hash (will be used by the parent form's exampleRow)
		return {
		  label: label,
		  childViews: "_singleField".w(),
		  _singleField: fieldType
		};
	},
	
	LabelView: SC.LabelView.extend(SC.AutoResize, {
	  shouldAutoResize: NO, // only change the measuredSize so we can update.
	  layout: { left:0, top:0, width: 0, height: 18 },
	  classNames: ["sc-form-label"]
	})
});

SC.FormRowView.prototype.labelView = SC.FormRowView.LabelView.design();
