import { IeltsPlainShell } from '@/components/ielts/IeltsShell'
import { SkillLanding } from '@/components/ielts/SkillLanding'

// Màn chọn kỹ năng. Từng kỹ năng có khu riêng (menu trái: Kiến thức / Làm đề / Vocab) ở /ielts/<skill>.
export default function IeltsHomePage() {
  return (
    <IeltsPlainShell trail={[]}>
      <SkillLanding />
    </IeltsPlainShell>
  )
}
