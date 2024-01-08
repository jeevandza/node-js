const fs = require('node:fs/promises');

//64*1024 kb max default chunks it can read at a time, can be altered to any lower value
(async()=>{
    const fileHandlerRead = await fs.open('test.txt', 'r');
    const fileHandleWrite = await fs.open('dest.txt', 'w');


    const streamRead = fileHandlerRead.createReadStream({
        highWaterMark:64*1024
    });

    const streamWrite = fileHandleWrite.createWriteStream()

    streamRead.on('data',(chunk)=>{
        streamWrite.write(chunk)
        // console.log(chunk.length, 'chunk')
    })
})()