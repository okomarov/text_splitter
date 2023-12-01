function benchmark(fn: () => void, iterations: number = 1000) {
  const times: number[] = [];
  let sum = 0;

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    times.push(duration);
    sum += duration;
  }

  const mean = sum / iterations;
  const std = Math.sqrt(
    times.reduce((acc, time) => acc + Math.pow(time - mean, 2), 0) / iterations
  );

  return { mean, std, sum };
}

export { benchmark };
