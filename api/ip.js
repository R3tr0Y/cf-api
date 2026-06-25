export async function handleRequest(request, env, context) {
  // 1. 获取客户端 IP
  const clientIP = request.headers.get('cf-connecting-ip') || 
                   request.headers.get('x-forwarded-for') || 
                   '127.0.0.1';

  // 2. 从 Cloudflare 的 request.cf 对象中获取丰富的地理与网络信息
  // 注意：在本地 wrangler dev 测试时，cf 对象可能为空或不全，部署到线上后信息最完整
  const cf = request.cf || {};

  // 3. 拼接经纬度 (格式： "纬度,经度")
  const latitude = cf.latitude || '';
  const longitude = cf.longitude || '';
  const loc = latitude && longitude ? `${latitude},${longitude}` : '';

  // 4. 拼接 ASN 组织信息 (例如: "AS13335 Cloudflare, Inc.")
  const asn = cf.asn ? `AS${cf.asn}` : '';
  const asOrganization = cf.asOrganization || '';
  const org = asn && asOrganization ? `${asn} ${asOrganization}` : asn || asOrganization;

  // 5. 构造完全对齐目标的 JSON 结构
  const data = {
    ip: clientIP,
    city: cf.city || '',
    region: cf.region || '',           // 州/省份/区域 (例如: "California" 或 "Singapore")
    country: cf.country || '',         // 二位国家代码 (例如: "US", "SG")
    loc: loc,                          // 经纬度
    org: org,                          // 自治系统号与组织名称
    postal: cf.postalCode || '',       // 邮编
    timezone: cf.timezone || '',       // 时区 (例如: "America/Los_Angeles")
    timestamp: new Date().toISOString(), // 时间戳
    readme: "https://dash.cloudflare.com/" // 替换为你自定义的说明链接
  };

  // 6. 返回 JSON 响应
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
}
