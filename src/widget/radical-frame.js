/**
 * radical-frame.js
 * Created by Nathan Skipper, MTI
 * Created on 6/1/2017
 * Revision 0.1
 * @copyright (c) 2017, Nathan Skipper
 * License: Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 * 
 * Description: This file contains classes related to the "frame" functionality within
 * Radical. A frame is a graphical object which will be represented within both the Designer
 * and the Application. The frame is a container which facilitates the layout of all widgets added
 * to it.
 */

/**
 * This function is a global function used within Radical to import needed scripts and stylesheets.
 * @param {string} url The path to the resource that should be included.
 * @param {string} type Designates the type of resource. If this parameter is not supplied, the function
 * will try to guess the file type based on the extension. If no guess can be made, it assumes that this is a script file.
 * The two options for this parameter are "script" and "css".
 */
function rdinclude(url, type){
  try{
    
    if(typeof type === "undefined"){
      if(url.toLowerCase().indexOf(".js")){
        type = "script";
      }
      else if(url.toLowerCase().indexOf(".css")){
        type = "css";
      }
      else{
        type = "script";
      }
    }
    var heads = document.getElementsByTagName("head");
    var head = null;
    if(heads.length > 0){
      head = heads[0];
    }
    else{
      head = document.createElement("head");
      document.appendChild(head);
    }        
    if(head){
      var found = false;
      var scripts = null;
      switch(type){
        case "script":
          scripts = document.getElementsByTagName("script");
          for(var x = 0; x < scripts.length; x ++){
            if(scripts[x].getAttribute("src") === url){
              found = true;
              break;
            }
          }
          if(!found){
            var script = document.createElement("script");
            script.src = url;
            head.appendChild(script);
          }
          
          break;
        case "css":
          scripts = document.getElementsByTagName("link");
          found = false;
          for(var x = 0; x < scripts.length; x ++){
            if(scripts[x].getAttribute("href") === url){
              found = true;
              break;
            }
          }
          if(!found){
            var script = document.createElement("link");
            script.href = url;
            script.rel = "stylesheet";
            script.type = "text/css";
            head.appendChild(script);
          }
          break;
      }
    }
    
  }
  catch(e){
    console.log(e);
  }
}

/**
 * Provides an enumeration of the possible Frame windowing modes.
 */
var RadicalFrameModes = {
  /**
   * The Frame will be instantiated within a separate window which is independent of the current document context.
   */
  Window: 0,
  /**
   * The frame will be instantiated within a separate window and will block when the "Show" function is called until the window is closed.
   */
  Dialog: 1,
  /**
   * The frame will be instantiated within the current window.
   */
  InternalWindow: 2
}

/**
 * instantiates a new RadicalFrame object with an Instance ID and Document
 * @param {string} id An instance ID for this frame. (optional)
 * @param {Document} doc A Document object for this frame. (optional)
 * @param {string} json A json string representing this RadicalFrame (optional)
 */
function RadicalFrame(id, doc, json){
  if(typeof doc === "undefined")
  {
    doc = document;
  }
  if(typeof id === "undefined"){
    id = "Frame1";
  }
  this.Document = doc;
  this.InstanceID = id;
  if(typeof json === "undefined"){
    json = "{}";
  }
  this.InitFrame(json);
}

RadicalFrame.prototype = {
  /**
   * An object representing the properties defined for this frame. There are standard properties which all
   * frames represent which are instantiated with a new frame.
   */
  Properties: {
    Width: "300px",
    Height: "300px",
    Position: "absolute",
    Border: "none",
    BorderWidth: "0px",
    Top: "0px",
    Left: "0px",
    Scrollable: true,
    BrowserMenu: false,
    BrowserAddress: false,
    Resizable: false,
    StatusBar: false,
    Title: "Frame1"
  },
  /**
   * The widget instances that have been drawn into this frame.
   */
  Widgets: [],
  /**
   * This array stores references to the instantiated widget instances built from the Widgets array.
   */
  Children: [],
  /**
   * The scripts which this frame is dependent on.
   */
  Scripts: [],
  /**
   * The style sheets this frame is dependent on.
   */
  StyleSheets: [],
  /**
   * The classes that should be assigned to the body of this frame.
   */
  Classes: [],
  /**
   * The name of the frame.
   */
  Name: "[Name]",
  /**
   * The DOM element representing this frame.
   */
  Primitive: null,
  /**
   * The DOM element from which events will originate.
   */
  EventPrimitive: null,
  /**
   * Event fired during the load process. This function can be overridden by the frame implementation
   * to handle the layout for this type of frame. This event should at least instantiate the Primitive and EventPrimitive properties.
   * @param {object} frame The RadicalFrame object that is being loaded.
   * @param {int} mode The display mode, represented by the "RadicalFrameModes" enumerator, and determines whether the frame is displayed in a separate window or a
   * subform of a document.
   * @param {Element} context The DOM element into which the frame should be created. If the mode is set to display this frame in a separate window, then the element
   * will be the document element of the current context. If this is an embedded window, the context will be the element under which the frame should be created.
   */
  OnFrameLoad: function(frame, mode, context){
    try{
      Primitive = this.Document.getElementsByTagName("body")[0];
      EventPrimitive = Primitive;
    }
    catch(e){
      console.log(e);
    }
  },
  /**
   * This is an event handler which allows an implementing frame designer to determine what should happen when a frame is shown.
   * @param {object} frame The frame instance that is being shown.
   * @param {Element} context the context in which the frame is being shown.
   */
  OnFrameShow: function(frame, context){

  },
  /**
   * An event handler that allows the frame designer to determine what should happen to the frame when it is hidden.
   * @param {object} frame The frame being hidden.
   * @param {Element} context The DOM context in which the frame is residing.
   */
  OnFrameHide: function(frame, context){

  },
  /**
   * An event handler which allows the frame design to make specific behavioral changes based on the change to a property.
   * @param {object} frame The frame instance on which the property was changed.
   * @param {Element} context The DOM element in which the frame resides.
   * @param {string} property The property name that has been changed.
   */
  OnFramePropertyChange: function(frame, context, property){

  },
  /**
   * An event handler for the instance of a frame which handles a mouse click event on the primitive implemented by the frame.
   * @param {object} frame The frame instance on which the mouse event occurred.
   * @param {Element} context The context in which the frame resides.
   * @param {MouseEvent} event The mouse event received from the onmouseclick event for the frame instance's primitive.
   */
  OnInstanceClick: function(frame, context, event){

  },
  /**
   * Handles a frame instance's onmousedown event.
   * @param {object} frame The frame instance on whic hthe mousedown event occurred.
   * @param {Element} context The context in which the frame instance resides.
   * @param {MouseEvent} event The event passed by the mousedown event.
   */
  OnInstanceMouseDown: function(frame, context, event){

  },
  /**
   * Handles a frame instance's onmouseup event.
   * @param {object} frame The frame instance on which the event occurred.
   * @param {Element} context The DOM element in which the frame instance resides.
   * @param {MouseEvent} event The event passed by the mouseup event.
   */
  OnInstanceMouseUp: function(frame, context, event){

  },
  /**
   * An event handler for the onmousemove event for a frame instance.
   * @param {object} frame The frame on which the event occurred.
   * @param {Element} context The DOM context in which the frame resides.
   * @param {MouseEvent} event The event passed by the mousemove event.
   */
  OnInstanceMouseMove: function(frame, context, event){

  },
  /**
   * An event handler for the frame instance's onmouseenter event.
   * @param {object} frame The frame instance on which the event occurred.
   * @param {Element} context The DOM context in which the frame instance resides.
   * @param {MouseEvent} event The event passed by the mouseenter event.
   */
  OnInstanceMouseEnter: function(frame, context, event){

  },
  /**
   * An event handler for the onmouseleave event for the frame instance.
   * @param {object} frame The frame instance on which the event occurred.
   * @param {Element} context The DOM context in which the frame instance resides.
   * @param {MouseEvent} event The event passed by the mouseleave event.
   */
  OnInstanceMouseLeave: function(frame, context, event){

  },
  /**
   * An event handler for the ondblclick event for the frame instance.
   * @param {object} frame The frame instance on which the event occurred.
   * @param {Element} context The DOM context in which the frame instance resides.
   * @param {MouseEvent} event The event passed by the dblclick event.
   */
  OnInstanceDoubleClick: function(frame, context, event){
    
  },
  /**
   * The event handler for a frame instance's onkeydown event.
   * @param {object} frame The frame instance on which the event occurred.
   * @param {Element} context The DOM context in which the frame instance resides.
   * @param {KeyEvent} event The event object passed by the onkeydown event.
   */
  OnInstanceKeyDown: function(frame, context, event){

  },
  /**
   * Event handler for the frame instance's onkeyup event.
   * @param {object} frame The frame instance on which the event occurred.
   * @param {Element} context The DOM context in which the frame instance resides.
   * @param {KeyEvent} event The event passed by the keyup event
   */
  OnInstanceKeyUp: function(frame, context, event){

  },
  /**
   * The event handler for the frame instance's onkeypress event.
   * @param {object} frame The frame instance on which the event occurred.
   * @param {Element} context The DOM context in which the frame instance resides.
   * @param {KeyEvent} event The event object passed by the onkeypress event.
   */
  OnInstanceKeyPress: function(frame, context, event){

  },
  /**
   * Causes the frame instance to be shown.
   */
  Show: function(){

  },
  /**
   * Causes the frame instance to be hidden.
   */
  Hide: function(){

  },
  /**
   * Loads a frame instance.
   */
  Load: function(context, mode){
    var retval = true;
        try{
            this.Context = context;
            
            var cevent = window[this.InstanceID + "_OnInstanceClick"];
            if(typeof cevent === "function"){
                this.OnInstanceClick = cevent;
            }
            var cevent = window[this.InstanceID + "_OnInstanceDoubleClick"];
            if(typeof cevent === "function"){
                this.OnInstanceDoubleClick = cevent;
            }
            
            cevent = window[this.InstanceID + "_OnInstanceMouseMove"];
            if(typeof cevent === "function"){
                this.OnInstanceMouseMove= cevent;
            }
            cevent = window[this.InstanceID + "_OnInstanceMouseEnter"];
            if(typeof cevent === "function"){
                this.OnInstanceMouseEnter = cevent;
            }
            cevent = window[this.InstanceID + "_OnInstanceMouseLeave"];
            if(typeof cevent === "function"){
                this.OnInstanceMouseLeave = cevent;
            }
            cevent = window[this.InstanceID + "_OnInstanceMouseDown"];
            if(typeof cevent === "function"){
                this.OnInstanceMouseDown = cevent;
            }
            cevent = window[this.InstanceID + "_OnInstanceMouseUp"];
            if(typeof cevent === "function"){
                this.OnInstanceMouseUp = cevent;
            }

            cevent = window[this.InstanceID + "_OnInstanceKeyUp"];
            if(typeof cevent === "function"){
                this.OnInstanceKeyUp = cevent;
            }
            cevent = window[this.InstanceID + "_OnInstanceKeyDown"];
            if(typeof cevent === "function"){
                this.OnInstanceKeyDown = cevent;
            }
            cevent = window[this.InstanceID + "_OnInstanceKeyPress"];
            if(typeof cevent === "function"){
                this.OnInstanceKeyPress = cevent;
            }

            //frame event assignments
            cevent = window[this.Name + "_OnFrameLoad"];
            if(typeof cevent === "function"){
                this.OnFrameLoad = cevent;
            }
            
            cevent = window[this.Name + "_OnFramePropertyChange"];
            if(typeof cevent === "function"){
                this.OnFramePropertyChange = cevent;
            }
            
            cevent = window[this.Name + "_OnFrameLoad"];
            if(typeof cevent === "function"){
                cevent(this, this.Context);
            }
            if(this.EventPrimitive == null){
                this.EventPrimitive = this.Primitive;
            }
            
            if(this.EventPrimitive){
                var context = this.Context;
                var frame = this;
                this.EventPrimitive.onclick = function(event){
                    if(typeof frame.OnInstanceClick === "function"){
                        frame.OnInstanceClick(frame, context, event);
                    }
                };
                this.EventPrimitive.ondblclick = function(event){
                    if(typeof frame.OnInstanceDoubleClick === "function"){
                        frame.OnInstanceDoubleClick(frame, context, event);
                    }
                };
                this.EventPrimitive.onmousemove = function(event){
                    if(typeof frame.OnInstanceMouseMove === "function"){
                        frame.OnInstanceMouseMove(frame, context, event);
                    }
                };
                this.EventPrimitive.onmouseenter = function(event){
                    if(typeof frame.OnInstanceMouseEnter === "function"){
                        frame.OnInstanceMouseEnter(frame, context, event);
                    }
                };
                this.EventPrimitive.onmouseleave = function(event){
                    if(typeof frame.OnInstanceMouseLeave === "function"){
                        frame.OnInstanceMouseLeave(frame, context, event);
                    }
                }
                
                this.EventPrimitive.onmousedown = function(event){
                    if(typeof frame.OnInstanceMouseDown === "function"){
                        frame.OnInstanceMouseDown(frame, context, event);
                    }
                }
                this.EventPrimitive.onmouseup = function(event){
                    if(typeof frame.OnInstanceMouseUp === "function"){
                        frame.OnInstanceMouseUp(frame, context, event);
                    }
                }

                this.EventPrimitive.onkeydown = function(event){
                    if(typeof frame.OnInstanceKeyDown === "function"){
                        frame.OnInstanceKeyDown(frame, context, event);
                    }
                }
                this.EventPrimitive.onkeyup = function(event){
                    if(typeof frame.OnInstanceKeyUp === "function"){
                        frame.OnInstanceKeyUp(frame, context, event);
                    }
                }
                this.EventPrimitive.onkeypress = function(event){
                    if(typeof frame.OnInstanceKeyPress === "function"){
                        frame.OnInstanceKeyPress(frame, context, event);
                    }
                }

                if(this.Scripts){
                  for(var x = 0; x < this.Scripts.length; x++){
                    rdinclude(this.Scripts[x], "script");
                  }
                }

                if(this.StyleSheets){
                  for(var x = 0; x < this.StyleSheets.length; x++){
                    rdinclude(this.StyleSheets[x], "css");
                  }
                }



                retval = true;
            }
        }
        catch(e){
            console.log(e);
            retval = false;
        }

        return retval;
  },
  AddChild: function(widget){

  },
  RemoveChild: function(widget){

  },
  /**
   * This function initializes a RadicalFrame object based on a JSON definition.
   * @param {string} jsonString The string of JSON to use as the basis for defining this frame.
   * @returns {boolean} Returns true if the frame was successfully initialized.
   */
  InitFrame: function(jsonString){
    var retval = false;
        try{
            var frame = JSON.parse(jsonString);
            this.Classes = [];
            if(frame.Classes){
                this.Classes = frame.Classes;
            }
            this.Properties = {};
            if(frame.Properties){
                this.Properties = frame.Properties;
            }
            this.Name = "[Name]";
            if(frame.Name){
                this.frame = frame.Name;
            }
            this.Widgets = [];
            if(frame.Widgets){
                this.Widgets = frame.Widgets;
            }
            this.Scripts = [];
            if(frame.Scripts){
                this.Scripts = frame.Scripts;
            }

            this.StyleSheets = [];
            if(frame.StyleSheets){
                this.StyleSheets = frame.StyleSheets;
            }
            
            this.Primitive = null;
            if(frame.Primitive){
                this.Primitive = frame.Primitive;
            }
            this.EventPrimitive = null;
            if(frame.EventPrimitive){
                this.EventPrimitive = frame.EventPrimitive;
            }
            retval = true;
        }
        catch(e){
            console.log(e);
        }
        return retval;
  },
  ExportFrame: function(){

  },
  Compile: function(){

  }
  
}