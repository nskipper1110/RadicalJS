/**
 * radical-controller.js
 * Created by Nathan Skipper, MTI
 * Created on 12/22/2016
 * Revision 0.1
 * @copyright (c) 2016, Montgomery Technology, Inc.
 * License: This code is claimed as the intellectual property of Montgomery Technology, Inc.
 * and Nathan Skipper. This code may not be redistributed or copied in any way without the
 * prior written consent of either party listed above.
 * 
 * Description: Radicaljs is a front in framework for integrating MVC with an
 * opinionated approach to the layout of the view and the controller. Radical
 * consists of two foundatonal classes, the RadicalController class and the
 * RadicalView class. 
 * 
 * RadicalController will handle all calls to the server
 * Controllers. This class assumes certain rules about RESTful calls. It assumes
 * that GET calls are used to retrieve data (no parameters means "Get All", while
 * parameters means "Get Some or One"). It assumes POST calls are used to add new
 * data, PUT calls are used to save existing data, and DELETE calls are used to
 * delete data.
 * 
 * RadicalView allows the developer to use directives to define the data elements
 * within HTML which the view will use to represent the data retreived.
 */

/**
 * Defines the different AJAX modes used by the RadicalController class.
 * @type string
 */
var RadicalModes = {
    MODE_POST   : "POST",
    MODE_GET    : "GET",
    MODE_PUT    : "PUT",
    MODE_DELETE : "DELETE"
};

/**
 * Defines the different directives available for use in the view.
 * @type string
 */
var RadicalDirectives = {
    Table     : "rd-table",
    Column    : "rd-col",
    ColClass  : "rd-col-class",
    ColKey    : "rd-col-key",
    List      : "rd-list",
    ListText  : "rd-list-text",
    ListVal   : "rd-list-val",
    ListClass : "rd-list-class",
    Field     : "rd-field"
};

var RadicalErrors = {
	Unauthorized: 401,
	NoRecord: 406,
	NoDatabase: 503,
	InternalException: 500
};

/**
 * Constructs a new RadicalController object based on the given service URL.
 * @param {string} serviceURL
 * @returns {RadicalController}
 */
function RadicalController(serviceURL){
    this.ServiceURL = serviceURL;
}

RadicalController.prototype = {
    /**
     * 
     * @param {string} mode The AJAX mode for the call.
     * @param {object} params The parameters (as JSON) to pass.
     * @param {function} success The function to call on success. The function prototype should be of type function(data), where data is the JSON return.
     * @param {function} failure The function to call on failure. This function prototype should be of type function(err), where err is the HTTP error code.
     * @returns {void}
     */
    handle: function(mode, params, success, failure){
        try{
            if ((typeof params === 'undefined') || (params === null)){
                params = {};
            }
            if ((typeof mode === 'undefined') || (mode === null)){
                mode = "GET";
            }
            if ((typeof success === 'undefined') || (success === null) || !(typeof success === 'function')){
                success = function(data){console.log(data);};
            }
            if ((typeof failure === 'undefined') || (failure === null) || !(typeof failure === 'function')){
                failure = function(err){console.log("HTTP Error: " + err);};
            }
            
            $.ajax({
              dataType: "json",
              url: this.ServiceURL,
              type: mode,
              contentType: "application/x-www-form-urlencoded",
              data: params,
              success: success,
              error: function(xhr,status,error){
                  if(xhr.status == 200){
                  	success(null);
                  }
                  else{
                  	failure(xhr.status);
                  }
              }
            });
        }
        catch(e){
            console.log(e);
        }
    },
    
    /**
     * Retrieves data from a service.
     * @param {object} params A JSON object representing the parameters to pass.
     * @param {function} success The function to call on success. The function prototype should be of type function(data), where data is the JSON return.
     * @param {function} failure The function to call on failure. This function prototype should be of type function(err), where err is the HTTP error code.
     * @returns {void}
     */
    get: function(params, success, failure){
        try{
            this.handle(RadicalModes.MODE_GET, params, success, failure);
        }
        catch(e){
            console.log(e);
        }
    },
    
    /**
     * Submits new data to a service.
     * @param {object} params A JSON object representing the parameters to pass.
     * @param {function} success The function to call on success. The function prototype should be of type function(data), where data is the JSON return.
     * @param {function} failure The function to call on failure. This function prototype should be of type function(err), where err is the HTTP error code.
     * @returns {void}
     */
    add: function(params, success, failure){
        try{
            this.handle(RadicalModes.MODE_POST, params, success, failure);
        }
        catch(e){
            console.log(e);
        }
    },
    
    /**
     * Submits existing data to a service.
     * @param {object} params A JSON object representing the parameters to pass.
     * @param {function} success The function to call on success. The function prototype should be of type function(data), where data is the JSON return.
     * @param {function} failure The function to call on failure. This function prototype should be of type function(err), where err is the HTTP error code.
     * @returns {void}
     */
    save: function(params, success, failure){
        try{
            this.handle(RadicalModes.MODE_PUT, params, success, failure);
        }
        catch(e){
            console.log(e);
        }
    },
    /**
     * deletes data from a service.
     * @param {object} params A JSON object representing the parameters to pass.
     * @param {function} success The function to call on success. The function prototype should be of type function(data), where data is the JSON return.
     * @param {function} failure The function to call on failure. This function prototype should be of type function(err), where err is the HTTP error code.
     * @returns {void}
     */
    remove: function(params, success, failure){
        try{
            this.handle(RadicalModes.MODE_DELETE, params, success, failure);
        }
        catch(e){
            console.log(e);
        }
    }
};

/**
 * Add a "get ElementsByAttribute function to the document and Element objects.
 * This function will search all elements in the DOM to find those containing
 * a certain attribute.
 */
document.getElementsByAttribute = Element.prototype.getElementsByAttribute = function(attr) {
    var nodeList = this.getElementsByTagName('*');
    var nodeArray = [];

    for (var i = 0, elem; elem = nodeList[i]; i++) {
        if ( elem.getAttribute(attr) ) nodeArray.push(elem);
        nodeArray.concat(elem.getElementsByAttribute(attr));
    }

    return nodeArray;
};

function setCookie(cname, cvalue, minutes) {
    var d = new Date();
    d.setTime(d.getTime() + (minutes*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 

/**
 * Instantiates a new RadicalView object. The RadicalView class defines the functionality
 * for integrating with a RESTful controller and the DOM to display data from the
 * controller to the DOM based on directives, and conversely from the DOM to the
 * controller.
 * @param {string} serviceURL
 * @returns {RadicalView}
 */
function RadicalView(serviceURL){
    this.Controller = new RadicalController(serviceURL);
}

RadicalView.prototype = {
    /**
     * The RadicalElements property is populated with all of the DOM elements
     * which contain "rd-" attributes. The array is keyed based on the directive
     * for each attribute.
     * @type Array
     */
    RadicalizedElements: [],
    
    /**
     * For each table given, this function applies the results to the table.
     * @param {Array} tableElems - An array of elements which have implemented the "rd-table" attribute.
     * @param {Array} results - An array of JSON objects representing the data to display.
     * @param {function} select - A function to be called when a row is selected.
     * @param {function} click - A function to be called when a row is clicked.
     * @returns {void}
     */
    becomeTable: function(tableElems, results, select, click){
        try{
            if (tableElems.constructor === Array && results.constructor === Array){
                for(var elem in tableElems){
                    var table = tableElems[elem];
                    var cols = [];
                    for(var x = 0; x < this.RadicalizedElements[RadicalDirectives.Column].length; x++){
                        var col = this.RadicalizedElements[RadicalDirectives.Column][x];
                        cols.push({
                            colname: col.getAttribute(RadicalDirectives.Column),
                            colclass: col.getAttribute(RadicalDirectives.ColClass)
                        });

                    }
                    var body = null;
                    if(table.getElementsByTagName("tbody").length > 0){
                       body = table.getElementsByTagName("tbody")[0]; 
                    }else{
                        body = document.createElement("tbody");
                        table.appendChild(body);
                    }
                    while (body.firstChild) {
                        body.removeChild(body.firstChild);
                    }
                    //table.prototype.RadicalDataset = null;
                    table.RadicalDataset = results;
                    var id = table.getAttribute("id");
                    if(typeof body !== "undefined" && body !== null){
                        for(var row = 0; row < results.length; row++){
                            var tr = document.createElement("tr");
                            if(id !== null && id !== ""){
                                tr.setAttribute("id", id + "-" + row);
                            }
                            for(var c = 0; c < cols.length; c++){
                                var td = document.createElement("td");
                                if(cols[c].colclass !== null && cols[c].colclass !== ""){
                                    td.setAttribute("class", cols[c].colclass);
                                }
                                if(id !== null && id !== ""){
                                    td.setAttribute("id", id + "-" + row + "-" + cols[c].colname);
                                }

                                td.innerHTML = results[row][cols[c].colname];
                                //td.prototype.RadicalValue = null;
                                td.RadicalRow = results[row];
                                tr.appendChild(td);
                            }
                            if(typeof select === "function"){
                                tr.onselect = select;
                            }
                            if(typeof click === "function"){
                                tr.onclick = click;
                            }
                            //tr.prototype.RadicalRow = null;
                            tr.RadicalRow = results[row];
                            body.appendChild(tr);
                        }
                    }

                }
            }
        }
        catch(e){}
    
    },
    
    /**
     * This function loops through all list elements given and applies the given
     * data to that list based on the directives.
     * @param {Array} listElems - An array of list elements to apply the data to. These elements are designated by the "rd-list" attribute.
     * @param {Array} results - An array of JSON objects representing the data to use in the list.
     * @param {function} select - A function to call when an element of the list is selected.
     * @param {function} click - A function to call when an element of the list is clicked.
     * @returns {void}
     */
    becomeList: function(listElems, results, select, click){
        try{
            if (listElems.constructor === Array && results.constructor === Array){
                for(var elem in listElems){
                    var list = listElems[elem];
                    var tag = list.tagName;
                    var id = list.getAttribute("id");
                    var textField = list.getAttribute(RadicalDirectives.ListText);
                    var valField = list.getAttribute(RadicalDirectives.ListVal);
                    var listClass = list.getAttribute(RadicalDirectives.ListClass);
                    while (list.firstChild) {
                        list.removeChild(list.firstChild);
                    }
                    if(textField !== null && textField !== "" && valField !== null && valField !== ""){

                        for(var key in results){
                            var result = results[key];
                            if(result.hasOwnProperty(valField) && result.hasOwnProperty(textField)){
                                switch(tag.toLowerCase()){
                                    case "ul":
                                        var itemli = document.createElement("li");
                                        var item = document.createElement("a");
                                        
                                        if(listClass !== null && listClass !== ""){
                                            item.setAttribute("class", listClass);
                                        }
                                        if(id !== null && id !== ""){
                                            item.setAttribute("id", id + "-" + key);
                                        }
                                        item.setAttribute("href", "#");
                                        item.innerHTML = result[textField];
                                        if(typeof select === "function"){
                                            item.onselect = select;
                                        }
                                        if(typeof click === "function"){
                                            item.onclick = click;
                                        }
                                        
                                        item.RadicalRow = result;
                                        itemli.appendChild(item);
                                        list.appendChild(itemli);
                                        break;
                                    case "select":
                                        var item = document.createElement("option");

                                        if(listClass !== null && listClass !== ""){
                                            item.setAttribute("class", listClass);
                                        }
                                        if(id !== null && id !== ""){
                                            item.setAttribute("id", id + "-" + key);
                                        }
                                        item.setAttribute("value", result[valField]);
                                        item.innerHTML = result[textField];
                                        if(typeof select === "function"){
                                            item.onselect = select;
                                        }
                                        if(typeof click === "function"){
                                            item.onclick = click;
                                        }
                                        item.RadicalRow = result;
                                        list.appendChild(item);
                                        break;
                                }
                            }
                        }
                    }
                    list.RadicalDataSet = results;
                    if(typeof select === 'function'){
                        list.onselect = select;
                    }
                    if(typeof click === 'function'){
                        list.onclick = click;
                    }
                }
            }
        }
    catch(e){}
    },
    
    /**
     * Applies the data given in the result parameter to the element given in the "elem" parameter.
     * @param {Element} elem - An element which has been designated using the "rd-field" attribute.
     * @param {object} result - A JSON object representing the data to apply to the element
     * @param {function} select - A function which should be called when the element is selected.
     * @param {function} click - A function to be called when the element is clicked.
     * @returns {void}
     */
    becomeField: function(elem, result, select, click){
        try{
            if (!(typeof elem === 'undefined') && !(elem === null) && !(typeof result === 'undefined') && !(result === null)){
                var id = elem.getAttribute("id");
                var type = elem.getAttribute("type");
                if(type === null){
                    type = "";
                }
                type = type.toLocaleLowerCase();
                if(id.length > 0){
                    if(type !== "checkbox"){
                        
                        if(elem.tagName.toLowerCase() === "select"){
                            for(var x = 0; x < elem.options.length; x++){
                                var optVal = elem.options[x].value;
                                if(!isNaN(optVal)){
                                    optVal = Number(optVal);
                                }
                                if(optVal === result[id]){
                                    elem.options[x].selected = "selected";
                                    
                                }
                                else{
                                    elem.options[x].selected = "";
                                }
                            }
                        }
                        elem.value = result[id];
                    }
                    else{
                        if(isNaN(result[id])){
                            elem.checked = result[id];
                        }
                        else{
                            elem.checked = (result[id] > 0);
                        }
                    }
                }

                if(typeof select === 'function'){
                    elem.onselect = select;
                }
                if(typeof click === 'function'){
                    elem.onclick = click;
                }
                elem.RadicalRow = result;
            }
        
        }
        catch(e){}
    },
    
    /**
     * Takes in a DOM element and runs through the elements of that DOM to apply
     * field values from the results.
     * @param {Element} form - A DOM element which contains elements designated by the "rd-field" attribute.
     * @param {object} result - A JSON object representing the data to apply to the fields.
     * @param {function} select - A function to call when an field is selected.
     * @param {function} click - A function to call when a field is clicked.
     * @returns {void}
     */
    becomeFields: function(form, result, select, click){
        try{
            var elems = form.getElementsByAttribute(RadicalDirectives.Field);
            for(var elem = 0; elem < elems.length; elem++){
                this.becomeField(elems[elem], result, select, click);
            }
            form.RadicalRow = result;
        }
        catch(e){
            console.log(e);
        }
    },
    
    /**
     * Main function used to retrieve data from a controller and apply the values
     * to DOM elements based on the Radical directives.
     * @param {Element} element - The DOM element from which to launch a search for all RD directives. This parameter is required.
     * @param {Array} keys - A JSON object containing the keys and values to use in calling the controller. This object should contain the fields that the 
     *                      controller will be looking for within a "get" call. Can be null or undefined.
     * @param {function} failure - A function to call if the call to the controller fails. Can be null or undefined.
     * @param {function} select - A function to assign to any element that has a Radical directive which will be called when the element is selected.
     * @param {function} click - A function to assign to any element that has a radical directive which will be called when the element is clicked.
     * @returns {void}
     */
    become: function(element, keys, failure, select, click, onsuccess){
        try{
            if ((typeof element === 'undefined') || (element === null)){
                element = document;
            }
            
            if ((typeof select === 'undefined') || !(typeof select === 'function')){
                select = null;
            }
            
            if ((typeof onsuccess === 'undefined') || !(typeof onsuccess === 'function')){
                onsuccess = null;
            }
            
            if ((typeof failure === 'undefined') || (failure === null) || !(typeof failure === 'function')){
                failure = function(err){console.log("HTTP Error: " + err);};
            }
            if ((typeof click === 'undefined') || !(typeof click === 'function')){
                click = null;
            }
            
            this.RadicalizedElements = [];
            
            for (var key in RadicalDirectives) {
                if (RadicalDirectives.hasOwnProperty(key)) {
                    this.RadicalizedElements[RadicalDirectives[key]] = element.getElementsByAttribute(RadicalDirectives[key]);
                }
            }
            var scope = this;
            this.Controller.get(keys, 
            function(data){
                try{
                    if ((typeof data === 'undefined') || (data === null)){
                        console.log("RadicalView.become--No data returned from get call.");
                    }
                    else{
                        var results = [];
                        if(data.constructor === Array){
                            results = data;
                        }
                        else{
                            
                            results[0] = data;
                        }
                        if (scope.RadicalizedElements.hasOwnProperty(RadicalDirectives.Table)) {
                            scope.becomeTable(scope.RadicalizedElements[RadicalDirectives.Table], results,select, click);
                        }
                        if (scope.RadicalizedElements.hasOwnProperty(RadicalDirectives.List)) {
                            scope.becomeList(scope.RadicalizedElements[RadicalDirectives.List], results, select, click);
                        }
                        if (scope.RadicalizedElements.hasOwnProperty(RadicalDirectives.Field)) {
                            scope.becomeFields(element, results[0],select, click);
                        }
                        if(onsuccess !== null) onsuccess(data);
                    }
                }
                catch(e){
                    console.log(e);
                }
            },
            
            function(error){
                console.log("RadicalView.become--failure to get data from service with error code " + error);
                failure(error);
            }
            
            );
        }
        catch(e){
            console.log(e);
        }
    },
    
    /**
     * The main function used to apply changes from a set of "rd-field" elements contained within a DOM element and submit
     * them to the controller to add the record.
     * @param {Element} element - The DOM element to search for rd field elements.
     * @param {function} success - A function to call on the success of the addition.
     * @param {function} failure - A function to call on the failure of the addition.
     * @returns {void}
     */
    add: function(element, success, failure){
        try{
            if ((typeof element === 'undefined') || (element === null)){
                element = document;
            }
            if ((typeof success === 'undefined') || (success === null) || !(typeof success === 'function')){
                success = function(data){console.log("add successful: " + data);};
            }
            if ((typeof failure === 'undefined') || (failure === null) || !(typeof failure === 'function')){
                failure = function(err){console.log("HTTP Error: " + err);};
            }
            
            var fields = element.getElementsByAttribute(RadicalDirectives.Field);
            var scope = this;
            var result = {};
            if(element.RadicalRow){
                result = element.RadicalRow;
            }
            for(var x = 0; x < fields.length; x++){
                var field = fields[x];
                var id = field.getAttribute("id");
                var type = (field.getAttribute("type") + "").toLowerCase();
                if(type === "checkbox"){
                    result[id] = 0;
                    if(field.checked) result[id] = 1;

                }
                else{
                    result[id] = field.value;
                }
                
                
            }
            this.Controller.add(result, success, failure);
            
        }
        catch(e){
            console.log(e);
        }
    },
    
    /**
     * The main function called to save an existing record through the controller.
     * @param {Element} element - A dom element from which to obtain all of the "rd-field" elements.
     * @param {function} success - A function to call on the success of the save.
     * @param {function} failure - A function to call on the failure of the save.
     * @returns {void}
     */
    save: function(element, success, failure){
        try{
            if ((typeof element === 'undefined') || (element === null)){
                element = document;
            }
            if ((typeof success === 'undefined') || (success === null) || !(typeof success === 'function')){
                success = function(data){console.log("Save successful: " + data);};
            }
            if ((typeof failure === 'undefined') || (failure === null) || !(typeof failure === 'function')){
                failure = function(err){console.log("HTTP Error: " + err);};
            }
            
            var fields = element.getElementsByAttribute(RadicalDirectives.Field);
            var scope = this;
            if(element.RadicalRow){
                var result = element.RadicalRow;
                for(var x = 0; x < fields.length; x++){
                    var field = fields[x];
                    var id = field.getAttribute("id");
                    var type = (field.getAttribute("type") + "").toLowerCase();
                    if(type === "checkbox"){
                        result[id] = 0;
                        if(field.checked) result[id] = 1;
                        
                    }
                    else{
                        result[id] = field.value;
                    }
                }
                this.Controller.save(result, success, failure);
            }
        }
        catch(e){
            console.log(e);
        }
    },
    
    /**
     * 
     * @param {Element} element
     * @param {function} success
     * @param {function} failure
     * @returns {void}
     */
    remove: function(element, success, failure){
        try{
            if ((typeof element === 'undefined') || (element === null)){
                element = document;
            }
            if ((typeof success === 'undefined') || (success === null) || !(typeof success === 'function')){
                success = function(data){console.log("Delete successful: " + data);};
            }
            if ((typeof failure === 'undefined') || (failure === null) || !(typeof failure === 'function')){
                failure = function(err){console.log("HTTP Error: " + err);};
            }
            
            var fields = element.getElementsByAttribute(RadicalDirectives.Field);
            var scope = this;
            if(element.RadicalRow){
                var result = element.RadicalRow;
                for(var x = 0; x < fields.length; x++){
                    var field = fields[x];
                    var id = field.getAttribute("id");
                    if(result.hasOwnProperty(id)){
                        result[id] = field.value;
                    }
                }
                this.Controller.remove(result, success, failure);
            }
        
        }
        catch(e){
            console.log(e);
        }
    }
};
var RadicalHacks = {
    exportTableToCSV: function($table, filename) {

        var $rows = $table.find('tr:has(td)'),

            // Temporary delimiter characters unlikely to be typed by keyboard
            // This is to avoid accidentally splitting the actual contents
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character

            // actual delimiter characters for CSV format
            colDelim = '","',
            rowDelim = '"\r\n"',

            // Grab text from table into CSV formatted string
            csv = '"' + $rows.map(function (i, row) {
                var $row = $(row),
                    $cols = $row.find('td');

                return $cols.map(function (j, col) {
                    var $col = $(col),
                        text = $col.text();

                    return text.replace(/"/g, '""'); // escape double quotes

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"',

            // Data URI
            csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        $(this)
            .attr({
            'download': filename,
                'href': csvData,
                'target': '_blank'
        });
    },
    printElement: function(title, elemHTML){
        var mywindow = window.open('', title, 'height=400, width=600');

        var html = "<html><head>\n";
        for(var i = 0; i < document.styleSheets.length; i++){
            html += "<link href=\"" + document.styleSheets[i].href + "\" rel=\"stylesheet\"/>\n";
        }
        for(var i = 0; i < document.scripts.length; i++){
            var script = document.scripts.item(i);
            html += '<script src="' + script.src + '" type="' + script.type + '">' + script.text + '</script>';
        }
        //html += "<link href=\"" + root + "/css/modern-responsive.css\" rel=\"stylesheet\"/>\n"
        html += "<title>" + title + "</title>\n";
        html += '</head><body class="metrouicss">';
        html += elemHTML;
        html += "<script>window.print();window.close();</script>";
        html += '</body></html>';
        mywindow.document.write(html);
        mywindow.document.write("\n");
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10

        //mywindow.print();
        //mywindow.close();

        return true;
    },
    ExportTableEvent: function(event, $table, filename){
        
        RadicalHacks.exportTableToCSV.apply(event.target, [$table, filename]);
    },
    Paginate: function(tableID){
            $('table.paginated').each(function() {
                var currentPage = 0;
                var numPerPage = 10;
                var $table = $("#" + tableID);
                $table.bind('repaginate', function() {
                    $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
                });
                $table.trigger('repaginate');
                var numRows = $table.find('tbody tr').length;
                var numPages = Math.ceil(numRows / numPerPage);
                var $pager = $('<div class="pager"></div>');
                for (var page = 0; page < numPages; page++) {
                    $('<span class="page-number"></span>').text(page + 1).bind('click', {
                        newPage: page
                    }, function(event) {
                        currentPage = event.data['newPage'];
                        $table.trigger('repaginate');
                        $(this).addClass('active').siblings().removeClass('active');
                    }).appendTo($pager).addClass('clickable');
                }
                $pager.insertAfter($table).find('span.page-number:first').addClass('active');
            });
        }
};