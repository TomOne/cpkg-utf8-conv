# cpkg-utf8-conv
Recursively converts *.nuspec files to UTF-8 and *.ps1 file to UTF-8 with BOM.

## Prerequisites
* Node.js with npm on Linux, Mac OS X or Windows
* Download these files an `cd` into folder with the `package.json`.
* `$ npm install` will automatically download the dependencies

## Usage
```bash
$ node cpkg-utf8-conv.js ["Path/to/target/folder"]
```

["Path/to/target/folder"] is optional and can be absolute or relative.
