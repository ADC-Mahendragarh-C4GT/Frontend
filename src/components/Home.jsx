import React from 'react';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';

const data = [
  {
    roadNumber: 'BBS921',
    roadName: 'Palika Bazar Road',
    work: 'CC Road Const.....',
    contractor: 'Rajesh Choudhary',
    startDate: '10/12/2024',
    workCompleted: '50%'
  },
  {
    roadNumber: 'BBS542',
    roadName: 'Appu Ghar Market',
    work: 'Pipeline work',
    contractor: 'Om Prakash',
    startDate: '10/12/2024',
    workCompleted: '80%'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <img src="/logo.png" alt="Logo" className="h-12" />
        <h1 className="text-3xl font-bold text-center flex-grow -ml-12">Municipal Corporation Rohtak</h1>
        <img src="/azadi.png" alt="Azadi Ka Amrit Mahotsav" className="h-14" />
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative w-1/3">
          <Input placeholder="Enter Road Name/Unique Number" className="pr-10" />
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative w-1/3">
          <Input placeholder="Enter Contractor Name" className="pr-10" />
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative w-1/3">
          <Input placeholder="Enter Date" className="pr-10" />
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <table className="w-full border border-black">
        <thead>
          <tr className="bg-gray-200 text-black text-left">
            <th className="border border-black px-2 py-1">S. No.</th>
            <th className="border border-black px-2 py-1">Road Number</th>
            <th className="border border-black px-2 py-1">Road Name</th>
            <th className="border border-black px-2 py-1">Work</th>
            <th className="border border-black px-2 py-1">Contractor</th>
            <th className="border border-black px-2 py-1">Start Date</th>
            <th className="border border-black px-2 py-1">Work Completed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border border-black px-2 py-1">{index + 1}</td>
              <td className="border border-black px-2 py-1">{row.roadNumber}</td>
              <td className="border border-black px-2 py-1">{row.roadName}</td>
              <td className="border border-black px-2 py-1 text-blue-500 underline cursor-pointer">
                {row.work}
              </td>
              <td className="border border-black px-2 py-1">{row.contractor}</td>
              <td className="border border-black px-2 py-1">{row.startDate}</td>
              <td className="border border-black px-2 py-1">{row.workCompleted}</td>
            </tr>
          ))}
          {[...Array(7)].map((_, i) => (
            <tr key={`empty-${i}`}>
              <td className="border border-black px-2 py-1">{data.length + i + 1}</td>
              <td className="border border-black px-2 py-1"></td>
              <td className="border border-black px-2 py-1"></td>
              <td className="border border-black px-2 py-1"></td>
              <td className="border border-black px-2 py-1"></td>
              <td className="border border-black px-2 py-1"></td>
              <td className="border border-black px-2 py-1"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
