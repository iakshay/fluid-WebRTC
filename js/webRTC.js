/*globals $, jQuery, WebRTC, console */
var fluid_1_5 = fluid_1_5 || {};
(function ($, fluid) {
    'use strict';
    fluid.setLogging(true);
    fluid.registerNamespace('fluid.webrtc');

    var room;
    fluid.defaults("fluid.webrtc", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        signalingServer: 'http://signaling.simplewebrtc.com:8888',
        strings:{
            joinRoom: "Enter Room Name:"
        },
        selectors: {
            status: ".flc-webrtc-status",
            roomName: ".flc-webrtc-room-name",
            enlargedContainer: ".flc-webrtc-enlarged",
            tilesContainer: ".flc-webrtc-tiles-container",
            localVideo: ".flc-webrtc-local",
            remoteVideo: ".flc-webrtc-remote-video"
        },
        selectorsToIgnore: [
          'status', 'roomName', 'tilesContainer'
        ],
        model:{
            room:"foo"
        },
        events: {
            onConnect: null,
            onVideoAdded: null,
            onVideoRemove: null
        },
        resources: {
            template: {
                forceCache: true,
                url: "../html/webrtc.html"
            }
        },
        produceTree: "fluid.webrtc.produceTree",
        finalInitfunction: "fluid.webrtc.finalInit",
        //renderOnInit: true
    });

    /**
     * bind dom events
     */

    var bindDOMEvents = function (that) {
        that.locate("roomname").keypress(function (e) {
            if (e.which === 13) {
                console.log('join room');
                room = that.locate('roomname').val();
                that.webrtc.joinroom(room);
            }
        });

        $('.flc-webrtc-video-mute').on('click', function(){
            console.log('mute');
            $(this).siblings('video').get(0).muted = true;
        });

        $('.flc-webrtc-video-fullscreen').on('click', function(){
            $(this).siblings('video').get(0).webkitenterfullscreen();
        })
    };
    fluid.webrtc.produceTree = function (that) {
      return {
        status: 'foo',
        roomName: 'room'
      };

    };

    fluid.webrtc.finalInit = function (that) {
        /*fluid.fetchResources(that.options.resources, function (data) {
            console.log(that.options.resources.template.resourceText, data);
            that.container.append(that.options.resources.template.resourceText);
            that.refreshView();
        });
        */
        room = that.options.room;
        var $status = that.locate('status'),
            $tilescontainer = that.locate('tilescontainer');

        if (room) {
            that.locate('roomName').hide();
            $status.html('joining room - ' + room);
        } 

        var addVideoTile = function(el){
            var videoControls = $('<div class="flc-webrtc-video-controls flc-webrtc-remote"><span class="flc-webrtc-video-mute">Mute</span><span class="flc-webrtc-video-fullscreen">Fullscreen</span></div>');
            videoControls.prepend(el);
            that.locate('tilesContainer').append(videoControls);
        };

        var removeVideoTile = function(el){
            $('#' + el.id).parent().remove();
        };

        that.webrtc = new WebRTC({
            url: that.options.signalingServer,
            localVideoEl: that.locate('localVideo')[0],
            remoteVideosEl: that.locate('remoteVideo')[0],
            autoRequestMedia: true,
            log: false
        });

        that.webrtc.on('readyToCall', function () {
            console.log('Ready to go');

            if (room) {
                that.webrtc.joinRoom(room);
                $status.html('Joined room ' + room);
            }
            that.events.onConnect.fire();
        });

        that.webrtc.on('videoAdded', function (el) {
            console.log('New Video Added', el.id, el.src);
            addVideoTile(el);
            that.events.onVideoAdded.fire();
        });

        that.webrtc.on('videoRemoved', function (el) {
            console.log('Video Removed', el.id, el.src);
            removeVideoTile(el);
            that.events.onVideoRemove.fire();
        });

        bindDOMEvents(that);
        
    };
}(jQuery, fluid_1_5));
