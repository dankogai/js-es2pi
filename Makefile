MINI = es2pi.min.js

all: mini

mini: $(MINI)
	uglifyjs es2pi.js > es2pi.min.js
