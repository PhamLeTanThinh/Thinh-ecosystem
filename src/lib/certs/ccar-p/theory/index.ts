import type { TheoryDomain } from '../../ccaf-theory/types'
import { DOMAIN_1 } from './domain1'
import { DOMAIN_2 } from './domain2'
import { DOMAIN_3 } from './domain3'
import { DOMAIN_4 } from './domain4'
import { DOMAIN_5 } from './domain5'
import { DOMAIN_6 } from './domain6'
import { DOMAIN_7 } from './domain7'

// Lý thuyết CCAR-P (Claude Certified Architect — Professional), soạn từ bộ đề questions/ccar-p.json, chia theo
// 7 category của bộ đề. Chưa có tỷ trọng chính thức nên không đặt `weight` — trang lý thuyết hiện số câu thay thế.
export const CCARP_DOMAINS: TheoryDomain[] = [DOMAIN_1, DOMAIN_2, DOMAIN_3, DOMAIN_4, DOMAIN_5, DOMAIN_6, DOMAIN_7]
