all: test mini

MINI = es2pi.min.js

mini: $(MINI)
	uglifyjs es2pi.js > es2pi.min.js

test: es2pi.js
	mocha && mocha --harmony
