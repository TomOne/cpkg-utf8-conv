/*jslint node: true, regexp: true, nomen: true*/

var iconv = require('iconv-lite'),
    chardet = require('chardet'),
    glob = require('glob'),
    fs = require('fs'),
    colors = require('colors'),
    i;

colors.setTheme({
    info: 'green',
    data: 'grey',
    warn: 'yellow',
    error: 'red'
});

var pathArgument = process.argv[2];
if (pathArgument) {
    pathArgument = pathArgument.replace(/\\/g, '/').replace(/^[cC]:/, '').replace(/([^\/]$)/, '$1/');
} else {
    pathArgument = '';
}

function processFiles(fileType) {
    'use strict';
    // Get path command line argument, normalize paths and convert Windows paths to Unix paths
    
    var targetPath = pathArgument + '**/*.' + fileType,
        filesArray = glob.sync(targetPath),
        fileBuffer,
        charset,
        fileContent,
        xmlDeclRegex;
    
    
    if (filesArray.length === 0) {
        console.log(('No ' + fileType + ' files found in: ' + __dirname).warn);
    }
    
    for (i = 0; i < filesArray.length; i += 1) {
    
        // decode fileBuffer to Unicode string
        fileBuffer = fs.readFileSync(filesArray[i]);
        charset = chardet.detect(fileBuffer);
        fileContent = iconv.decode(fileBuffer, charset);
        
        // remove UTF-8 BOM if present
        fileContent = fileContent.replace('\ufeff', '');
        
        // replace with proper XML declaration
        xmlDeclRegex = /<\?xml [^>]*\?>/i;
        fileContent = fileContent.replace(xmlDeclRegex, '<?xml version="1.0" encoding="utf-8"?>');
        
        if (fileType === 'ps1') {
            fileContent = fileContent.replace(/^/, '\ufeff');
        }
        
        
        fs.writeFileSync(filesArray[i], fileContent, 'utf8');
        console.log(('Processed “' + filesArray[i] + '”').info);
        
        // check if Unicode replacement character “�” is present.
        if (fileContent.indexOf('�') !== -1) {
            console.log(('Warning: � present in “' + filesArray[i] + '”. Please manually replace it with the right character.').warn);
        }
    }
}

processFiles('nuspec');
processFiles('ps1');