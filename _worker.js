// 导入现有的 API 模块
import { handleRequest as handleIP } from './api/ip.js';
// 以后有新接口，直接在这里 import，例如：
// import { handleRequest as handleUser } from './api/user.js';

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. 路由分发
    switch (path) {
      case '/api/ip':
        return await handleIP(request, env, context);
      
      // 以后扩展新接口，直接加 case 即可：
      // case '/api/user':
      //   return await handleUser(request, env, context);

      // 2. 根路径或未匹配路径处理（因为去掉了 index.html）
      case '/':
        return new Response(JSON.stringify({ message: "502 bad gateway" }), {
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: "Not Found", status: 404 }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  }
};
