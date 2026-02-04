function lazyImage(post) {
    var content = post.content.toString();
    var imgRe = /<img.*?\ssrc=[\'\"]\S+[\'\"]\s.*?>/gim;
    var urlRe = /(http:|https:|\/|\.)\S+(?="\s)/i;
    var imgUrlsArr = content.match(imgRe);
    var data = [];
    imgUrlsArr && imgUrlsArr.forEach(function(item) {
        data.push(item.match(urlRe)[0]);
    });
    return data;
}

/**
 * 解码常见 HTML 实体，避免摘要中显示 &#39;、&#x27; 等原始实体
 */
function decodeHtmlEntities(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/gi, "'")
        .replace(/&apos;/gi, "'")
        .replace(/&quot;/g, '"')
        .replace(/&#34;/g, '"')
        .replace(/&#x22;/gi, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

/**
 * 移除内容中的代码块，避免摘要中出现代码行号拼接成的数字串
 */
function stripCodeBlocks(content) {
    if (!content || typeof content !== 'string') return '';
    return content
        .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
        .replace(/<code[\s\S]*?<\/code>/gi, ' ');
}

hexo.extend.helper.register('lazyImage', lazyImage);
hexo.extend.helper.register('decodeHtmlEntities', decodeHtmlEntities);
hexo.extend.helper.register('stripCodeBlocks', stripCodeBlocks);