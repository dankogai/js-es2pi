SOURCE = es2pi.js
TARGET = es2pi.min.js

all: mini

mini: $(SOURCE)
	uglifyjs $(SOURCE) > $(TARGET)

