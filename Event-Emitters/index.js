const EventEmitter = require('events');


class Emitter extends EventEmitter{
}


const myEmitter = new Emitter();

myEmitter.on('foo', (x)=>{
    console.log('event occurred' + x)
})

myEmitter.on('bar', ()=>{
    console.log('Bar triggered')
})

myEmitter.emit('foo', 'check')

myEmitter.emit('bar')

