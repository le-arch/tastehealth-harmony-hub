import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { T } from '@/components/T';

export const AccountTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle><T>Account Settings</T></CardTitle>
        <CardDescription><T>Manage your account settings</T></CardDescription>
      </CardHeader>
      <CardContent>
        <p><T>Account settings coming soon</T></p>
      </CardContent>
    </Card>
  );
};
