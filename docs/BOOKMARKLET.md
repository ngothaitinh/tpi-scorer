# Bookmarklet — Nhập bài từ Elementor Preview

## Cách dùng

1. Copy đoạn code dưới (toàn bộ `javascript:...`)
2. Tạo bookmark mới trong Chrome/Edge, dán vào ô URL
3. Khi muốn chấm bài: mở **Elementor Preview** của bài viết, bấm bookmark

## Bookmarklet code

```
javascript:(function(){var SCORER='https://tpi-scorer.netlify.app';var root=document.querySelector('[data-elementor-type="wp-post"]')||document.querySelector('.elementor')||document.querySelector('article')||document.querySelector('main')||document.body;var nodes=root.querySelectorAll('h1,h2,h3,h4,p,li,blockquote');var md=[];nodes.forEach(function(el){var tag=el.tagName.toLowerCase();var txt=(el.innerText||el.textContent||'').trim().replace(/\s+/g,' ');if(!txt)return;if(tag==='h1')md.push('# '+txt);else if(tag==='h2')md.push('## '+txt);else if(tag==='h3')md.push('### '+txt);else if(tag==='h4')md.push('#### '+txt);else if(tag==='li')md.push('- '+txt);else if(tag==='blockquote')md.push('> '+txt);else md.push(txt);});var out=md.join('\n');if(!out){alert('Không tìm thấy nội dung bài. Hãy mở Elementor Preview trước.');return;}var url=SCORER+'/#import='+encodeURIComponent(out);window.open(url,'_blank');})();
```

## Lưu ý

- **Phải là Elementor Preview** (nút Preview ở góc dưới Elementor editor, không phải WordPress Preview)
- URL `SCORER` trong bookmarklet cần khớp với domain deploy thật
- Nếu bài > 20.000 ký tự, hash URL có thể quá dài → bookmarklet tự cắt 15.000 ký tự đầu (đủ để chấm)

## Tuỳ chỉnh domain

Đổi dòng `var SCORER='https://tpi-scorer.netlify.app'` thành URL deploy của bạn.

## Version với auto-truncate (recommended cho bài dài)

```
javascript:(function(){var SCORER='https://tpi-scorer.netlify.app';var MAX=15000;var root=document.querySelector('[data-elementor-type="wp-post"]')||document.querySelector('.elementor')||document.querySelector('article')||document.querySelector('main')||document.body;var nodes=root.querySelectorAll('h1,h2,h3,h4,p,li,blockquote');var md=[];nodes.forEach(function(el){var tag=el.tagName.toLowerCase();var txt=(el.innerText||el.textContent||'').trim().replace(/\s+/g,' ');if(!txt)return;if(tag==='h1')md.push('# '+txt);else if(tag==='h2')md.push('## '+txt);else if(tag==='h3')md.push('### '+txt);else if(tag==='h4')md.push('#### '+txt);else if(tag==='li')md.push('- '+txt);else if(tag==='blockquote')md.push('> '+txt);else md.push(txt);});var out=md.join('\n').slice(0,MAX);if(!out){alert('Không tìm thấy nội dung bài. Hãy mở Elementor Preview trước.');return;}var url=SCORER+'/#import='+encodeURIComponent(out);window.open(url,'_blank');})();
```
