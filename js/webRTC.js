/*globals $, jQuery, WebRTC, console */
var fluid_1_5 = fluid_1_5 || {};
(function ($, fluid) {
    'use strict';
    fluid.setLogging(true);
    fluid.registerNamespace('fluid.webrtc');

    fluid.defaults("fluid.webrtc", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        signalingServer: 'http://signaling.simplewebrtc.com:8888',
        selectors: {
            room: ".flc-webrtc-join-room",
            roomName: ".flc-webrtc-room-name",
            joinButton: ".flc-webrtc-join-room input[type=submit]",
            videos: ".flc-webrtc-videos",
            localVideo: ".flc-webrtc-local-video",
            remoteVideo: ".flc-webrtc-remote-video"
        },
        finalInitFunction: "fluid.webrtc.finalInit",
        renderOnInit: true
    });

    /**
     * Bind DOM Events
     */
    var bindDOMEvents = function (that) {
        that.locate("joinButton").click(function () {
            var room = that.locate('roomName').val();
            that.webrtc.joinRoom(room);
        });
    };

    fluid.webrtc.finalInit = function (that) {
        that.webrtc = new WebRTC({
            url: that.options.signalingServer,
            localVideoEl: that.locate('localVideo')[0],
            remoteVideosEl: that.locate('remoteVideo')[0],
            // immediately ask for camera access
            autoRequestMedia: true,
            log: true
        });
        that.test = function () {
            console.log('Yo!');
        };
        bindDOMEvents(that);
    };
}(jQuery, fluid_1_5));