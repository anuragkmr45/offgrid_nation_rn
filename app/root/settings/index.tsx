// app/settings/index.tsx

import ProtectedLayout from '@/components/layouts/ProtectedLayout'
import { SettingsScreen } from '@/components/settings/SettingsScreen'
import React from 'react'

export default function SettingsRoute() {
  return <ProtectedLayout><SettingsScreen /></ProtectedLayout>
}
