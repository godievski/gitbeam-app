export const getFontSizeLineNumber = (fontSize: number)=>{
  return fontSize * 0.85;
}

export const getLineHeight = (fontSize: number)=> {
  return Math.ceil(fontSize * 1.55);
}


export const getTotalHeight = (lineHeight: number, numOfLines: number)=> {
  return lineHeight * numOfLines;
}