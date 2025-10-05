// src/utils/translatePage.ts
type TextNodeWithOriginal = { node: Node; original: string };

// 儲存原文的陣列
let originalTextNodes: TextNodeWithOriginal[] = [];
// cache: key = 原文, value = 翻譯
let cachedTranslations: Record<string, string> = {};

// 逐個 node 翻譯並儲存到 cache
export async function preloadTranslate(sl: string = "en", tl: string = "zh-CN"): Promise<void> {
  const elements = document.querySelectorAll("body *:not(script):not(style)");

  const textNodes: ChildNode[] = [];
  elements.forEach((el) => {
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== "") {
        textNodes.push(node);
        if (!originalTextNodes.find((item) => item.node === node)) {
          originalTextNodes.push({ node, original: node.nodeValue! });
        }
      }
    });
  });

  try {
    // 逐個 node 翻譯
    const promises = textNodes.map(async (node) => {
      const text = node.nodeValue!;
      if (cachedTranslations[text]) return; // 已經有 cache 就跳過
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      cachedTranslations[text] = data[0][0][0];
    });

    await Promise.all(promises);
    console.log("Cache loaded:", cachedTranslations);
  } catch (err) {
    console.error("Translation preload failed:", err);
  }
}

// 使用 cache 翻譯全頁
export function translatePage(): void {
  originalTextNodes.forEach((item) => {
    const cached = cachedTranslations[item.original];
    if (cached) {
      item.node.nodeValue = cached;
    }
  });
}

// 還原原文
export function revertPage(): void {
  originalTextNodes.forEach((item) => {
    item.node.nodeValue = item.original;
  });
}
