import Web3 from 'web3';

const contract = (() => {
  let instance;
  let provider = new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${process.env.VUE_APP_INFURA_API_KEY}`);

  const connect = (_abi, _address) => {
    const web3 = new Web3(provider, null, {});
    return new web3.eth.Contract(_abi, _address);
  };

  return {
    connect: (_abi, _address) => {
      if (!instance) {
        instance = connect(_abi, _address);
      }
      return instance;
    },
    changeProvider: (_provider, _abi, _address) => {
      provider = _provider;
      instance = connect(_abi, _address);
      return instance;
    },
  };
})();

export default contract;
