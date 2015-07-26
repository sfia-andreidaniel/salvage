SHELL := /bin/bash

build::
	tsc js/main.ts --target es5 --out salvage.js
