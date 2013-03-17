MINI = es2pi.min.js

all: test mini

mini: $(MINI)
	uglifyjs es2pi.js > es2pi.min.js

test:
	mocha && mocha --harmony
