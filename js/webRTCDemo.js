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
            onVideoAdded: function(id) {
                console.log('Video Added ID - ', id);
            },
            onVideoRemoved: function(id) {
                console.log('Video Removed ID - ', id);
            },
            onVideoClick: function(el){
                console.log('Video - ', el);
            }
        }
    });
});