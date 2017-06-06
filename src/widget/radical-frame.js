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
            if(scripts[x].src === url){
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
            if(scripts[x].href === url){
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
 * instantiates a new RadicalFrame object with an Instance ID and Document
 * @param {string} id An instance ID for this frame. (optional)
 * @param {Document} doc A Document object for this frame. (optional)
 * @param {string} json A json string representing this RadicalFrame (optional)
 */
function RadicalFrame(id, doc, json){
  if(typeof doc === "undefined")
  {
    doc = null;
  }
  if(typeof id === "undefined"){
    id = "Frame1";
  }
  this.Document = doc;
  this.InstanceID = id;
  
}

RadicalFrame.prototype = {
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
  Widgets: [],
  Scripts: [],
  StyleSheets: [],
}