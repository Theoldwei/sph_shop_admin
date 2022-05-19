import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// 这里用来定义不需要token访问的页面
const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  // 如果有token
  if (hasToken) {
    if (to.path === "/login") {
      // 你访问的是登入页面则直接跳转到首页
      next({ path: "/" });
      NProgress.done();
    } else {
      // 从vuex中获取用户名（用户信息在vuex中不是持久化存储，页面刷新就会使vuex里面的state清空）
      const hasGetUserInfo = store.getters.name;
      // 判断是否有用户信息
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // 没有用户信息的话则调用dispatch函数发送请求
          await store.dispatch("user/getInfo");
          next();
        } catch (error) {
          // 失败则清空token及所有用户信息
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
