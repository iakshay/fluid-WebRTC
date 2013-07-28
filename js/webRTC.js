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
            remoteVideo: ".flc-webrtc-remote-video",
            muteBtn: ".flc-webrtc-video-mute",
            fullscreenBtn: ".flc-webrtc-video-fullscreen"
        },
        selectorsToIgnore: [
          'status', 'roomName', 'tilesContainer', 'muteBtn', 'fullScreenBtn'
        ],
        repeatingSelectors: ['muteBtn', 'fullscreenBtn'],
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
                url: "../html/video-controls.html"
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
        that.locate("roomName").keypress(function (e) {
            if (e.which === 13) {
                console.log('join room');
                room = that.locate('roomName').val();
                that.webrtc.joinroom(room);
            }
        });

        that.locate('muteBtn').on('click', function(){
            console.log('mute');
            $(this).siblings('video').get(0).muted = true;
        });

        that.locate('fullScreenBtn').on('click', function(){
            console.log('fullscreen');
            //$(this).siblings('video').get(0).webkitEnterFullscreen();
        });
    };
    
    fluid.webrtc.produceTree = function (that) {
      return {
        status: 'foo',
        roomName: '${roomName}'
      };

    };

    function createWebRTC(that){
        var $localVideo = that.addVideoTile(),
        $status = that.locate('status');
        $localVideo.addClass('flc-webrtc-local');
        that.webrtc = new WebRTC({
            url: that.options.signalingServer,
            localVideoEl: $localVideo.get(0),
            //remoteVideosEl: that.locate('remoteVideo')[0],
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
            that.addVideoTile(el);
            that.events.onVideoAdded.fire();
        });

        that.webrtc.on('videoRemoved', function (el) {
            console.log('Video Removed', el.id, el.src);
            that.removeVideoTile(el);
            that.events.onVideoRemove.fire();
        });
    }

    fluid.webrtc.finalInit = function (that) {
        var $status = that.locate('status'),
            $tilesContainer = that.locate('tilesContainer');
        room = that.options.room;

        if (room) {
            that.locate('roomName').hide();
            $status.html('joining room - ' + room);
        }
        
        fluid.fetchResources(that.options.resources, function (data) {
            console.log('Template fetched!');
            //$tilesContainer.append(that.options.resources.template.resourceText);
            //that.refreshView();
            that.addVideoTile = function(el){
                var $videoControls = $(that.options.resources.template.resourceText);
                $videoControls.prepend(el);
                $tilesContainer.append($videoControls);
                that.dom.clear();
                bindDOMEvents(that);
                //console.log(that.dom);
                return $videoControls;
            };

            that.removeVideoTile = function(el){
                $('#' + el.id).parent().remove();
            };
            
            createWebRTC(that);
        });
        that.refresh = function(){
            that.refreshView();
        };
        bindDOMEvents(that);
        
    };
}(jQuery, fluid_1_5));
