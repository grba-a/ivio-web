import sharp from 'sharp';
const OUT='/Users/grbaa/Desktop/Ivio/ivio-web/.slices';
async function slice(file, tag, outW, sliceH){
  const {width,height} = await sharp(file).metadata();
  const n = Math.ceil(height/sliceH);
  for(let i=0;i<n;i++){
    const top=i*sliceH, h=Math.min(sliceH,height-top);
    await sharp(file).extract({left:0,top,width,height:h}).resize({width:outW}).jpeg({quality:72}).toFile(`${OUT}/${tag}-${String(i).padStart(2,'0')}.jpg`);
  }
  console.log(tag,width,height,'->',n);
}
await slice('verify/mobile-full.png','m', 390, 2600);
await slice('verify/desktop-full.png','d', 1100, 2400);
