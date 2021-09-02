import { isInteger } from 'lodash';

export const convertVariableToString = (variableObject: {}): string => {
  return Object.keys(variableObject)[0];
};

export const generateRandomInteger = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateRandomNumber = (min: number, max: number): number => {
  const generateRandom = () => Math.random() * (max - min) + min;

  const number = parseFloat(generateRandom().toFixed(2));

  return !isInteger(number) ? number : generateRandomNumber(min, max);
};
