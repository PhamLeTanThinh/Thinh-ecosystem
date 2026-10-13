import type { Metadata } from 'next'
import { SharedTripView } from '@/components/trips/SharedTripView'

// Trang xem qua link chia sẻ — chỉ xem, không để công cụ tìm kiếm lập chỉ mục
export const metadata: Metadata = {
  title: 'Xem quỹ chung',
  robots: { index: false, follow: false },
}

export default async function SharedTripPage({ params }: PageProps<'/trips/share/[slug]'>) {
  const { slug } = await params
  return <SharedTripView slug={slug} />
}
