type Options = {
  chunkSize: number;
  chunkOverlap: number;
};

function parseArgv() {
  const args = Bun.argv;
  let text: string | undefined = undefined;
  const options: Partial<Options> = {};

  for (let i = 2; i < args.length; i++) {
    switch (args[i]) {
      case "--chunk":
        const chunkSize = parseInt(args[++i], 10);
        if (isNaN(chunkSize))
          throw new Error(`Invalid chunk size "${args[i]}"`);
        options.chunkSize = chunkSize;
        break;

      case "--overlap":
        const chunkOverlap = parseInt(args[++i], 10);
        if (isNaN(chunkOverlap))
          throw new Error(`Invalid chunk overlap "${args[i]}"`);
        options.chunkOverlap = chunkOverlap;
        break;

      default:
        if (args[i].startsWith("-")) {
          console.warn(`Ignoring unsupported option "${args[i]}".`);
        } else {
          text = args[i];
        }
    }
  }

  if (!text) {
    throw new Error("Missing text input.");
  }

  return { text, options };
}

export { parseArgv, Options };
