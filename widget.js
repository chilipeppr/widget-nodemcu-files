/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-chilipeppr-widget-nodemcu-files"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');

    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://raw.githubusercontent.com/chilipeppr/element-flash/master/auto-generated-widget.html",
        // "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );

    var loadSpjsWidget = function(callback) {

        var that = this;
        $('body').append($('<div id="spjsWidget"></div>'));
        chilipeppr.load(
            "#spjsWidget",
            "http://raw.githubusercontent.com/chilipeppr/widget-spjs/master/auto-generated-widget.html",
            // "http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/",
            function() {
                console.log("mycallback got called after loading spjs module");
                cprequire(["inline:com-chilipeppr-widget-serialport"], function(spjs) {
                    //console.log("inside require of " + fm.id);
                    spjs.setSingleSelectMode();
                    //spjs.init(null, "timed", 9600);
                    spjs.init({
                        isSingleSelectMode: true,
                        defaultBuffer: "nodemcu",
                        defaultBaud: 9600,
                        bufferEncouragementMsg: 'For your NodeMCU device please choose the "nodemcu" buffer in the pulldown and a 9600 baud rate before connecting.'
                    });
                    //spjs.showBody();
                    spjs.consoleToggle();

                    that.widgetSpjs = spjs;

                    if (callback) callback();

                });
            }
        );
    };
    
    // load spjs widget so we can test our interactive file listing
    loadSpjsWidget();
        
    // init my widget
    myWidget.init();
    $('#' + myWidget.id).css('margin', '10px');
    $('title').html(myWidget.name);

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-nodemcu-files", ["chilipeppr_ready", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-nodemcu-files", // Make the id the same as the cpdefine id
        name: "Widget / NodeMCU Files", // The descriptive name of your widget.
        desc: "List the files on the NodeMCU flash memory. Manage them by opening them for editing, deleting, running, compiling, etc.", // A description of what your widget does
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            //'/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
            '/com-chilipeppr-widget-luaeditor/loadScript': 'When we send this signal the Lua Editor listens for it and loads this file into the editor.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            this.setupSubscribe();
            this.setupUiFromLocalStorage();
            this.btnSetup();
            //this.initTabs();
            this.forkSetup();

            console.log("I am done being initted.");
        },
        /**
         * Send file list commands
         */
        getFileList: function() {
            var code = `l = file.list()
if next(l) == nil then
  uart.write(0, "{\"files\":null}")
else
  uart.write(0, "{\"files\":[")
  local ctr = 0
  for k,v in pairs(l) do
    if ctr > 0 then uart.write(0, ", ") end
    ctr = ctr + 1
    uart.write(0, "{\"name\":\"" .. k .. "\", \"size\":" .. v .. "}")
  end
  uart.write(0, "]}\n")
end
`;
            /*
            var code = `l = file.list()
str = ""
if next(l) == nil then
  str = "{\\"files\\":null}"
else
  str = "{\\"files\\":["
  for k,v in pairs(l) do
    str = str .. "{\\"name\\":\\"" .. k .. "\\", \\"size\\":" .. v .. "}, "
  end
  str = string.sub(str, 0, string.len(str) - 2)
  str = str .. "]}"
end
print(str)
str = nil
l = nil`;
            */
            this.send(code);
        },
        /**
         * We have to subscribe to the serial port events so we can parse them
         * to know what files are on the device.
         */
        setupSubscribe: function() {
            chilipeppr.subscribe("/com-chilipeppr-widget-serialport/recvline", this, this.onRecv);
        },
        /**
         * Keep a counter so each send has its own ID so we can use jsonSend
         * and get complete statuses back from SPJS when we send each line
         * to the serial port.
         */
        sendCtr: 0,
        /**
         * Send the script off to the serial port.
         */
        send: function(txt) {
            var cmds = txt.split(/\n/g);
            var ctr = 0;
            var that = this;

            for (var indx in cmds) {
                //setTimeout(function() {

                var cmd = cmds[ctr];

                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {
                    D: cmd + '\n',
                    Id: "filemgr-" + that.sendCtr++
                });

                ctr++;

                //}, 10 * indx);
            }
        },
        /**
         * Watch to receive messages back from serial port.
         */
        onRecv: function(data) {
            console.log("NodeMCU files -> onRecv. data:", data);
            
            // this code handles a file list json string
            if (data && 'dataline' in data && data.dataline.match(/^{/)) {
                // we at least know it is not null and is json we are after
                var cmd = data.dataline;
                console.log("NodeMCU file list. cmd:", cmd);
                
                if (cmd.match(/{"files":null}/)) {
                    // we got back an empty list of files
                    console.log("got back empty file list")
                    
                    // remove previous file list rows
                    tableEl.find(".filelist-dynamic").remove();
                    
                    $('#' + this.id + ' .filelist-start').addClass("hidden");
                    $('#' + this.id + ' .filelist-empty').removeClass("hidden");
                } else if (cmd.match(/^{"files"\:\[{/)) {
                    // we have a file list. parse and show it.
                    var list = JSON.parse(cmd);
                    list = list.files;
                    console.log("we have a populated filelist. list:", list);
                    
                    
                    $('#' + this.id + ' .filelist-start').addClass("hidden");
                    $('#' + this.id + ' .filelist-empty').addClass("hidden");
                    
                    // get template
                    var tEl = $('#' + this.id + ' .filelist-template');
                    var tableEl = $('#' + this.id + ' .filelist-table');
                    
                    // remove previous file list rows
                    tableEl.find(".filelist-dynamic").remove();
                    
                    var that = this;
                    
                    var totalSize = 0;
                    
                    // we need to sort the files since they come back in random order from nodemcu
                    var keys = [];
                    var byname = {}
                    for (var i in list) {
                        var file = list[i];
                        keys.push(file.name);
                        byname[file.name] = file;
                    }
                    keys.sort();
                    
                    for (var i in keys) {
                        var key = keys[i];
                        var file = byname[key];
                        
                        var rowEl = tEl.clone();
                        rowEl.removeClass("hidden");
                        rowEl.removeClass("filelist-template");
                        rowEl.addClass("filelist-dynamic");
                        rowEl.find(".filelist-name").text(file.name);
                        rowEl.find(".filelist-size").text(file.size + "B");
                        
                        // see if .lc file
                        if (file.name.match(/\.lc$/)) {
                            // it is .lc so do some special stuff
                            rowEl.find(".btn-fileedit").remove();
                            rowEl.find(".btn-filecompile").remove();
                            rowEl.find(".btn-filedump").remove();
                        } else {
                            rowEl.find(".btn-filedump").click(file, this.fileDump.bind(this));
                            rowEl.find(".btn-filecompile").click(file, this.fileCompile.bind(this));
                            rowEl.find(".btn-fileedit").click(file, this.fileEdit.bind(this));
                        }

                        rowEl.find(".btn-filerun").click(file, this.fileRun.bind(this));
                        rowEl.find(".btn-filedelete").click(file, this.fileDelete.bind(this));
                        
                        rowEl.find(".btn").popover({
                            delay: 1000,
                            animation: true,
                            trigger: 'hover',
                            placement: 'auto'
                        });
                        
                        tableEl.append(rowEl);
                        
                        totalSize += file.size;
                    }
                    
                    var rowEl = tEl.clone();
                    rowEl.removeClass("hidden");
                    rowEl.removeClass("filelist-template");
                    rowEl.addClass("filelist-dynamic");
                    rowEl.find(".filelist-name").html("<b>Total</b>");
                    rowEl.find(".filelist-size").text(parseInt(totalSize / 1024) + "KB");
                    rowEl.find(".filelist-actions").html("");
                    tableEl.append(rowEl);
                    
                    setTimeout(function() {$(window).trigger('resize');}, 500);

                }
            }
            
            // This code handles if we get ### START FILE DUMP ###
            else if (data && 'dataline' in data && this.isFileCaptureOn) {
                
                var line = data.dataline;
                console.log("file capture is on. line:", line);
                
                if (line.match(/^### END FILE DUMP ###/)) {
                    console.log("ending capture and doing callback.");
                    this.isFileCaptureInProgress = false;
                    this.isFileCaptureOn = false;
                    this.onFileEditCaptureDone(this.fileCaptureContent);
                    this.fileCaptureContent = null;
                }
                else if (this.isFileCaptureInProgress) {
                    console.log("file capture progress. appending line.");
                    this.fileCaptureContent += line;
                }
                else if (line.match(/^### START FILE DUMP ###/)) {
                    // starting capture
                    console.log("starting capture.");
                    this.isFileCaptureInProgress = true;
                    this.fileCaptureContent = "";
                } 
                
            }
        },
        /**
         * Publish a signal to the Lua Editor to open this file in a tab for editing.
         */
        isFileCaptureOn: false,
        fileEditNameCapturing: null,
        fileEdit: function(evt) {
            
            if (evt && 'currentTarget' in evt) $(evt.currentTarget).popover('hide');
            $('body .popover').remove(); // do heavy version of deleting popovers
            var filename = evt.data.name;
            
            this.isFileCaptureOn = true;
            this.fileEditNameCapturing = filename;
            
            var code = `file.open("` + filename + `", "r")
function dumpFile()
    local fileline = file.readline()
    print("### START FILE DUMP ###")
    while fileline do
      print(string.sub(fileline, 0, string.len(fileline) - 1))
      fileline = file.readline()
    end
    print("### END FILE DUMP ###")
end
dumpFile()
file.close()`;
            this.send(code);
        },
        /**
         * We get this callback from onRecv when it sees the ### END FILE DUMP ### string
         */
        onFileEditCaptureDone: function(content) {
            console.log("onFileEditCaptureDone. content:", content);
            
            // remove cr/lf if they exist
            content = content.replace(/\r\n/g, "\n");
            
            var obj = {
                name: this.fileEditNameCapturing,
                content: content
            }
            chilipeppr.publish("/com-chilipeppr-widget-luaeditor/loadScript", obj);
            this.fileEditNameCapturing = null;
        },
        /**
         * Send Lua command to dump out contents of file.
         */
        fileDump: function(evt) {
            
            console.log("fileDump. evt:", evt);
            
            if (evt) $(evt.currentTarget).popover('hide');
            $('body .popover').remove(); // do heavy version of deleting popovers
            
            var filename = null;
            
            if ('data' in evt) {
                filename = evt.data.name;
            } 
            
            this.send('file.open("' + filename + '", "r")');
            this.send('fileline = file.readline()');
            this.send('while fileline do');
            this.send('  print(string.sub(fileline, 0, string.len(fileline) - 1))');
            this.send('  fileline = file.readline()');
            this.send('end');
            this.send('file.close()');
            this.send('fileline = nil');

            // create a file read script as temp file. save that file.
            // then run it. that way the dump is after everything so
            // folks can cut/paste cleanly
            /*
            var tmpFile = "" +
            'file.open("' + filename + '", "r")\n' +
            'print(file.read())\n' +
            'file.close()\n'
            '';
            this.rawUploadAndRun(tmpFile, "tmp");
            */
            

        },
        /**
         * Send Lua command to compile file to .lc file.
         */
        fileCompile: function(evt) {
            
            console.log("fileCompile. evt:", evt);
            
            if (evt) $(evt.currentTarget).popover('hide');
            $('body .popover').remove(); // do heavy version of deleting popovers
            
            var filename = evt.data.name;
            
            this.send('node.compile("' + filename + '")');
            this.getFileList();
        },
        /**
         * Send Lua commands to delete a file.
         */
        fileDelete: function(evt) {
            console.log("fileDel. evt:", evt);
            if (evt) $(evt.currentTarget).popover('hide');
            $('body .popover').remove(); // do heavy version of deleting popovers
            var filename = evt.data.name;
            this.send('file.remove("' + filename + '")');
            this.getFileList();

        },
        /**
         * Send Lua command to run file.
         */
        fileRun: function(evt) {
            
            if (evt && 'currentTarget' in evt) $(evt.currentTarget).popover('hide');
            $('body .popover').remove(); // do heavy version of deleting popovers
            var filename = evt.data.name;
            this.send('dofile("' + filename + '")');

        },

        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            // Init Say Hello Button on Main Toolbar
            // We are inlining an anonymous method as the callback here
            // as opposed to a full callback method in the Hello Word 2
            // example further below. Notice we have to use "that" so 
            // that the this is set correctly inside the anonymous method
            $('#' + this.id + ' .btn-refresh').click(function() {
                console.log("doing refresh");
                // Make sure popover is immediately hidden
                $('#' + that.id + ' .btn-refresh').popover("hide");
                
                // Sometimes we get dangling popovers from this widget, so forcibly remove them all
                $('body .popover').remove();
                
                // Show a flash msg
                chilipeppr.publish(
                    "/com-chilipeppr-elem-flashmsg/flashmsg",
                    "Getting File List",
                    "Sending code to the NodeMCU device to list out files so we can refresh our index. If your device is not responsive, this will fail. Restart your device and try again. " + that.id,
                    1000
                );
                
                that.getFileList();
            });


        },
        initTabs: function() {
            $('#' + this.id + ' .nav-tabs a').click(function (e) {
                console.log("showing tab");
                e.preventDefault();
                $(this).tab('show');
            });
        },
        /**
         * onHelloBtnClick is an example of a button click event callback
         */
        onHelloBtnClick: function(evt) {
            console.log("saying hello 2 from btn in tab 1");
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Hello 2 Title",
                "Hello World 2 from Tab 1 from widget " + this.id,
                2000 /* show for 2 second */
            );
        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
            $(window).trigger('resize');

        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
            $(window).trigger('resize');
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load(
                "http://raw.githubusercontent.com/chilipeppr/widget-pubsubviewer/master/auto-generated-widget.html",
                // "http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", 
                function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    }
});