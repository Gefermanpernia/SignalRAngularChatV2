export function generateTemporalChatId(length:number){
  const posibleChars='ABCDEFGHIJKLMNOPQRSTUVRXYZ';


  let stringResult ="C-";
  for(let i =0; i< length ;i++){
    stringResult+= posibleChars[Math.floor((Math.random() * posibleChars.length-1) + 0)];

  }

  return stringResult;

}
