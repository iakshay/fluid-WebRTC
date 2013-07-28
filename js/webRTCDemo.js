/*globals $, fluid */
$(function () {
    'use strict';
    fluid.webrtc('#wrapper', {
        signalingServer: 'http://localhost:8888',
        room: 'foo'
    });
});
