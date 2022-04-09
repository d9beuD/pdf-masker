let count = 0;

const getUID = (): number => {
  return (count += 1);
};

export default getUID;
