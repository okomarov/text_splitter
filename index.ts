import { benchmark } from "./benchmark";
import { Options, parseArgv } from "./cli";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const defaultOptions = {
  chunkSize: 1000,
  chunkOverlap: 200,
};

const re = new RegExp(/\s/);
function hasWhiteSpace(s: string) {
  return re.test(s);
}

function splitText(text: string, options?: Partial<Options>) {
  const opts = Object.assign({}, defaultOptions, options);
  const chunks = [];
  let charCount = 0;
  let spaceCount = 0;
  let start = 1;
  let curr = text[0];
  let prev = text[0];

  // Think of stateChange transitions -1 char -> space, 0 no transition, +1 space -> char
  for (let i = 1; i < text.length; i++) {
    curr = text[i - 1];

    if (hasWhiteSpace(curr)) {
      if (hasWhiteSpace(prev)) {
        spaceCount++;
      } else {
        spaceCount = 1;
      }
    } else {
      if (hasWhiteSpace(prev)) {
        charCount = 1;
      } else {
        charCount++;
      }
    }

    // console.log(`${curr} ${i} ${start} ${spaceCount} ${charCount}`);
    if (i - start === opts.chunkSize) {
      if (hasWhiteSpace(curr)) {
        chunks.push(text.slice(start - 1, i - spaceCount));
        while (hasWhiteSpace(text[i - 1])) {
          i++;
        }
        spaceCount = 0;
        start = i;
      } else {
        chunks.push(text.slice(start - 1, i - spaceCount - charCount));
        start = i - charCount + 1;
        charCount = 1;
        i = start;
      }
      // console.log({ chunk: chunks[chunks.length - 1] });
      // console.log(`${text[i - 1]} ${i} ${start} ${spaceCount} ${charCount}`);
    }
    prev = curr;
  }

  return chunks;
}

const { text, options } = parseArgv();

console.log(splitText(text, options));
console.log(benchmark(() => splitText(text, options)));

const lgSplitter = new RecursiveCharacterTextSplitter(options);
console.log(await lgSplitter.splitText(text));
console.log(benchmark(() => lgSplitter.splitText(text)));
