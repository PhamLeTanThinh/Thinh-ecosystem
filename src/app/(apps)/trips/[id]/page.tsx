import { TripDetail } from '@/components/trips/TripDetail'

export default async function TripDetailPage({ params }: PageProps<'/trips/[id]'>) {
  const { id } = await params
  return <TripDetail id={id} />
}
