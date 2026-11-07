// 本地 mock 数据：后端未就绪时，保证所有页面完整可点。
// 字段与 docs/api-contract.md 保持一致，切换 USE_MOCK=false 即可走真实接口。

const now = Date.now()
const hoursAgo = (h) => new Date(now - h * 60 * 60 * 1000).toISOString()
const daysAgo = (d) => hoursAgo(d * 24)

const unsplash = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const IMAGES = {
  cat: [
    unsplash('photo-1514888286974-6c03e2ca1dba'),
    unsplash('photo-1495360010541-f48722b34f7d'),
    unsplash('photo-1533738363-b7f9aef128ce'),
    unsplash('photo-1518791841217-8f162f1e1131'),
    unsplash('photo-1529778873920-4da4926a72c2'),
    unsplash('photo-1573865526739-10659fec78a5')
  ],
  dog: [
    unsplash('photo-1552053831-71594a27632d'),
    unsplash('photo-1543466835-00a7907e9de1'),
    unsplash('photo-1583511655857-d19b40a7a54e'),
    unsplash('photo-1517849845537-4d257902454a'),
    unsplash('photo-1537151608828-ea2b11777ee8'),
    unsplash('photo-1477884213360-7e9d7dcc1e48'),
    unsplash('photo-1548199973-03cce0bbc87b'),
    unsplash('photo-1592194996308-7b43878e84a6')
  ],
  exotic: [
    unsplash('photo-1585110396000-c9ffd4e4b308'),
    unsplash('photo-1552728089-57bdde30beb3'),
    unsplash('photo-1522069169874-c58ec4b76be5'),
    unsplash('photo-1425082661705-1834bfd09dca')
  ],
  health: [
    unsplash('photo-1589924691995-400dc9ecc119'),
    unsplash('photo-1548199973-03cce0bbc87b'),
    unsplash('photo-1601758228041-f3b2795255f1')
  ],
  feeding: [
    unsplash('photo-1589924691995-400dc9ecc119'),
    unsplash('photo-1552053831-71594a27632d'),
    unsplash('photo-1495360010541-f48722b34f7d')
  ],
  behavior: [
    unsplash('photo-1477884213360-7e9d7dcc1e48'),
    unsplash('photo-1517849845537-4d257902454a'),
    unsplash('photo-1533738363-b7f9aef128ce')
  ]
}

function cover(category, index) {
  const pool = IMAGES[category] || IMAGES.cat
  return pool[index % pool.length]
}

export const categories = [
  { id: 1, name: '猫咪日常', slug: 'cat', icon: '🐱' },
  { id: 2, name: '狗狗生活', slug: 'dog', icon: '🐶' },
  { id: 3, name: '异宠天地', slug: 'exotic', icon: '🦎' },
  { id: 4, name: '健康问诊', slug: 'health', icon: '🩺' },
  { id: 5, name: '科学喂养', slug: 'feeding', icon: '🍗' },
  { id: 6, name: '行为训练', slug: 'behavior', icon: '🎓' }
]

const seedPosts = [
  {
    id: 1,
    title: '橘猫第一次见到雪，在窗边坐了整整半小时',
    content:
      '今天早上拉开窗帘，发现外面全白了。我家橘猫「布丁」先是愣住，然后整只猫贴在玻璃上，尾巴一点一点地甩。\n\n我打开一条窗缝，冷风灌进来，它凑过去闻了两秒，立刻后退三步，又忍不住回来继续看。那个又好奇又怂的样子，我笑了一早上。\n\n最后它选择趴在暖气片上，隔着玻璃监督外面的雪。猫咪的世界真简单，一场雪就够它研究半天。',
    category: 'cat',
    authorName: '布丁的铲屎官',
    authorAvatar: '🐱',
    likes: 128,
    tags: ['橘猫', '下雪天'],
    createdAt: hoursAgo(2),
    comments: [
      {
        id: 1001,
        authorName: '三花她妈',
        content: '我家猫也是！只敢在窗台上看，门一开就钻沙发底。',
        createdAt: hoursAgo(1)
      },
      {
        id: 1002,
        authorName: '养猫第五年',
        content: '暖气片 + 窗户 = 猫咪冬日最佳观景位，认证。',
        createdAt: hoursAgo(1)
      }
    ]
  },
  {
    id: 2,
    title: '柯基第一次去海边，全程四只脚不敢同时离地',
    content:
      '周末带「土豆」去了海边，本来想象的是它在沙滩上狂奔，结果现实是：每走两步就要停下来确认沙子会不会咬它。\n\n浪打过来的一瞬间，它直接原地起跳，回头用一种「你带我来的是什么地方」的眼神看我。旁边钓鱼的大爷笑得鱼竿都在抖。\n\n回程路上它睡得四仰八叉。虽然没跑起来，但下次还带它来，慢慢就习惯了。',
    category: 'dog',
    authorName: '土豆今天散步了吗',
    authorAvatar: '🐶',
    likes: 312,
    tags: ['柯基', '海边'],
    createdAt: hoursAgo(5),
    comments: [
      {
        id: 1003,
        authorName: '短腿俱乐部',
        content: '柯基的腿在沙滩上属于超常发挥，别为难孩子了哈哈哈。',
        createdAt: hoursAgo(4)
      },
      {
        id: 1004,
        authorName: '豆包',
        content: '求问海边遛狗要注意什么？下个月也想带我家狗去。',
        createdAt: hoursAgo(3)
      },
      {
        id: 1005,
        authorName: '土豆今天散步了吗',
        content: '记得带淡水冲洗脚垫，避开太烫的沙子，防晒和捡便袋也别忘。',
        createdAt: hoursAgo(2)
      }
    ]
  },
  {
    id: 3,
    title: '猫咪突然不吃饭，去医院后才知道是牙结石',
    content:
      '「年糕」连续两天只闻一闻就走，罐头也不吃。我以为它挑食，差点想饿它一顿，还好及时去了医院。\n\n医生检查后发现后槽牙有一圈牙结石，牙龈发红，吃东西会疼。清理之后当天晚上就恢复干饭了，现在想想有点后怕。\n\n提醒大家：猫咪很能忍痛，不吃饭往往不是闹脾气。如果超过 24 小时不进食，一定要当回事。',
    category: 'health',
    authorName: '年糕很黏人',
    authorAvatar: '🩺',
    likes: 267,
    tags: ['猫咪健康', '牙结石'],
    createdAt: hoursAgo(9),
    comments: [
      {
        id: 1006,
        authorName: '布丁的铲屎官',
        content: '学到了，我家猫最近也吃得少，周末带去看看。',
        createdAt: hoursAgo(7)
      },
      {
        id: 1007,
        authorName: '医生的建议',
        content: '日常可以配合洁齿零食，但刷牙还是最有效的，慢慢脱敏就好。',
        createdAt: hoursAgo(6)
      },
      {
        id: 1008,
        authorName: '年糕很黏人',
        content: '对，医生也这么说，已经下单指套牙刷了。',
        createdAt: hoursAgo(5)
      }
    ]
  },
  {
    id: 4,
    title: '新手养侏儒兔一个月的踩坑清单，能少走弯路就少走',
    content:
      '接「糯米」回家满一个月，整理了这一个月踩过的坑。\n\n第一，笼子不能只看颜值。我买的网红木质笼子缝隙太大，兔子差点把头卡住，后来换成了带底网的金属笼。第二，兔子不能只喂胡萝卜和青菜，主食必须是提摩西草，幼兔还要配幼兔粮。第三，不要频繁抱它，刚到家那几天越抱越躲。\n\n现在它会主动凑过来闻我的手了，慢慢来就好。',
    category: 'exotic',
    authorName: '糯米团子',
    authorAvatar: '🐰',
    likes: 141,
    tags: ['兔子', '新手避坑'],
    createdAt: hoursAgo(14),
    comments: [
      {
        id: 1009,
        authorName: '草是本体',
        content: '提摩西草无限量这条太重要了，很多新手真的以为兔子吃胡萝卜。',
        createdAt: hoursAgo(12)
      },
      {
        id: 1010,
        authorName: '糯米团子',
        content: '是的，我最初也差点买成兔粮当主食。',
        createdAt: hoursAgo(11)
      }
    ]
  },
  {
    id: 5,
    title: '猫粮不是越贵越好，我选粮只看这 4 点',
    content:
      '养猫六年，从盲目追进口大牌到现在看成分表，总结四条自己的选粮标准。\n\n一看配料表前三位，肉类来源是否明确；二看粗蛋白和粗脂肪比例，幼猫和成猫需求不同；三看有没有明确的适口性反馈，再好的粮猫不吃也白搭；四看自己的预算能不能长期稳定。\n\n没有一款粮适合所有猫，换粮一定要 7 天过渡。别被营销词吓到，也别为了省钱长期喂劣质粮。',
    category: 'feeding',
    authorName: '两只猫的账本',
    authorAvatar: '🍚',
    likes: 302,
    tags: ['猫粮', '科学喂养'],
    createdAt: hoursAgo(20),
    comments: [
      {
        id: 1011,
        authorName: '年糕很黏人',
        content: '第四条太真实了，长期吃得起比偶尔吃得好重要。',
        createdAt: hoursAgo(18)
      },
      {
        id: 1012,
        authorName: '新手养猫日记',
        content: '请问 7 天过渡具体怎么分？',
        createdAt: hoursAgo(16)
      },
      {
        id: 1013,
        authorName: '两只猫的账本',
        content: '前三天新粮 25%，中间两天 50%，后两天 75%，最后全换。',
        createdAt: hoursAgo(15)
      }
    ]
  },
  {
    id: 6,
    title: '狗狗拆家不是报复，是分离焦虑',
    content:
      '之前每次出门回家，沙发垫都会被拖到门口，我还以为是它故意气我。后来看了很多资料才明白，这是典型的分离焦虑。\n\n我开始做三件事：出门前不搞大阵仗、回家先冷处理十分钟、白天留一个漏食玩具。坚持了一个月，拆家明显少了。\n\n如果你家狗只在主人离开后搞破坏，先别骂，观察一下它是不是在找你。',
    category: 'behavior',
    authorName: '大熊的家长',
    authorAvatar: '🎓',
    likes: 219,
    tags: ['分离焦虑', '狗狗行为'],
    createdAt: daysAgo(1),
    comments: [
      {
        id: 1014,
        authorName: '土豆今天散步了吗',
        content: '出门前告别搞太隆重确实会加重焦虑，深有体会。',
        createdAt: hoursAgo(21)
      },
      {
        id: 1015,
        authorName: '训练师小林',
        content: '漏食玩具 + 离开时间脱敏，是最基础也最有效的组合。',
        createdAt: hoursAgo(20)
      }
    ]
  },
  {
    id: 7,
    title: '新猫到家第三天，终于肯在我腿上睡觉了',
    content:
      '周一接回来的小三花，前两天天天躲在床底，只有半夜才出来吃饭。我按攻略没去抓它，就把猫砂盆、水碗放在附近，自己该干嘛干嘛。\n\n今天下午我坐在沙发上看书，它先是在两米外观察，然后一步一步挪过来，最后整只猫窝在我腿上睡着了。那一刻真的不敢动。\n\n给同样在等猫靠近的朋友：耐心比技巧重要，别急着抱。',
    category: 'cat',
    authorName: '三花她妈',
    authorAvatar: '🐱',
    likes: 236,
    tags: ['新猫到家', '三花'],
    createdAt: daysAgo(1),
    comments: [
      {
        id: 1016,
        authorName: '布丁的铲屎官',
        content: '看到「不敢动」三个字笑了，太懂了。',
        createdAt: hoursAgo(20)
      }
    ]
  },
  {
    id: 8,
    title: '领养的第 100 天：从躲床底到抢枕头',
    content:
      '第 1 天，它缩在航空箱里不肯出来，我蹲了四十分钟，它只露出半张脸。\n\n第 30 天，它终于敢在我吃饭时坐在旁边看。第 60 天，第一次主动跳上床。今天是第 100 天，它已经会在我起床前把枕头占好，然后用一种「你怎么才来」的表情看我。\n\n领养不是拯救，是彼此适应。这 100 天，它教会我慢一点。',
    category: 'dog',
    authorName: '阿黄的家',
    authorAvatar: '🐶',
    likes: 428,
    tags: ['领养', '第100天'],
    createdAt: daysAgo(1),
    comments: [
      {
        id: 1017,
        authorName: '糯米团子',
        content: '看哭了，领养真的需要耐心。祝福阿黄。',
        createdAt: hoursAgo(19)
      },
      {
        id: 1018,
        authorName: '土豆今天散步了吗',
        content: '「它教会我慢一点」这句写得真好。',
        createdAt: hoursAgo(18)
      },
      {
        id: 1019,
        authorName: '大熊的家长',
        content: '我家也是领养的，前三个月最难，后面全是糖。',
        createdAt: hoursAgo(17)
      },
      {
        id: 1020,
        authorName: '阿黄的家',
        content: '谢谢大家，也祝每个等家的毛孩子都能等到人。',
        createdAt: hoursAgo(16)
      }
    ]
  },
  {
    id: 9,
    title: '狗狗每年要打的疫苗，我整理成了一张表',
    content:
      '带狗打疫苗这件事，身边很多朋友都记不清。我把自家狗的时间表整理了一下，供参考。\n\n幼犬一般在 6 到 8 周开始首针，之后每隔 3 到 4 周加强，最后一针通常在 16 周左右，之后补狂犬。成犬每年加强一次，具体以医生建议和当地规定为准。\n\n打完疫苗一周内别洗澡、别去狗多的地方。打完观察半小时再走，出现过敏反应能及时处理。',
    category: 'health',
    authorName: '养狗小本本',
    authorAvatar: '🩺',
    likes: 341,
    tags: ['疫苗', '狗狗健康'],
    createdAt: daysAgo(1),
    comments: [
      {
        id: 1021,
        authorName: '医生的建议',
        content: '补充一句：疫苗不是越多越好，按医嘱和抗体情况来。',
        createdAt: hoursAgo(17)
      },
      {
        id: 1022,
        authorName: '豆包',
        content: '收藏了，正好下周要带狗去打加强针。',
        createdAt: hoursAgo(15)
      }
    ]
  },
  {
    id: 10,
    title: '玄凤鹦鹉开口叫名字了，全家都激动',
    content:
      '养了四个月的玄凤「小葵」，今天早上突然清楚地叫了一声「小葵」。我端着咖啡愣在原地，以为听错了，结果它又来了一声。\n\n训练方法其实很朴素：每天固定时间重复叫它名字，叫对了就给一小块它喜欢的零食，其他时候不强化。\n\n鹦鹉很聪明，但也需要陪伴。如果每天没人理，它容易拔毛。想养之前先问问自己，能不能陪它十几年。',
    category: 'exotic',
    authorName: '阳台上的鸟',
    authorAvatar: '🦜',
    likes: 98,
    tags: ['玄凤鹦鹉', '说话训练'],
    createdAt: daysAgo(2),
    comments: [
      {
        id: 1023,
        authorName: '草是本体',
        content: '恭喜！玄凤学说话确实需要耐心，我家那只只会学微波炉响。',
        createdAt: daysAgo(2)
      },
      {
        id: 1024,
        authorName: '阳台上的鸟',
        content: '哈哈微波炉声也是它的语言储备，说明你家环境很热闹。',
        createdAt: daysAgo(2)
      }
    ]
  },
  {
    id: 11,
    title: '第一次开海水缸，记录一下爆藻期的崩溃',
    content:
      '小缸开缸第 18 天，活石上开始疯长褐藻，玻璃一层雾，怎么看怎么丑。查了资料才知道这几乎是必经阶段，只能熬。\n\n现在的做法是控制光照时间、少量多次换水、加了食藻螺。虽然还是不好看，但已经开始有退的迹象了。\n\n海水缸真的不是「买缸、放水、放鱼」这么简单，新手一定要先养水，别急着下生物。',
    category: 'exotic',
    authorName: '三十升海',
    authorAvatar: '🐠',
    likes: 66,
    tags: ['海水缸', '爆藻期'],
    createdAt: daysAgo(2),
    comments: [
      {
        id: 1025,
        authorName: '一缸清水',
        content: '爆藻期熬过去就好了，我当初差点把缸砸了。',
        createdAt: daysAgo(2)
      },
      {
        id: 1026,
        authorName: '三十升海',
        content: '听你这么说我又有信心了，继续熬。',
        createdAt: daysAgo(2)
      }
    ]
  },
  {
    id: 12,
    title: '仓鼠笼子改造：从随便养到认真造景',
    content:
      '一开始在花鸟市场买了一个小笼子，后来才知道对仓鼠来说太小了。查了资料，换成了 80 厘米的笼子。\n\n铺了 20 厘米厚的垫料让它打洞，加了跑轮、躲避屋、沙浴盆，还试着种了一点猫草。现在它每天忙得很，晚上能听见它刨洞的声音。\n\n仓鼠是夜行性动物，白天睡觉很正常。如果你家仓鼠白天也很亢奋，先检查一下笼子是不是太小、环境是不是太吵。',
    category: 'exotic',
    authorName: '小仓鼠的大房子',
    authorAvatar: '🐹',
    likes: 179,
    tags: ['仓鼠', '笼子造景'],
    createdAt: daysAgo(2),
    comments: [
      {
        id: 1027,
        authorName: '草是本体',
        content: '20 厘米垫料太治愈了，仓鼠本来就该打洞。',
        createdAt: daysAgo(2)
      }
    ]
  },
  {
    id: 13,
    title: '猫咪半夜跑酷怎么破？试了一周终于有救了',
    content:
      '「布丁」连续一周凌晨三点开始跑酷，从客厅冲到卧室，再从床上弹过去。我和室友快神经衰弱了。\n\n后来查到一个思路：猫咪是晨昏动物，白天睡太多，晚上自然有精力。我调整成睡前 40 分钟用逗猫棒陪玩，玩到它喘气，再喂一顿夜宵，然后关灯。\n\n坚持了一周，现在能睡到早上六点了。重点是玩到累，不是随便挥两下。',
    category: 'cat',
    authorName: '布丁的铲屎官',
    authorAvatar: '🐱',
    likes: 96,
    tags: ['猫咪跑酷', '作息调整'],
    createdAt: daysAgo(3),
    comments: [
      {
        id: 1028,
        authorName: '三花她妈',
        content: '睡前陪玩 + 夜宵真的有用，我家现在也安分了。',
        createdAt: daysAgo(3)
      },
      {
        id: 1029,
        authorName: '年糕很黏人',
        content: '所以问题不是猫太闹，是我们白天让它睡太饱。',
        createdAt: daysAgo(3)
      }
    ]
  },
  {
    id: 14,
    title: '金毛的饭盆保卫战，每天准时六点开始',
    content:
      '我家金毛「大熊」认识时间比我还准。每天下午六点，它会准时把饭盆叼到我脚边，然后用头拱我的手。\n\n有一次我想逗它，故意说「还没到」，它居然趴下叹了口气，隔五分钟再来一次。后来我干脆给它买了个慢食盆，吃饭从三分钟拉长到十分钟以上。\n\n大型犬吃饭太快容易胃扭转，慢食盆真的值得买。',
    category: 'dog',
    authorName: '大熊的家长',
    authorAvatar: '🐶',
    likes: 87,
    tags: ['金毛', '慢食盆'],
    createdAt: daysAgo(3),
    comments: [
      {
        id: 1030,
        authorName: '短腿俱乐部',
        content: '金毛的饭点提醒比闹钟还准，我家也是。',
        createdAt: daysAgo(3)
      }
    ]
  },
  {
    id: 15,
    title: '狗狗每年驱虫怎么做才有效',
    content:
      '驱虫这件事，我踩过的坑是只看体重不看药。不同成分针对的虫不一样，体外和体内也要分开考虑。\n\n现在的习惯是：每月记录体重，按体重选剂量；体外按时用，不去草丛少担心但仍然坚持；从野外回来会检查耳朵、脚垫和毛根。\n\n最重要的一点：驱虫药不是保健品，别自己加频率，按说明和医生建议来。',
    category: 'health',
    authorName: '医生的建议',
    authorAvatar: '🩺',
    likes: 189,
    tags: ['驱虫', '狗狗健康'],
    createdAt: daysAgo(4),
    comments: [
      {
        id: 1031,
        authorName: '大熊的家长',
        content: '体重记录这个习惯好，我经常凭感觉。',
        createdAt: daysAgo(4)
      },
      {
        id: 1032,
        authorName: '豆包',
        content: '请问体外驱虫用完多久不能洗澡？',
        createdAt: daysAgo(4)
      }
    ]
  },
  {
    id: 16,
    title: '记录一下我家猫学会自己开门的过程',
    content:
      '这事说起来有点魔幻。最开始是发现门偶尔没关好，以为是风吹的，直到有一天我亲眼看见「年糕」站起来压门把手。\n\n我试着把门把手换成圆形的，它适应了三天，又学会了用爪子勾。现在我只能在门内加儿童安全锁。\n\n所有「猫成精了」的背后，都是它反复试错的结果。别低估一只想进房间的猫。',
    category: 'cat',
    authorName: '年糕很黏人',
    authorAvatar: '🐱',
    likes: 176,
    tags: ['猫咪趣事', '开门'],
    createdAt: daysAgo(5),
    comments: [
      {
        id: 1033,
        authorName: '布丁的铲屎官',
        content: '猫的智商全点在这种奇怪的地方了。',
        createdAt: daysAgo(5)
      }
    ]
  },
  {
    id: 17,
    title: '遛狗遇到下暴雨，一人一狗在便利店门口躲雨',
    content:
      '出门时还是晴天，走到半路突然下大暴雨。我和「土豆」冲进便利店门口，它抖了抖身上的水，特别自然地坐下了，像在等店员给它一根火腿肠。\n\n店员出来递了两个纸箱让我们坐着等，还说「狗也能进店里躲雨」。那一刻觉得这个城市挺温柔的。\n\n回家后赶紧给它擦干吹透，爪子缝也检查了。雨天遛狗记得避开积水，防止皮肤病。',
    category: 'dog',
    authorName: '土豆今天散步了吗',
    authorAvatar: '🐶',
    likes: 154,
    tags: ['雨天遛狗', '暖心瞬间'],
    createdAt: daysAgo(5),
    comments: [
      {
        id: 1034,
        authorName: '阿黄的家',
        content: '便利店店员真好。雨天记得吹干，不然容易得真菌。',
        createdAt: daysAgo(5)
      },
      {
        id: 1035,
        authorName: '土豆今天散步了吗',
        content: '对，回家马上擦干吹透了，脚垫也擦了。',
        createdAt: daysAgo(5)
      }
    ]
  },
  {
    id: 18,
    title: '教了俩月，我家狗终于会「装死」了',
    content:
      '训练这件事，我的经验是：拆得越细越好，时间越短越好。\n\n「装死」拆成了三步：先学会趴下，再学会侧躺，最后把侧躺和口令、手势绑定。每天只练五分钟，练对立刻给奖励，练错就重来，不重复超过三次。\n\n现在它听到「砰」就会侧倒，然后眼睛偷偷睁开一条缝等零食。虽然演技一般，但已经很满意了。',
    category: 'behavior',
    authorName: '训练师小林',
    authorAvatar: '🎓',
    likes: 203,
    tags: ['狗狗训练', '装死'],
    createdAt: daysAgo(6),
    comments: [
      {
        id: 1036,
        authorName: '大熊的家长',
        content: '「眼睛偷看」这个细节太可爱了，我家也会。',
        createdAt: daysAgo(6)
      },
      {
        id: 1037,
        authorName: '土豆今天散步了吗',
        content: '每天五分钟这个节奏很适合上班族，学到了。',
        createdAt: daysAgo(6)
      }
    ]
  },
  {
    id: 19,
    title: '三花妹妹的纸箱城堡日记',
    content:
      '双十一之后，家里堆了六个纸箱。我突发奇想给「三花」搭了个城堡，带二层、带通道、带天窗。\n\n它先绕着城堡闻了三圈，然后从最低的窗口钻进去，在里面待了一整个下午。晚上我发现它把最心爱的毛球也搬进去了。\n\n贵的猫爬架它不爱，免费的纸箱它当宝。猫咪的快乐，有时候真的很便宜。',
    category: 'cat',
    authorName: '三花她妈',
    authorAvatar: '🐱',
    likes: 58,
    tags: ['纸箱', '猫咪日常'],
    createdAt: daysAgo(7),
    comments: [
      {
        id: 1038,
        authorName: '年糕很黏人',
        content: '纸箱城堡 + 毛球，这不比两百块的猫窝香？',
        createdAt: daysAgo(7)
      }
    ]
  },
  {
    id: 20,
    title: '换季掉毛还是皮肤病？这几个信号要警惕',
    content:
      '春秋换季，掉毛量翻倍是正常的。但如果出现下面这些情况，就要考虑去医院了：局部秃斑、皮肤发红有皮屑、频繁抓挠舔舐同一处、掉毛伴随食欲下降。\n\n我家的经验是，先拍照片记录变化，不要急着洗澡或者乱涂药。猫咪的皮肤病有很多种，真菌、螨虫、过敏处理方式完全不同。\n\n日常多梳毛，环境保持干燥，换季适当补充营养，比掉毛后焦虑更有用。',
    category: 'health',
    authorName: '年糕很黏人',
    authorAvatar: '🩺',
    likes: 225,
    tags: ['掉毛', '皮肤病'],
    createdAt: daysAgo(8),
    comments: [
      {
        id: 1039,
        authorName: '三花她妈',
        content: '局部秃斑这个真的要重视，我家猫之前就是。',
        createdAt: daysAgo(8)
      },
      {
        id: 1040,
        authorName: '医生的建议',
        content: '补充：不要自行使用人用药，剂量和成分都可能有风险。',
        createdAt: daysAgo(8)
      }
    ]
  },
  {
    id: 21,
    title: '狗狗可以吃的 10 种人类食物，和绝对不能碰的 8 种',
    content:
      '先说不能碰的，这个必须记牢：巧克力、葡萄和葡萄干、洋葱和大葱、夏威夷果、木糖醇、酒精、咖啡、生面团。这些可能造成中毒，不要有侥幸心理。\n\n可以少量吃的：清水煮鸡胸、南瓜、胡萝卜、苹果（去核）、无糖原味酸奶、熟鸡蛋、西兰花、蓝莓、西瓜（去籽）、白米饭。前提是不加盐不加油，而且只当零食。\n\n任何新食物先少量尝试，观察 24 小时。主食还是以狗粮为主，人类食物不能替代正餐。',
    category: 'feeding',
    authorName: '养狗小本本',
    authorAvatar: '🍚',
    likes: 388,
    tags: ['狗狗饮食', '禁忌食物'],
    createdAt: daysAgo(9),
    comments: [
      {
        id: 1041,
        authorName: '大熊的家长',
        content: '木糖醇真的太隐蔽了，很多无糖口香糖和烘焙食品里都有。',
        createdAt: daysAgo(9)
      },
      {
        id: 1042,
        authorName: '豆包',
        content: '已经截图存手机了，家里老人总想偷偷喂。',
        createdAt: daysAgo(9)
      },
      {
        id: 1043,
        authorName: '养狗小本本',
        content: '和家里人统一口径很重要，尤其是别喂带骨头的肉。',
        createdAt: daysAgo(9)
      },
      {
        id: 1044,
        authorName: '短腿俱乐部',
        content: '苹果去核这点以前真不知道，收藏。',
        createdAt: daysAgo(8)
      }
    ]
  },
  {
    id: 22,
    title: '从干粮换到湿粮，我家猫的 7 天过渡记录',
    content:
      '因为「布丁」喝水太少，我决定慢慢换成湿粮。直接换它肯定不吃，所以用了 7 天过渡。\n\n第 1 到 2 天：干粮为主，加一小勺湿粮拌开。第 3 到 4 天：干湿各一半。第 5 到 6 天：湿粮为主，干粮少量。第 7 天：完全湿粮，同时观察便便和精神状态。\n\n过程中它有过一次软便，我把量减半又稳定下来。换粮别心急，猫的肠胃比我们想的敏感。',
    category: 'feeding',
    authorName: '布丁的铲屎官',
    authorAvatar: '🍚',
    likes: 144,
    tags: ['换粮', '湿粮'],
    createdAt: daysAgo(10),
    comments: [
      {
        id: 1045,
        authorName: '年糕很黏人',
        content: '软便那段太真实了，我家换粮也翻过车。',
        createdAt: daysAgo(10)
      }
    ]
  },
  {
    id: 23,
    title: '猫咪哈气、飞机耳背后的真实情绪',
    content:
      '很多新手看到猫哈气会觉得「它好凶」，其实哈气更多是害怕和防御，不一定是攻击。\n\n飞机耳也分情况：耳朵向后压平、身体蜷缩，通常是紧张；如果还伴随尾巴快速甩动、瞳孔放大，就要给它空间，别强行抱。\n\n判断猫咪情绪，看整体：耳朵、尾巴、瞳孔、身体姿态。单独一个信号容易误判。尊重它的边界，关系反而会更好。',
    category: 'behavior',
    authorName: '训练师小林',
    authorAvatar: '🎓',
    likes: 167,
    tags: ['猫咪行为', '情绪信号'],
    createdAt: daysAgo(12),
    comments: [
      {
        id: 1046,
        authorName: '三花她妈',
        content: '「哈气是害怕」这点太重要了，以前我总以为它在凶我。',
        createdAt: daysAgo(12)
      },
      {
        id: 1047,
        authorName: '布丁的铲屎官',
        content: '看整体这个思路很实用，收藏了。',
        createdAt: daysAgo(12)
      }
    ]
  },
  {
    id: 24,
    title: '用响片训练猫咪坐下，10 天真实记录',
    content:
      '猫也能训练，只是需要更好的耐心和更短的回合。我用响片试了 10 天。\n\n第 1 到 3 天：只在它靠近时按响片给零食，建立「响片 = 好事」的联想。第 4 到 7 天：等它自然坐下的一瞬间按响片。第 8 到 10 天：加入手势和口令，做对就奖励。\n\n现在「年糕」听到口令会坐下，虽然经常看心情。训练猫咪的秘诀：别贪心，一次两分钟，见好就收。',
    category: 'behavior',
    authorName: '年糕很黏人',
    authorAvatar: '🎓',
    likes: 118,
    tags: ['响片训练', '猫咪训练'],
    createdAt: daysAgo(14),
    comments: [
      {
        id: 1048,
        authorName: '训练师小林',
        content: '流程写得很标准，关键就是控制回合长度。',
        createdAt: daysAgo(14)
      }
    ]
  }
]

// 把种子数据补齐成契约字段（commentsCount 由评论条数计算）
const postsState = seedPosts
  .map((post, index) => ({
    ...post,
    cover: post.cover || cover(post.category, index),
    commentsCount: Array.isArray(post.comments) ? post.comments.length : 0
  }))
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

const articleSeed = [
  {
    id: 1,
    title: '新手养猫第一周：需要准备的 9 样东西',
    summary: '猫砂盆、猫砂、粮、水碗、航空箱、猫抓板……按重要程度排好序，别一上来就买一堆用不上的。',
    category: '新手入门',
    cover: cover('cat', 0),
    readCount: 3260,
    createdAt: daysAgo(3),
    content:
      '接猫回家前，先把必需品准备好，比买一堆玩具重要得多。\n\n第一梯队是猫砂盆、猫砂、猫粮、食盆和水碗、航空箱。航空箱建议提前放在家里让猫熟悉，别等出门才拿出来。\n\n第二梯队是猫抓板、指甲剪、梳子、宠物专用湿巾。玩具可以后补，先观察猫喜欢什么类型。\n\n最后提醒：新猫到家先隔离在一个房间，给它 3 到 7 天适应期，不要一上来就全家开放。'
  },
  {
    id: 2,
    title: '幼犬到家 30 天养育计划',
    summary: '从环境适应、如厕训练到疫苗安排，按周拆分的幼犬养育节奏，新手照着做就不慌。',
    category: '新手入门',
    cover: cover('dog', 1),
    readCount: 2870,
    createdAt: daysAgo(5),
    content:
      '第一周的目标只有适应。固定一个安全区域，准备好窝、水、尿垫，保持安静，不要频繁抱和围观。\n\n第二周开始建立作息：固定喂食时间、固定如厕地点、固定户外时间。幼犬的膀胱还小，需要更频繁地带出去。\n\n第三到四周逐步增加外出和社交，但疫苗没打全之前，避免去狗多的地方和草地。\n\n记住：幼犬期最重要的是安全感和规律，不是学会多少技能。'
  },
  {
    id: 3,
    title: '猫咪疫苗怎么打？一张时间表说清楚',
    summary: '猫三联、狂犬疫苗分别什么时候打，加强针怎么安排，打完要注意什么。',
    category: '健康养护',
    cover: cover('health', 0),
    readCount: 5120,
    createdAt: daysAgo(9),
    content:
      '幼猫一般在 8 周左右开始打猫三联，之后每隔 3 到 4 周加强，通常打三针，最后一针在 16 周左右。\n\n狂犬疫苗一般建议在 3 月龄以上接种，具体按当地规定和医生安排。\n\n成猫每年是否需要加强，要结合生活方式和抗体情况，纯室内猫和经常外出的猫方案不完全一样。\n\n接种后留院观察 30 分钟，一周内不洗澡、不换环境，出现持续呕吐或精神差及时联系医生。'
  },
  {
    id: 4,
    title: '狗狗每年驱虫怎么做才有效',
    summary: '体内外驱虫的区别、频率、按体重选药，以及常见的新手误区。',
    category: '健康养护',
    cover: cover('health', 1),
    readCount: 4630,
    createdAt: daysAgo(11),
    content:
      '驱虫分体内和体外，作用对象不同，不能互相替代。\n\n体内驱虫通常按月或按季度进行，具体看药物说明；体外驱虫按月使用更稳定。经常去草地、接触其他动物的狗，风险更高。\n\n选药的核心是按体重算剂量，不是「差不多就行」。幼犬、孕犬、有基础病的狗，用药前先咨询医生。\n\n驱虫后如果出现精神差、呕吐，记录下来并联系医生，不要自行加药或重复用药。'
  },
  {
    id: 5,
    title: '猫粮、狗粮怎么看配料表',
    summary: '肉源、粗蛋白、灰分、添加剂，一张图看懂粮袋背面的关键信息。',
    category: '科学喂养',
    cover: cover('feeding', 0),
    readCount: 6810,
    createdAt: daysAgo(6),
    content:
      '看配料表先看前三位。肉类的具体来源写清楚（比如「鸡肉」而不是「肉类及其副产品」），通常更可靠。\n\n粗蛋白不是越高越好，要结合动物年龄、活动量和肠胃情况。幼猫幼犬需要更高蛋白，老年动物则要关注肾脏指标。\n\n灰分和粗纤维能反映部分原料质量，但不必迷信单一数字。\n\n最后看配方是否长期稳定、价格是否吃得消。频繁换粮对肠胃不友好，选一款合适的长期吃更重要。'
  },
  {
    id: 6,
    title: '猫咪不能吃的 12 种食物',
    summary: '洋葱、葡萄、巧克力、木糖醇……这些日常食物对猫可能是致命的，建议截图存下。',
    category: '科学喂养',
    cover: cover('feeding', 2),
    readCount: 9230,
    createdAt: daysAgo(13),
    content:
      '猫不能吃的食物里，最容易被忽略的是洋葱、大葱和韭菜，它们会破坏红细胞。\n\n葡萄和葡萄干可能导致肾损伤，巧克力中的可可碱对猫也有毒性，木糖醇会引起低血糖。\n\n生鱼、生鸡蛋有细菌和寄生虫风险；牛奶多数成年猫乳糖不耐；酒精和咖啡因更要严格避免。\n\n如果误食，记录吃了什么、吃了多少、什么时候吃的，尽快联系医院，不要等出现症状。'
  },
  {
    id: 7,
    title: '猫砂盆选错，家里味道很难消',
    summary: '开放式还是封闭式？猫砂盆放哪里、多久清理一次，一次性讲清楚。',
    category: '日常护理',
    cover: cover('cat', 3),
    readCount: 4110,
    createdAt: daysAgo(15),
    content:
      '猫砂盆的首要原则是「够大」。长度建议是猫身长的 1.5 倍左右，很多商品盆其实偏小。\n\n开放式通风好、猫更容易接受；封闭式遮味但容易让猫不愿进。新手建议先用开放式，观察接受度。\n\n数量上遵循「猫数 + 1」的原则，位置要安静、远离食盆，不要放在洗衣机旁或人流量大的过道。\n\n每天至少铲一次，每周彻底换砂清洗。如果猫突然不用猫砂盆，先排除泌尿系统问题。'
  },
  {
    id: 8,
    title: '狗狗拆家、乱叫，先别急着骂',
    summary: '拆家、乱叫、扑人背后通常是需求没被满足，先找原因再训练。',
    category: '行为训练',
    cover: cover('behavior', 0),
    readCount: 5740,
    createdAt: daysAgo(8),
    content:
      '拆家最常见的原因有三个：精力没消耗、分离焦虑、换牙期。先分辨原因，再对症处理。\n\n乱叫可能是在报警、索求关注或害怕。如果每次叫你都过去，等于奖励了它。正确做法是安静时给关注，叫的时候忽略。\n\n训练的核心是「奖励你想要的行为」，而不是只惩罚不想要的行为。\n\n每天保证足够的散步和嗅闻时间，比任何训练技巧都更能减少问题行为。'
  },
  {
    id: 9,
    title: '猫咪应激的 6 个信号',
    summary: '躲藏、拒食、过度舔毛、乱尿……搬家、洗澡、来客人时尤其要注意。',
    category: '行为训练',
    cover: cover('behavior', 2),
    readCount: 3860,
    createdAt: daysAgo(17),
    content:
      '猫咪应激时不一定会有明显动作，很多时候是「变得不像平时」。\n\n常见信号包括：长时间躲藏、拒食、过度舔毛、乱尿、瞳孔持续放大、对平时喜欢的东西失去兴趣。\n\n搬家、装修、家里来客人、换猫砂、去医院，都可能成为应激源。\n\n应对原则是减少刺激、保留熟悉气味、给它可以躲的空间。如果超过 24 小时不吃不喝，及时就医。'
  },
  {
    id: 10,
    title: '兔子、仓鼠、鹦鹉，异宠入门怎么选',
    summary: '不同异宠的寿命、空间、陪伴需求差异很大，先搞清楚再决定。',
    category: '异宠入门',
    cover: cover('exotic', 0),
    readCount: 2240,
    createdAt: daysAgo(19),
    content:
      '选异宠之前，先问自己三个问题：能陪多久、能接受多大空间、家人是否同意。\n\n兔子需要较大的活动空间和无限量干草，寿命可以到 8 到 12 年；仓鼠是夜行动物，笼子越大越好；鹦鹉很聪明，需要长期陪伴，部分品种寿命超过 20 年。\n\n异宠的就医资源比猫狗少，提前确认附近有没有能看异宠的医院。\n\n不要因为「便宜、好养、不用遛」就冲动入手，它们同样是一条生命。'
  },
  {
    id: 11,
    title: '老年犬猫的照护清单',
    summary: '7 岁以后，体检、饮食、关节和口腔都需要重新安排。',
    category: '健康养护',
    cover: cover('health', 2),
    readCount: 3420,
    createdAt: daysAgo(21),
    content:
      '猫狗一般 7 岁左右进入老年期，大型犬会更早。这个阶段的变化往往很缓慢，需要主动观察。\n\n体检建议每年 1 到 2 次，重点关注肾脏、心脏、牙齿、关节和甲状腺。\n\n饮食上适当控制热量，增加优质蛋白和关节营养，但不要自行大补。\n\n家里可以增加防滑垫、降低猫砂盆高度、减少跳跃。老年动物更需要稳定的环境和温柔的节奏。'
  },
  {
    id: 12,
    title: '换季掉毛护理指南',
    summary: '梳毛频率、洗澡节奏、饮食补充，以及怎么区分正常掉毛和皮肤病。',
    category: '日常护理',
    cover: cover('cat', 5),
    readCount: 4520,
    createdAt: daysAgo(23),
    content:
      '换季掉毛是正常的生理现象，但可以通过日常护理减少家里的毛量。\n\n短毛猫狗建议每周梳 2 到 3 次，长毛每天梳。换毛期可以适当增加频率，但不要用力拉扯。\n\n洗澡不要太频繁，猫一般不需要经常洗，狗根据品种和活动量决定。\n\n饮食上保证优质蛋白和适量脂肪酸。如果出现局部秃斑、皮肤发红、频繁抓挠，就不是单纯掉毛了，需要就医。'
  }
]

const articlesState = articleSeed.map((article) => ({ ...article }))

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function toPostListItem(post) {
  const { comments, ...rest } = post
  return {
    ...rest,
    commentsCount: Array.isArray(comments) ? comments.length : post.commentsCount || 0
  }
}

function matchesCategory(post, category) {
  if (!category) return true
  return (
    post.category === category ||
    String(post.category) === String(category) ||
    categories.some(
      (item) =>
        (item.slug === category || item.name === category || String(item.id) === String(category)) &&
        post.category === item.slug
    )
  )
}

export async function getCategories() {
  await delay()
  const withCount = categories.map((category) => ({
    ...category,
    postCount: postsState.filter((post) => post.category === category.slug).length
  }))
  return { list: clone(withCount) }
}

export async function getPosts({ page = 1, pageSize = 6, category = '' } = {}) {
  await delay()
  const safePage = Math.max(1, Number(page) || 1)
  const safePageSize = Math.max(1, Number(pageSize) || 6)
  const filtered = postsState.filter((post) => matchesCategory(post, category))
  const start = (safePage - 1) * safePageSize
  const list = filtered.slice(start, start + safePageSize).map((post) => clone(toPostListItem(post)))
  return {
    list,
    total: filtered.length,
    page: safePage,
    pageSize: safePageSize
  }
}

export async function getPostDetail(id) {
  await delay()
  const post = postsState.find((item) => String(item.id) === String(id))
  if (!post) {
    throw new Error('这篇帖子可能已经被删除了')
  }
  return clone({
    ...toPostListItem(post),
    comments: Array.isArray(post.comments) ? post.comments : []
  })
}

export async function createPost(payload = {}) {
  await delay(420)
  const title = String(payload.title || '').trim()
  const content = String(payload.content || '').trim()
  const category = payload.category
  const authorName = String(payload.authorName || '').trim()

  if (!title || !content || !category || !authorName) {
    throw new Error('请填写完整的帖子内容')
  }

  const maxId = postsState.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0)
  const newPost = {
    id: maxId + 1,
    title,
    content,
    cover: cover(category, postsState.length),
    category,
    authorName,
    authorAvatar: '🐾',
    likes: 0,
    commentsCount: 0,
    comments: [],
    tags: [],
    createdAt: new Date().toISOString()
  }
  postsState.unshift(newPost)
  return clone(toPostListItem(newPost))
}

export async function likePost(id) {
  await delay(220)
  const post = postsState.find((item) => String(item.id) === String(id))
  if (!post) {
    throw new Error('这篇帖子可能已经被删除了')
  }
  post.likes = (Number(post.likes) || 0) + 1
  return { id: post.id, likes: post.likes }
}

export async function getArticles({ category = '' } = {}) {
  await delay()
  const list = articlesState
    .filter((article) => !category || article.category === category)
    .map((article) => clone(article))
  return { list, total: list.length }
}

export async function getArticleDetail(id) {
  await delay()
  const article = articlesState.find((item) => String(item.id) === String(id))
  if (!article) {
    throw new Error('这篇文章可能已经被删除了')
  }
  return clone(article)
}
