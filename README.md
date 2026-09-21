# Zhangxinchuang Relay（掌心窗常驻中转）

把「掌心窗」公开版的 **server（Python 标准库）+ MCP（Node）** 合并进一个容器，
用零依赖 Node 网关按路径转发，只占 1 份免费实例额度。

## 路由规则

| 路径 | 转发到 |
|---|---|
| `/mcp`、`/sse`、`/messages`、`/mcp-wallet` … | 内部 MCP（8787） |
| 其它全部 | 内部 server（8513） |

对外统一监听 `PORT`（默认 10000）。

## 在 Koyeb 部署

1. Create Web Service → 选 **GitHub** → 在 **Public GitHub repository** 里填：
   `https://github.com/71931/zhangxinchuang-relay`
2. Builder 选 **Dockerfile**
3. Instance 选 **Free / nano**
4. Port 填 `10000`
5. Environment variables：
   - `LINJIAN_TOKEN` = 你的长随机密钥（**必填**，否则拒绝启动）
   - `LINJIAN_DEFAULT_DEVICE` = `android-phone`
   - `LINJIAN_KEEP` = `3`
6. Deploy，等状态变 Healthy 后访问 `https://<域名>/health` 应返回 `ok:true`

## 说明

- server 与 mcp 同域：手机 App 填**根域名**，站点 MCP 填 **域名 + `/mcp`**，令牌同一个。
- 容器内 server 强制监听 8513，避免与网关的 `PORT` 冲突。
- 环境变量 `PORT` 由平台注入，网关读取它对外提供服务。
