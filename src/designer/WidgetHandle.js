var WidgetHandle_Widget_Definition = {
    "Classes": [],
    "Children": [],
    "Name": "WidgetHandle",
    "Value": null,
    "Parent": null,
    "Properties": {
        "Position": "absolute",
        "Top": "0px",
        "Left": "0px",
        "Bottom": "0px",
        "Right": "0px",
        "Width": "10px",
        "Height": "10px",
        "Background": "black"
    },
    "Primitive": null,
    "EventPrimitive": null,
    "Context": null
};

var WidgetHandle_Widget_JSON = JSON.stringify(WidgetHandle_Widget_Definition);

var WidgetHandle_OnWidgetLoad = function(widget, context) {
    try {
        widget.Primitive = document.createElement('span');

        widget.Primitive.id = widget.InstanceID;
        var classes = widget.Classes.join(" ");
        widget.Primitive.setAttribute("class", classes);

        for (var prop in widget.Properties) {
            widget.SetProperty(prop, widget.Properties[prop]);
        }

        widget.EventPrimitive = widget.Primitive;
        if (typeof context !== 'undefined') {
            context.appendChild(widget.Primitive);
        }
    }
    catch (e) {
        console.log(e);
    }
}

function WidgetHandle_OnWidgetAddChild(widget, context, child) {
    return false;
}

function WidgetHandle_OnWidgetRemoveChild(widget, context, child) { return false; }

function WidgetHandle_OnWidgetPropertyChange(widget, context, property) { 
    var retval = false;
    try{
        if(typeof widget.Properties[property] !== "undefined"){
            switch(property){
                case "Position":
                widget.Primitive.style.position = widget.Properties[property];
                break;
                case "Top":
                widget.Primitive.style.top = widget.Properties[property];
                break;
                case "Left":
                widget.Primitive.style.left = widget.Properties[property];
                break;
                case "Bottom":
                widget.Primitive.style.bottom = widget.Properties[property];
                break;
                case "Right":
                widget.Primitive.style.right = widget.Properties[property];
                break;
                case "Width":
                widget.Primitive.style.width = widget.Properties[property];
                break;
                case "Height":
                widget.Primitive.style.height = widget.Properties[property];
                break;
                case "Background":
                widget.Primitive.style.backgroundColor = widget.Properties[property];
                break;
            }
            retval = true;
        }
    }
    catch(e){
        console.log(e);
    }
    return retval; 
}
function WidgetHandle_OnWidgetSetEnabled(widget, context, enable) {
    var retval = false;
    try{
        widget.Primitive.disabled = !enable;
        retval = true;
    }
    catch(e){
        console.log(e);
    }
    return retval;
}
function WidgetHandle_OnWidgetGetEnabled(widget, context) { 
    var retval = false;
    try{
        retval = widget.Primitive.disabled;
    }
    catch(e){
        console.log(e);
    }
    return retval;
}
function WidgetHandle_OnWidgetSetVisible(widget, context, visible) {
    var retval = false;
    try{
        var visibility = "hidden";
        if(visible){
            visibility = "visible";
        }
        widget.Primitive.style.visibility = visibility;
        retval = true;
    }
    catch(e){
        console.log(e);
    }
    return retval;
}
function WidgetHandle_OnWidgetGetVisible(widget, context) { 
    var retval = false;
    try{
        retval = widget.Primitive.style.visibility === "visible";
    }
    catch(e){
        console.log(e);
    }
    return retval;
}
function WidgetHandle_OnWidgetGetValue(widget, context) {
    return null; 
}
function WidgetHandle_OnWidgetSetValue(widget, context, value) { 

}
