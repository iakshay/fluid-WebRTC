/*globals $, fluid */
$(function () {
    'use strict';
    fluid.webrtc('#wrapper', {
        signalingServer: 'http://localhost:8888',
        //room: 'foo'
        listeners: {
            onConnect: function(room) {
                console.log('Connected to ', room);
            },
            onVideoAdded:function(id) {
                console.log('Video Added ID - ', id);
            },
            onVideoRemove:function(id) {
                console.log('Video Removed ID - ', id);
            }
        }
    });

        $('.flc-webrtc-video-mute').on('click', function(){
            console.log('mute');
            $(this).siblings('video').get(0).muted = true;
        });

        $('.flc-webrtc-video-fullscreen').on('click', function(){
            console.log('fullscreen');
            //$(this).siblings('video').get(0).webkitEnterFullscreen();
        });
});
