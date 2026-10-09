import ApprovalReview from './ApprovalReview';

export const dynamic = 'force-dynamic';

export default async function ValidationPage({ searchParams }) {
  const { token = '' } = await searchParams;
  return <ApprovalReview token={token} />;
}
