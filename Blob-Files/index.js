

//2 bytes = 1 byte = 8 bits = 0-255

(async () => {
  let ab = new ArrayBuffer(2);
  let dataView = new DataView(ab);

  dataView.setInt8(0, 104);
  dataView.setInt8(1, 105);

  console.log(new Uint8Array(ab).toString());


  let b = new Blob([ab]);
  console.log(b)

  let file = new File([ab], 'text-sample', {type:'text/plain'});

  console.log(file)

  let url = URL.createObjectURL(file);

  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.textContent = `Download ${file.name}`;

  document.getElementById('main').append(a)
})();
