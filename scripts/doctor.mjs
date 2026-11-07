#!/usr/bin/env node
/**
 * 环境自检脚本（零依赖，Node 直接跑）
 *
 * 用途：产品经理/新同事拿到代码后，先跑一次「npm run doctor」，
 *      它会告诉你环境缺什么、端口能不能用、还差哪一步。
 *
 * 用法：npm run doctor
 */
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const OK = '✅';
const WARN = '⚠️ ';
const BAD = '❌';

let hardFail = 0;
let softWarn = 0;

function title(text) {
  console.log(`\n${text}`);
}

function ok(msg) {
  console.log(`  ${OK} ${msg}`);
}

function warn(msg, fix) {
  softWarn += 1;
  console.log(`  ${WARN}${msg}`);
  if (fix) console.log(`     → 处理办法：${fix}`);
}

function bad(msg, fix) {
  hardFail += 1;
  console.log(`  ${BAD} ${msg}`);
  if (fix) console.log(`     → 处理办法：${fix}`);
}

function info(msg) {
  console.log(`     · ${msg}`);
}

/** 检查端口是否空闲；被占用时尝试查出占用进程 */
function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        resolve({ free: false, pid: findPortProcess(port) });
      } else {
        resolve({ free: false, pid: null, err });
      }
    });
    server.once('listening', () => server.close(() => resolve({ free: true })));
    server.listen(port, '127.0.0.1');
  });
}

function findPortProcess(port) {
  try {
    const out = execFileSync(
      'lsof',
      ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    const line = out.split('\n').filter(Boolean)[1]; // 跳过表头
    if (!line) return null;
    const cols = line.split(/\s+/);
    return { name: cols[0], pid: cols[1] };
  } catch {
    return null;
  }
}

console.log('🐾 宠物社区 · 环境自检');

// 1. Node 版本
title('1. 运行环境');
const nodeVersion = process.versions.node;
const [major, minor] = nodeVersion.split('.').map(Number);
if (major > 22 || (major === 22 && minor >= 5)) {
  ok(`Node.js 版本 ${nodeVersion}（满足要求）`);
} else {
  bad(
    `Node.js 版本过低（当前 ${nodeVersion}，需要 22.5 及以上）`,
    '到 https://nodejs.org 下载 LTS 版本安装后重开终端',
  );
}
info(`npm 版本 ${safeNpmVersion()}`);

// 2. 依赖是否装好
title('2. 依赖安装状态');
if (!existsSync(join(ROOT, 'node_modules'))) {
  bad('还没装依赖（找不到 node_modules 目录）', '在项目根目录执行：npm install');
} else {
  ok('根目录 node_modules 已存在');
  const hasApi = existsSync(join(ROOT, 'apps/api/package.json'));
  const hasWeb = existsSync(join(ROOT, 'apps/web/package.json'));
  const expected = ['concurrently'];
  if (hasApi) expected.push('express');
  if (hasWeb) expected.push('vite');
  const missing = expected.filter((p) => !existsSync(join(ROOT, 'node_modules', p)));
  if (missing.length === 0) {
    ok(`关键依赖齐全（${expected.join(' / ')}）`);
  } else {
    warn(`缺少依赖：${missing.join('、')}`, '在项目根目录执行：npm install');
  }
  if (!hasApi || !hasWeb) {
    info('前后端目录还不完整，先等代码合并后再跑一次自检');
  }
}

// 3. 前后端代码目录
title('3. 项目结构');
for (const [name, dir] of [
  ['后端服务 apps/api', 'apps/api'],
  ['前端页面 apps/web', 'apps/web'],
]) {
  if (existsSync(join(ROOT, dir, 'package.json'))) {
    ok(`${name} 已就位`);
  } else {
    warn(`${name} 还没生成（对应同学还在开发）`);
  }
}

// 4. 端口占用
title('4. 端口占用');
const ports = [
  [3001, '后端接口服务'],
  [5173, '前端网站'],
];
for (const [port, label] of ports) {
  const result = await checkPort(port);
  if (result.free) {
    ok(`端口 ${port}（${label}）空闲，可以用`);
  } else if (result.pid) {
    warn(
      `端口 ${port}（${label}）已被占用：${result.pid.name}（进程号 ${result.pid.pid}）`,
      `如果是上次没关干净，执行 kill ${result.pid.pid} 后重试`,
    );
  } else {
    warn(`端口 ${port}（${label}）无法使用`, `执行 lsof -iTCP:${port} -sTCP:LISTEN 查看谁占了`);
  }
}

// 5. 内置数据库能力
title('5. 内置数据库能力（node:sqlite）');
try {
  const { DatabaseSync } = await import('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec('CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT)');
  db.prepare('INSERT INTO t (name) VALUES (?)').run('测试');
  const row = db.prepare('SELECT name FROM t').get();
  db.close();
  if (row?.name === '测试') ok('内置 SQLite 可用（无需另外安装数据库）');
  else warn('内置 SQLite 行为异常，后端可能无法保存数据');
} catch (err) {
  bad(
    `内置 SQLite 不可用：${err.message}`,
    '确认 Node.js 版本 ≥ 22.5；本机 Node 25 自带该能力',
  );
}

// 6. 本地数据文件
title('6. 本地数据文件');
if (existsSync(join(ROOT, 'apps/api/data/pet.db'))) {
  ok('已有本地数据库 apps/api/data/pet.db（首次启动会自动创建）');
} else {
  info('还没有本地数据库，第一次启动后端时会自动建表并写入示例内容');
}

// 汇总
title('自检结论');
if (hardFail === 0 && softWarn === 0) {
  console.log(`  ${OK} 全部正常，执行 npm run dev 就能启动网站`);
} else if (hardFail === 0) {
  console.log(`  ${WARN}有 ${softWarn} 项提醒，一般不影响启动`);
  console.log('     仍然可以试：npm run dev，打开 http://localhost:5173');
} else {
  console.log(`  ${BAD} 有 ${hardFail} 个必须先解决的问题，按上面的「处理办法」操作后再试`);
}
console.log('');

function safeNpmVersion() {
  try {
    return execFileSync('npm', ['-v'], { encoding: 'utf8' }).trim();
  } catch {
    return '未知';
  }
}

process.exit(hardFail > 0 ? 1 : 0);
