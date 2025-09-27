import { Home, FileText, Database, User } from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

export const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Postur APBD', icon: FileText, path: '/postur-apbd' },
  { name: 'Source Data', icon: Database, path: '/source' },
  { name: 'Account', icon: User, path: '/account' },
];
