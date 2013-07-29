/*globals $, jQuery, WebRTC, console */
var fluid_1_5 = fluid_1_5 || {};
(function ($, fluid) {
    'use strict';
    //fluid.setLogging(true);
    fluid.registerNamespace('fluid.webrtc');

    var room;
    fluid.defaults("fluid.webrtc", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        signalingServer: 'http://signaling.simplewebrtc.com:8888',
        strings:{
            joinRoom: "Enter Room Name:",
            joiningRoom: "Joining Room - "
        },
        selectors: {
            status: ".flc-webrtc-status",
            room: ".flc-webrtc-room",
            roomName: ".flc-webrtc-room-name",
            roomSubmit: ".flc-webrtc-room-submit",
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
            roomName: "foo",
            local: {
                fullscreen: false,
                mute: false
            }
        },
        events: {
            onConnect: null,
            onVideoAdded: null,
            onVideoRemoved: null,
            onVideoClick: null
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
                that.locate('roomSubmit').focus().click();
                return false;
            }
        });

        that.locate('roomSubmit').click(function(){
            room = that.locate('roomName').val();
            that.webrtc.joinRoom(room);
            that.locate('room').hide();
            that.events.onConnect.fire(room);
            that.locate('status').html(that.options.strings.joiningRoom + room);
            return false;
        });
        
        that.locate('tilesContainer').on('click', 'video', function(){
            that.events.onVideoClick.fire(this);
        });

        that.locate('tilesContainer').on('click', '.flc-webrtc-video-mute', function(){
            console.log('mute');
            $(this).siblings('video').get(0).muted ^= true;
        });

        that.locate('tilesContainer').on('click', '.flc-webrtc-video-fullscreen', function(){
            console.log('fullscreen');
            if (screenfull.enabled) {
                var video = $(this).siblings('video').get(0);
                screenfull.toggle(video);
            }
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
        $localVideo.find('.flc-webrtc-video-mute').remove();
        $localVideo.addClass('flc-webrtc-local');
        $localVideo.prepend('<video muted></video>');
        that.webrtc = new WebRTC({
            url: that.options.signalingServer,
            localVideoEl: $localVideo.find('video').get(0),
            //remoteVideosEl: that.locate('remoteVideo')[0],
            autoRequestMedia: true,
            log: false
        });

        that.webrtc.on('readyToCall', function () {
            if (room) {
                that.webrtc.joinRoom(room);
                $status.html(that.options.strings.joiningRoom + room);
                that.events.onConnect.fire(room);
            }
        });

        that.webrtc.on('videoAdded', function (el) {
            //console.log('New Video Added', el.id, el.src);
            that.addVideoTile(el);
            that.events.onVideoAdded.fire(el.id);
        });

        that.webrtc.on('videoRemoved', function (el) {
            //console.log('Video Removed', el.id, el.src);
            that.removeVideoTile(el);
            that.events.onVideoRemoved.fire(el.id);
        });
    }

    fluid.webrtc.finalInit = function (that) {
        var $status = that.locate('status'),
            $tilesContainer = that.locate('tilesContainer');
        room = that.options.room;

        if (room) {
            that.locate('roomName').hide();
            $status.html(that.options.strings.joiningRoom + room);
        }
        
        fluid.fetchResources(that.options.resources, function (data) {
            //$tilesContainer.append(that.options.resources.template.resourceText);
            //that.refreshView();
            that.addVideoTile = function(el){
                var $videoControls = $(that.options.resources.template.resourceText);
                $videoControls.prepend(el);
                $tilesContainer.append($videoControls);
                return $videoControls;
            };

            that.removeVideoTile = function(el){
                $('#' + el.id).parent().remove();
            };
            
            createWebRTC(that);
        });
        bindDOMEvents(that);
        
    };
}(jQuery, fluid_1_5));