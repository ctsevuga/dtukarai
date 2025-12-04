import React from 'react';
import RoleGuard from './RoleGuard';

const ClientRoute = ({ user, children }) => (
  <RoleGuard user={user} allowedRoles={['client']}>
    {children}
  </RoleGuard>
);

export default ClientRoute;