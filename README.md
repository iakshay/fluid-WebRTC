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

*Note -* You will need to run the demo on a server, since getUserMedia won't work with File URL's 