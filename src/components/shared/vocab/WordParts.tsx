import type { WordPart } from './parts'
import './word-parts.css'

// Khối "Cấu tạo từ": các thành phần nối bằng dấu +, mỗi thành phần có chữ Hán / pinyin, âm Hán Việt và nghĩa.
// Dùng trong thẻ lớn (VocabStudy) và màn kết quả của luyện gõ — màu lấy theo biến của nơi chứa nếu có.
export function WordParts({ parts, lang, className }: { parts: WordPart[]; lang: string; className?: string }) {
  return (
    <div className={`wp${className ? ` ${className}` : ''}`}>
      <span className="wp-label">Cấu tạo từ</span>
      <div className="wp-row">
        {parts.map((pt, i) => (
          <div key={i} className="wp-item">
            {i > 0 && (
              <span className="wp-plus" aria-hidden="true">
                +
              </span>
            )}
            <div className="wp-part">
              <span className="wp-p" lang={lang}>
                {pt.p}
              </span>
              {(pt.h || pt.py) && (
                <span className="wp-sub">
                  {pt.h && <span lang="zh">{pt.h}</span>}
                  {pt.h && pt.py && ' · '}
                  {pt.py}
                </span>
              )}
              {pt.hv && <span className="wp-hv">{pt.hv}</span>}
              <span className="wp-m">{pt.m}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
