import type { TheoryDomain } from '../../ccaf-theory/types'
import { DOMAIN_1 } from './domain1'
import { DOMAIN_2 } from './domain2'
import { DOMAIN_3 } from './domain3'
import { DOMAIN_4 } from './domain4'

// Lý thuyết AI-200 (Developing AI Cloud Solutions on Azure), soạn từ bộ đề questions/ai-200.json, chia theo
// 4 category của bộ đề. Chưa có tỷ trọng chính thức nên không đặt `weight` — trang lý thuyết hiện số câu thay thế.
export const AI200_DOMAINS: TheoryDomain[] = [DOMAIN_1, DOMAIN_2, DOMAIN_3, DOMAIN_4]
