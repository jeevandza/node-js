//Read file synchronous
// const  fs = require('fs');

// const content = fs.readFileSync('./text.txt');

// console.log(content.toString('utf-8'))

//** */ Promises **//

// const fs = require('fs/promises');

// (async()=>{
//     try{
//         await fs.copyFile('text.txt', 'copied-text.txt');
//     }catch(err){
//         console.log(err)
//     }
// })()

//**Call back**//
// const fs = require('fs')
// fs.copyFile('text.txt', 'copied-text.txt', (error)=>{
//     if(error) console.log(error)
// })

//**synchronous reading a file**//

// const synchFs = require('fs');

// synchFs.copyFileSync('text.txt', 'copied-text.txt')

/**
 * working with node js file system promises ***************
 */

//Steps
//Open(32) file descriptor- this i called just a number is assigned to a file which is opened
//Read or write

const fs = require("fs/promises");

// (async () => {
//   const textFileHandler = await fs.open("text.txt", "r"); //R refers to read and W refers to write when open is called node js is just assigning a number to specified file
//   const watcher = fs.watch("./");

//   for await (const event of watcher) {
//     if (event.eventType === "change") {
//       // we want to read the content
//       //get the size of the file
//       const sizeOfFile = (await textFileHandler.stat()).size;
//       //Get the size of buffer
//       const buff = Buffer.alloc(sizeOfFile);
//       //Location at which we want to start filling our buffer
//       const offset = 0;
//       //How many bytes we want to read
//       const length = buff.byteLength;
//       //The position which we want to read a file from
//       const position = 0;

//       //we want to read whole file content from start to end
//       const content = await textFileHandler.read(
//         buff,
//         offset,
//         length,
//         position
//       );
//       console.log(content);
//     }
//   }
//   textFileHandler.close();
// })();

//** Using Event emitter */

(async () => {
  //Commands

  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add to the file";

  //Create a file functions
  const createFile = async (path) => {
    try {
      //Check if file exists
      const fileHandleExists = await fs.open(path, "r");
      //throw error
      fileHandleExists.close();
      return console.log(`The file ${path} already exists`);
    } catch (err) {
      //Error if file not exists and create new file
      const newFileHandle = await fs.open(path, "w");
      console.log(" new file created");
      newFileHandle.close();
    }
  };

  //Delete a file
  const deleteFile = async (path) => {
    try {
      await fs.unlink(path);
      console.log("File removed ");
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log("No such file at this path to remove");
      } else {
        console.log(`Error occurred err ${e}`);
      }
    }
  };

  //Rename a file
  const renameFile = async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      console.log("File Renamed");
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log("No such file at this path to rename");
      } else {
        console.log(`Error occurred err ${e}`);
      }
    }

    // console.log(`Old path${oldPath} and new path ${newPath}`);
  };

  //To prevent adding same content to file
  let addedContent;
  //Add content to a created file
  const addToFile = async (path, content) => {
    if(addedContent === content) return 
    console.log(content, 'content')
    try {
      const fileHandler = await fs.open(path, "a");
      fileHandler.write(content);
      addedContent = content
      console.log("file updated ");
    } catch (e) {
      console.log(`Error ${e}`);
    }
  };

  const textFileHandler = await fs.open("text.txt", "r");

  textFileHandler.on("change", async () => {
    const sizeOfFile = (await textFileHandler.stat()).size;
    const buff = Buffer.alloc(sizeOfFile);
    const offset = 0;
    const length = buff.byteLength;
    const position = 0;

    await textFileHandler.read(buff, offset, length, position);

    //decoder 01 = meaningful
    //encoder meaningful = 01
    const command = buff.toString("utf8");

    //Create a file
    //Create a file and give path<path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }
    //Delete a file <Path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }
    //Rename a file
    // old path to new path
    if (command.includes(RENAME_FILE)) {
      const idx = command.indexOf(" to ");
      const oldPath = command.substring(RENAME_FILE.length + 1, idx);
      const newFilePath = command.substring(idx + 4);
      renameFile(oldPath, newFilePath);
    }
    //Add to file
    //add to content to file <path> this content: content
    if (command.includes(ADD_TO_FILE)) {
      const idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, idx);
      const content = command.substring(idx + 15);
      addToFile(filePath, content);
    }
  });
  const watcher = fs.watch("./");

  // watcher for file changes
  for await (const event of watcher) {
    if (event.eventType === "change") {
      textFileHandler.emit("change");
    }
  }
  textFileHandler.close();
})();
