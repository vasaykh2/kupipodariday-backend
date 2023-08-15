export const getCalculatedRaised = (
  raised: number,
  offerAmount: number,
): number => {
  const calcResult = raised + offerAmount;
  console.log(calcResult);
  const roundedResult = calcResult.toFixed(2);

  return Number(roundedResult);
};
