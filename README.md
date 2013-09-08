##Fluid Infusion WebRTC Component
Creating a more accessible video conferencing experience with Fluid Infusion

###Setup
Clone the fluid-WebRTC repository and update submodules:

	git clone git@github.com:iakshay/fluid-WebRTC.git
	cd fluid-WebRTC
	git submodule update --init --recursive
	
To use the component you must have WebRTC Signalling Server running, launch the server:
 
	cd server
	npm install
	node server

To see the component demo, open demos/index.html

###Usage
The fluid WebRTC Component has the following dependencies (client)

- socket.io [Github][0]
- simplewebrtc.js [Github][1]
- screenfull.js [Github][2]

[0]: https://github.com/LearnBoost/socket.io
[1]: https://github.com/HenrikJoreteg/SimpleWebRTC
[2]: https://github.com/sindresorhus/screenfull.js

**Example**

	fluid.webrtc('#wrapper', {
	        signalingServer: 'http://localhost:8888',
	        room: 'foo',
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
*Note -* You will need to run the demo on a server, since getUserMedia won't work with File URL's 