import { Readable } from 'stream';

class MyReadableStream extends Readable {
  constructor(options) {
    super(options);
    this.index = 0;
  }
  _read() {
    if (this.index > 10) {
      this.push(null);
    } else {
      this.push(`${this.index++}`);
    }
  }
}
const myStream = new MyReadableStream();
myStream.on('data', (chunk) => {
  console.log(chunk.toString());
});
myStream.on('end', () => {
  console.log('Data stream ended.');
});


export {
  myStream 
}