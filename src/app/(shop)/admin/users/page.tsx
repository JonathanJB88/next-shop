import { redirect } from 'next/navigation';

import { Pagination, Title } from '@/components';
import { getPaginatedUsers } from '@/actions';

import { UsersTable } from './ui/UsersTable';

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { ok, users = [], totalPages = 1 } = await getPaginatedUsers({ page });

  if (!ok) redirect('/auth/login');

  return (
    <>
      <Title title='Admin All Users' />

      <div className='mb-10'>
        <UsersTable users={users} />

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
