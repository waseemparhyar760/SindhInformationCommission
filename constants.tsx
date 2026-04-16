
import React from 'react';
import { Home, FileWarning, BookOpen, Users, BarChart3, Info, AlertCircle, Briefcase, Search, DollarSign, Building, Bell } from 'lucide-react';
import { AppView } from './types.ts';

export interface DepartmentDetail {
  name: string;
  address: string;
  pio: {
    name: string;
    designation: string;
    address: string;
  };
  hod: {
    name: string;
    designation: string;
    address: string;
  };
}

export const DEPARTMENTS_DATA: DepartmentDetail[] = [
  {
    name: "Education & Literacy",
    address: "1st Floor, Tughlaq House, Sindh Secretariat, Karachi",
    pio: {
      name: "Mr. Abdul Aziz",
      designation: "Assistant Director (Admn)",
      address: "Ground Floor, Sindh Secretariat No. 2, Karachi"
    },
    hod: {
      name: "Mr. Zahid Ali Abbasi",
      designation: "Secretary Education",
      address: "1st Floor, Tughlaq House, Sindh Secretariat, Karachi"
    }
  },
  {
    name: "Health Department",
    address: "6th Floor, Sindh Secretariat No. 1, Karachi",
    pio: {
      name: "Dr. Muhammad Irfan",
      designation: "Section Officer (General)",
      address: "Room 402, 6th Floor, Sindh Secretariat No. 1, Karachi"
    },
    hod: {
      name: "Dr. Mansoor Abbas Rizvi",
      designation: "Secretary Health",
      address: "6th Floor, Sindh Secretariat No. 1, Karachi"
    }
  },
  {
    name: "Information & Archives",
    address: "2nd Floor, Sindh Secretariat No. 4-B, Court Road, Karachi",
    pio: {
      name: "Mr. Mansoor Ahmed Mahar",
      designation: "Director (Admn & Accounts)",
      address: "Block 95-96, Sindh Secretariat, Karachi"
    },
    hod: {
      name: "Mr. Nadeem Memon",
      designation: "Secretary Information",
      address: "2nd Floor, Sindh Secretariat No. 4-B, Court Road, Karachi"
    }
  },
  {
    name: "Finance Department",
    address: "Ground Floor, Tughlaq House, Sindh Secretariat, Karachi",
    pio: {
      name: "Mr. Taufique Ahmed",
      designation: "Deputy Secretary (Admn)",
      address: "Room 10, Tughlaq House, Sindh Secretariat, Karachi"
    },
    hod: {
      name: "Mr. Fayyaz Ahmed Jatoi",
      designation: "Secretary Finance",
      address: "Ground Floor, Tughlaq House, Sindh Secretariat, Karachi"
    }
  },
  {
    name: "Home Department",
    address: "Ground Floor, Sindh Secretariat No. 2, Karachi",
    pio: {
      name: "Mr. Shahzad Pervez",
      designation: "Additional Secretary (Admn)",
      address: "Sindh Secretariat No. 2, Karachi"
    },
    hod: {
      name: "Mr. Iqbal Memon",
      designation: "Additional Chief Secretary Home",
      address: "Sindh Secretariat No. 2, Karachi"
    }
  }
];

export const DEPARTMENTS = DEPARTMENTS_DATA.map(d => d.name);

export const NAV_ITEMS = [
  { id: AppView.HOME, label: 'Home', icon: <Home size={20} /> },
  { id: AppView.NOTIFICATIONS, label: 'Notifications', icon: <Bell size={20} /> },
  { id: AppView.FILE_COMPLAINT, label: 'File Complaint', icon: <AlertCircle size={20} /> },
  { id: AppView.TRACK_COMPLAINT, label: 'Track Complaint', icon: <Search size={20} /> },
  { id: AppView.INFO_DESK, label: 'Info Desk', icon: <Info size={20} /> },
  { id: AppView.STATISTICS, label: 'Statistics', icon: <BarChart3 size={20} /> },
  { id: AppView.RESOURCES, label: 'Laws & Resources', icon: <BookOpen size={20} /> },
  { id: AppView.STAFF, label: 'Staff', icon: <Users size={20} /> },
  { id: AppView.CAREERS, label: 'Careers', icon: <Briefcase size={20} /> },
  { id: AppView.BUDGET, label: 'Budget', icon: <DollarSign size={20} /> },
  { id: AppView.ABOUT, label: 'About Us', icon: <Building size={20} /> }
];

export const COLORS = {
  primary: '#1e3a8a', // Blue-900 (Navy)
  secondary: '#1e40af',
  accent: '#fbbf24', // Amber-400
};
