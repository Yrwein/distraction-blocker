
.PHONY: build

TARGET=distraction-blocker.zip

build:
	rm -rf build $(TARGET)
	mkdir build
	cp -r -t build *.js *.html manifest.json icons/
	cd build; zip -r $(TARGET) ./*; mv $(TARGET) ..
