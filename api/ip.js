// 处理返回 IP 的逻辑
export async function handleRequest(request, env, context) {
  const clientIP = request.headers.get('cf-connecting-ip') || 
                   request.headers.get('x-forwarded-for') || 
                   '127.0.0.1';

  const data = {
    ip: clientIP,
    country: request.headers.get('cf-ipcountry') || 'Unknown',
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
}
