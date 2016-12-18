
.PHONY: build

TARGET=distraction-blocker.zip

clean:
	rm -rf build $(TARGET) web-ext-artifacts

build-old: clean
	mkdir build
	cp -r -t build *.js *.html manifest.json icons/
	cd build; zip -r $(TARGET) ./*; mv $(TARGET) ..

build: clean
	web-ext lint
	web-ext build
