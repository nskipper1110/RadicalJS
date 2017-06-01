/**
 * radical-widget.js
 * Created by Nathan Skipper, MTI
 * Created on 2/7/2017
 * Revision 0.1
 * @copyright (c) 2017, Montgomery Technology, Inc.
 * License: This code is claimed as the intellectual property of Montgomery Technology, Inc.
 * and Nathan Skipper. This code may not be redistributed or copied in any way without the
 * prior written consent of either party listed above.
 * 
 * Description: This file contains classes related to the "widget" functionality within
 * Radical. A widget is a graphical object which will be represented within both the Designer
 * and the Application.
 */

function GetWidgetDependency(url){
    var retval = null;
    try{
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
        if(xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
                retval = xmlhttp.responseText;
            }
        }

    }
    catch(e){
        console.log(e);
    }
    return retval;
}

function RadicalWidget(id){
    this.InstanceID = id;
}

RadicalWidget.prototype = {
    
    /**
     * Classes defines an array of classes used by this widget in the GUI.
     */
    Classes: [],
    /**
     * Children defines child instances under this widget instance.
     */
    Children: [],
    /**
     * The name of this widget.
     */
    Name: "",
    /**
     * An array of properties for the instance of this widget. The "OnWidgetLoad" function shall define
     * the base properties for this widget by instantiating the properties used by the widget.
     */
    Properties: {},
    Primitive: null,
    Context: null,
    OnInstanceClick: function(widget, context, event){console.log('RadicalWidget.OnClick');},
    OnInstanceChange: function(widget, context, event){console.log('RadicalWidget.OnChange');},
    OnInstanceMouseMove: function(widget, context, event){console.log('RadicalWidget.OnMouseMove');},
    OnInstanceMouseEnter: function(widget, context, event){console.log('RadicalWidget.OnMouseEnter');},
    OnInstanceMouseLeave: function(widget, context, event){console.log('RadicalWidget.OnMouseLeave');},
    OnInstanceMouseDown: function(widget, context, event){console.log('RadicalWidget.OnMouseDown');},
    OnInstanceMouseUp: function(widget, context, event){console.log('RadicalWidget.OnMouseUp');},
    OnInstanceAddChild: function(widget, context, child){},
    OnInstanceRemoveChild: function(widget, context, child){},
    OnWidgetPropertyChange: "function(widget, context, property){}",
    OnWidgetLoad: "function(widget, context){\n\
        widget.SetProperty(\"Width\", \"30px\");\n\
        widget.SetProperty(\"Height\", \"30px\");\n\
        widget.SetProperty(\"Top\", \"0px\");\n\
        widget.SetProperty(\"Left\", \"0px\");\n\
        widget.SetProperty(\"Position\", \"absolute\");\n\
        widget.SetProperty(\"Background\", \"green\");\n\
        widget.SetProperty(\"Foreground\", \"white\");\n\
    }",
    OnWidgetSetEnabled: "function(widget, context, enable){}",
    OnWidgetGetEnabled: "function(widget, context){}",
    OnWidgetSetVisible: "function(widget, context, visible){}",
    OnWidgetGetVisible: "function(widget, context){}",
    OnWidgetGetValue: "function(widget, context){}",
    OnWidgetSetValue: "function(widget, context, value){}",
    SetProperty: function(name, value){
        var retval = false;
        try{
            if(typeof Properties === "Array"){
                if(typeof Properties[name] !== "undefined"){
                    Properties[name] = value;
                    var func = window[this.InstanceID + "_WidgetEvents.OnWidgetPropertyChange"];
                    if(typeof func === "function"){
                        func(this, this.Context, name);
                        retval = true;
                    }
                }
            }
        }
        catch(e){
            console.log(e);
        }
        return retval;
    },
    GetProperty: function(name){
        var retval = null;
        try{
            if(typeof this.Properties[name] !== "undefined"){
                retval = this.Properties[name];
            }
        }
        catch(e){
            console.log(e);
        }
        return retval;
    },
    InitWidget: function(jsonString){
        var retval = false;
        try{
            var widget = JSON.parse(jsonString);
            if(widget.Classes){
                this.Classes = widget.Classes;
            }
            if(widget.Properties){
                this.Properties = widget.Properties;
            }
            if(widget.OnWidgetGetEnabled){
                this.OnWidgetGetEnabled = widget.OnWidgetGetEnabled;
            }
            if(widget.OnWidgetGetValue){
                this.OnWidgetGetValue = widget.OnWidgetGetValue;
            }
            if(widget.OnWidgetGetVisible){
                this.OnWidgetGetVisible = widget.OnWidgetGetVisible;
            }
            if(widget.OnWidgetLoad){
                this.OnWidgetLoad = widget.OnWidgetLoad;
            }
            if(widget.OnWidgetPropertyChange){
                this.OnWidgetPropertyChange = widget.OnWidgetPropertyChange;
            }
            if(widget.OnWidgetSetEnabled){
                this.OnWidgetSetEnabled = widget.OnWidgetSetEnabled;
            }
            if(widget.OnWidgetSetValue){
                this.OnWidgetSetValue = widget.OnWidgetSetValue;
            }
            if(widget.OnWidgetSetVisible){
                this.OnWidgetSetVisible = widget.OnWidgetSetVisible;
            }
            if(widget.Name){
                this.Name = widget.Name;
            }
        }
        catch(e){
            console.log(e);
        }
        return retval;
    },
    Load: function(context){
        var retval = true;
        try{
            this.Context = context;
            var widgetScript = document.getElementById(this.InstanceID + "_WidgetEvents");
            var widgetDec = document.getElementById("WidgetDeclarations");
            
            var head = document.getElementsByTagName("head")[0];
            
            if(!widgetDec){
                widgetDec = document.createElement("script");
                widgetDec.id = "WidgetDeclarations";
                head.appendChild(widgetDec);
                if(widgetDec.innerText.indexOf(this.InstanceID + "_WidgetEvents") == -1){
                    widgetDec.innerText += "var " + this.InstanceID + "_WidgetEvents = {};\n";
                    
                }
            }
            var widgetEvents = window[this.InstanceID + "_WidgetEvents"];
            widgetEvents.WidgetInstance = this;
            
            var cevent = window[this.InstanceID + "_OnInstanceClick"];
            if(typeof cevent === "function"){
                this.OnInstanceClick = cevent;

            }
            cevent = window[this.InstanceID + "_OnInstanceChange"];
            if(typeof cevent === "function"){
                this.OnInstanceChange = cevent;
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

            if(widgetScript == null){
                widgetScript = document.createElement("script");
                widgetScript.id = this.InstanceID + "_WidgetEvents";
            }

            widgetScript.innerText = this.InstanceID + "_WidgetEvents.OnWidgetLoad = " + this.OnWidgetLoad + ";\n";
            widgetScript.innerText += this.InstanceID + "_WidgetEvents.OnWidgetSetEnabled = " + this.OnWidgetSetEnabled + ";\n";
            widgetScript.innerText += this.InstanceID + "_WidgetEvents.OnWidgetGetEnabled = " + this.OnWidgetGetEnabled + ";\n";
            widgetScript.innerText += this.InstanceID + "_WidgetEvents.OnWidgetSetVisible = " + this.OnWidgetSetVisible + ";\n";
            widgetScript.innerText += this.InstanceID + "_WidgetEvents.OnWidgetGetVisible = " + this.OnWidgetGetVisible + ";\n";
            widgetScript.innerText += this.InstanceID + "_WidgetEvents.OnWidgetSetValue = " + this.OnWidgetSetValue + ";\n";
            widgetScript.innerText += this.InstanceID + "_WidgetEvents.OnWidgetGetValue = " + this.OnWidgetGetValue + ";\n";
            widgetScript.innerText += this.InstanceID + "_WidgetEvents.OnWidgetPropertyChange = " + this.OnWidgetPropertyChange + ";\n";
            
            head.appendChild(widgetScript);
            eval(this.InstanceID + "_WidgetEvents.OnWidgetLoad(" + this.InstanceID + "_WidgetEvents.WidgetInstance, " + this.InstanceID + "_WidgetEvents.WidgetInstance.Context);");
            if(this.Primitive){
                var context = this.Context;
                var widget = this;
                this.Primitive.onclick = function(event){
                    if(typeof widget.OnInstanceClick === "function"){
                        widget.OnInstanceClick(widget, context, event);
                    }
                };
                this.Primitive.onmousemove = function(event){
                    if(typeof widget.OnInstanceMouseMove === "function"){
                        widget.OnInstanceMouseMove(widget, context, event);
                    }
                };
                this.Primitive.onmouseenter = function(event){
                    if(typeof widget.OnInstanceMouseEnter === "function"){
                        widget.OnInstanceMouseEnter(widget, context, event);
                    }
                };
                this.Primitive.onmouseleave = function(event){
                    if(typeof widget.OnInstanceMouseLeave === "function"){
                        widget.OnInstanceMouseLeave(widget, context, event);
                    }
                }
                this.Primitive.onchange = function(event){
                    if(typeof widget.OnInstanceChange === "function"){
                        widget.OnInstanceChange(widget, context, event);
                    }
                }
                this.Primitive.onmousedown = function(event){
                    if(typeof widget.OnInstanceMouseDown === "function"){
                        widget.OnInstanceMouseDown(widget, context, event);
                    }
                }
                this.Primitive.onmouseup = function(event){
                    if(typeof widget.OnInstanceMouseUp === "function"){
                        widget.OnInstanceMouseUp(widget, context, event);
                    }
                }
            }
        }
        catch(e){
            console.log(e);
            retval = false;
        }
    },
    SetEnabled: function(enable){
        var retval = false;
        try{
            var func = window[this.InstanceID + "_WidgetEvents.OnWidgetSetEnabled"];
            if(typeof func === "function"){
                retval = func(this, this.Context, enable);
            }
        }
        catch(e){
            console.log(e);
        }
        return retval;
    },
    GetEnabled: function(){
        var retval = false;
        try{
            var func = window[this.InstanceID + "_WidgetEvents.OnWidgetGetEnabled"];
            if(typeof func === "function"){
                retval = func(this, this.Context);
            }
        }
        catch(e){
            console.log(e);
        }
        return retval;
    },
    SetVisible: function(visible){
        var retval = false;
        try{
            var func = window[this.InstanceID + "_WidgetEvents.OnWidgetSetVisible"];
            if(typeof func === "function"){
                retval = func(this, this.Context, visible);
            }
        }
        catch(e){
            console.log(e);
        }
        return retval;
    },
    GetVisible: function(){
        var retval = false;
        try{
            var func = window[this.InstanceID + "_WidgetEvents.OnWidgetGetVisible"];
            if(typeof func === "function"){
                retval = func(this, this.Context);
            }
        }
        catch(e){
            console.log(e);
        }
        return retval;
    },
    GetValue: function(){
        var retval = null;
        try{
            var func = window[this.InstanceID + "_WidgetEvents.OnWidgetGetValue"];
            if(typeof func === "function"){
                retval = func(this, this.Context);
            }
        }
        catch(e){
            console.log(e);
        }
        return retval;
    },
    SetValue: function(val){
        var retval = false;
        try{
            var func = window[this.InstanceID + "_WidgetEvents.OnWidgetSetValue"];
            if(typeof func === "function"){
                retval = func(this, this.Context, val);
            }
        }
        catch(e){
            console.log(e);
        }
        return retval;
    }
}