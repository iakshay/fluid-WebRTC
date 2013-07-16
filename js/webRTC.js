/*globals $, jQuery, WebRTC, console */
var fluid_1_5 = fluid_1_5 || {};
(function ($, fluid) {
    'use strict';
    fluid.setLogging(true);
    fluid.registerNamespace('fluid.webrtc');

    var room;
    fluid.defaults("fluid.webrtc", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        signalingServer: 'http://signaling.simplewebrtc.com:8888',
        selectors: {
            room: ".flc-webrtc-room",
            status: ".flc-webrtc-status",
            roomName: ".flc-webrtc-room-name",
            enlargedContainer: ".flc-webrtc-enlarged",
            tilesContainer: ".flc-webrtc-tiles-container",
            localVideo: ".flc-webrtc-local-video",
            remoteVideo: ".flc-webrtc-remote-video"
        },
        events: {
            onConnect: null,
            onVideoAdded: null,
            onVideoRemove: null
        },
        finalInitFunction: "fluid.webrtc.finalInit",
        renderOnInit: true
    });

    /**
     * Bind DOM Events
     */

    var bindDOMEvents = function (that) {
        that.locate("roomName").keypress(function (e) {
            if (e.which === 13) {
                console.log('Join Room');
                room = that.locate('roomName').val();
                that.webrtc.joinRoom(room);
            }
        });

        $('.flc-webrtc-video-mute').on('click', function(){
            console.log('mute');
            $(this).siblings('video').get(0).muted = true;
        });

        $('.flc-webrtc-video-fullscreen').on('click', function(){
            $(this).siblings('video').get(0).webkitEnterFullscreen();
        })
    };

    fluid.webrtc.finalInit = function (that) {
        room = that.options.room;
        var $status = that.locate('status'),
            $tilesContainer = that.locate('tilesContainer');

        if (room) {
            $status.html('Joining room - ' + room);
        } else {
            that.locate('roomName').show();
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
            //remoteVideosEl: that.locate('remoteVideo')[0],
            // immediately ask for camera access
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

        that.test = function () {
            console.log('Yo!');
        };
        bindDOMEvents(that);
    };
}(jQuery, fluid_1_5));
