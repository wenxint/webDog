/**
 * 图片素材：全部用内联 SVG data URI 生成，不依赖外网，离线也能显示。
 * 前端直接把 cover / authorAvatar 放进 <img src> 即可。
 */

/** 各分类封面色板（奶白 / 暖橙 / 浅棕系的宠物风） */
export const PALETTES = {
  cat: ['#FFF1DF', '#FFD1A6'],
  dog: ['#EAF3FF', '#BFD9FF'],
  exotic: ['#E9F8EE', '#C0E8CB'],
  health: ['#FDEDED', '#F8C9C9'],
  feeding: ['#FFF7DE', '#FFE3A6'],
  behavior: ['#F0ECFF', '#D4C9FF'],
};

const AVATAR_COLORS = [
  ['#FFB27B', '#FF8B5E'],
  ['#8FC7FF', '#5C9DFF'],
  ['#9ADBB0', '#66C08A'],
  ['#FFB6C9', '#FF8AA8'],
  ['#C6B7FF', '#9C86F5'],
  ['#FFD66B', '#FFB93E'],
];

const toDataUri = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** 生成帖子 / 文章封面：渐变底 + 大号 emoji */
export function coverSvg(emoji, categorySlug) {
  const [from, to] = PALETTES[categorySlug] ?? PALETTES.cat;
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
      `</linearGradient></defs>` +
      `<rect width="640" height="400" fill="url(#g)"/>` +
      `<circle cx="520" cy="70" r="90" fill="#FFFFFF" fill-opacity="0.22"/>` +
      `<circle cx="90" cy="340" r="120" fill="#FFFFFF" fill-opacity="0.16"/>` +
      `<text x="320" y="238" font-size="168" text-anchor="middle">${emoji}</text>` +
      `</svg>`,
  );
}

/** 生成用户头像：渐变圆 + 昵称首字 */
export function avatarSvg(name) {
  const chars = Array.from(String(name || '宠'));
  const label = chars[0] ?? '宠';
  const hash = chars.reduce((sum, ch) => sum + (ch.codePointAt(0) ?? 0), 0);
  const [from, to] = AVATAR_COLORS[hash % AVATAR_COLORS.length];
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
      `<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
      `</linearGradient></defs>` +
      `<rect width="96" height="96" rx="48" fill="url(#a)"/>` +
      `<text x="48" y="64" font-size="40" font-family="-apple-system, 'PingFang SC', sans-serif" ` +
      `fill="#FFFFFF" text-anchor="middle">${label}</text>` +
      `</svg>`,
  );
}
