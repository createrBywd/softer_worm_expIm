import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
interface User<T> {
  email: string;
  password: string;
  token?: string;
}
class useMobxStore {
  content: Object = {}; // 初始化状态数据
  userInfo: User<any> = {
    email: '',
    password: '',
  };

  msgLen: number = 0;
  routeName: string = '';
  regesiter: Object = { email: '', code: '', password: '' };
  onlineRoom: Object = {};
  allMsgList: object[] = [];
  token: string = '';
  constructor() {
    // 对初始化数据进行响应式处理
    makeAutoObservable(this);
    // makePersistable(this, {
    //   name: 'mobxPersist', // 存储到localStorage当中的key值是什么，此处为字符串string；
    //   properties: ['content', 'userInfo'], // 存储到localStorage当中的key值是什么，此处为字符串string；
    //   storage: window.localStorage, // 你的数据需要用那种方式存储，常见的就是localStorage
    // }) //持久化存储
  }

  setMyInfo = (Info: any) => {
    this.userInfo = Info;
  };

  setMapInfo = async (map: any) => {
    runInAction(() => {
      this.onlineRoom = map;
    });
  };

  setRouteName = (name: string) => {
    this.routeName = name;
  };

  setMsgLen = (len: number) => {
    this.msgLen = len;
  };

  setRegesiter = (Info: any) => {
    this.regesiter = Info;
  };

  // 计算属性
  get overFourReturn() {
    return this.content;
  }

  get nameObj() {
    const { name: sendName }: any = this.userInfo;
    const { name: receiveName }: any = this.content;
    return { sendName, receiveName };
  }
}
export default useMobxStore;
