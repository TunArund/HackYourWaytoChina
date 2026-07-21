# TODO
## i18n文件结构
扁平化键污染顶层命名空间

// 不一致：有些是嵌套的
"city": {
  "beijing": {...}
}

// 有些是扁平的（直接在顶层）
"city.beijing.desc": "...",
"city.beijing.flag": "...",
"city.beijing.name": "...",
"shop.beijing.desc": "..."
这导致顶层有 100+ 个键，难以维护。
全面重构（推荐，但工作量大）

{
  "app": {...},
  "slides": {
    "s1": {...},
    "s2": {...}
  },
  "entities": {
    "cities": {
      "beijing": {
        "name": "Beijing",
        "desc": "...",
        "tag": "...",
        "flag": "beijing"
      }
    },
    "shops": {...},
    "clinics": {...}
  }
}
## content—plan和roadmap有些重复
## BROWSE按钮统一为EXPAND
## 内容如何修改？
细致化问题如何解决？如果添加/修改内容，多语言支持会不会很麻烦fallback to en?
不要一股脑填写research，要自主思考：一个外国人，如何一步步来中国看牙 走一遍流程，跟着流程填写content
网页目前没有图片？如何图文并茂？