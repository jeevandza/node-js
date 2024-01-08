// const fs = require("node:fs/promises");

//5.4sec benchmark
// (async () => {
//   console.time("writeMany");
//   const fileHandler = await fs.open("test.txt", "w");

//   for (let i = 0; i < 1000000; i++) {
//     fileHandler.write(`${i}`);
//   }
//   console.timeEnd("writeMany");
// })();

/**
 * 1.4 sec
 */
// const fs = require("node:fs");

// (async () => {
//   console.time("writeMany");
//   fs.open("test.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1000000; i++) {
//       const buff = Buffer.from(`${i}`, "utf-8")
//       fs.writeSync(fd,buff);
//     }
//   });

//   console.timeEnd("writeMany");
// })();

//Don't use this pattern
//260 ms very fast
//120 memory usage
// const fs = require("node:fs/promises");

// (async () => {
//   console.time("writeMany");
//   const fileHandler = await fs.open("test.txt", "w");

//   const writeStream = fileHandler.createWriteStream()

//   for (let i = 0; i < 1000000; i++) {
//     const buff = Buffer.from(` ${i} `, "utf-8")
//     writeStream.write(buff)
//   }
//   console.timeEnd("writeMany");
// })();

/**
 * 16384 buffer size
 */
/**
 * 8 bits = 1 byte
 * 1000 bytes = 1kb
 * 1000kb = 1 mb
 *
 */
const fs = require("node:fs/promises");

(async () => {
  console.time("writeMany");
  const fileHandler = await fs.open("test.txt", "w");

  const writeStream = fileHandler.createWriteStream();

  const buff = Buffer.alloc(16383, 10);

  // writeStream.write(buff)

  // console.log(writeStream.writableHighWaterMark);
  // console.log(buff)

  // console.log( writeStream.write(buff))
  // console.log(writeStream.write(Buffer.alloc(1,'a')));
  // console.log(writeStream.writableLength)

  // writeStream.on('drain',()=>{
  //   console.log(writeStream.write(Buffer.alloc(16383,'a')));

  //   console.log(writeStream.writableLength)
  //   console.log('we are safe to write more')
  // })

  let i = 0;
  const numberOfWrites = 10000000
  const writeMany = () => {
    while (i < numberOfWrites) {
      const buff = Buffer.from(` ${i} `, "utf-8");
      // resume loop if buffer is empty
      if (i === numberOfWrites - 1) {
        return writeStream.end(buff);
      }
      //stream write returns false break loop
      if (!writeStream.write(buff)) break;
      writeStream.write(buff);
      i++;
    }
  };

  writeMany();

  writeStream.on("drain", () => {
    // console.log('Draining!!')
    writeMany();
  });

  writeStream.on("finish", () => {
    console.timeEnd("writeMany");
    fileHandler.close();
  });

})();
