import React from 'react';
import useMobxStore from './module/slice';
class RootStore {
  useMobxStore: useMobxStore;
  constructor() {
    // 对引入进行来的子模块进行实例化操作，并挂载到RootStore上
    this.useMobxStore = new useMobxStore();
  }
}

// 实例化操作
export const rootStore = new RootStore();
export const RootStoreContext = React.createContext<RootStore>(rootStore);

export const useRootStore = () => React.useContext(RootStoreContext);
export default useRootStore;
