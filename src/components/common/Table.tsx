import React from 'react';

interface TableProps {
  columns: { key: string; label: string }[];
  data: Record<string, unknown>[];
  actions?: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ columns, data, actions }) => (
  <table className="w-full text-left border bg-white text-black">
    <thead>
      <tr className="bg-gray-100">
        {columns.map(col => (
          <th key={col.key} className="p-2 text-black">{col.label}</th>
        ))}
        {actions && <th className="p-2"></th>}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i} className="border-t">
          {columns.map(col => (
            <td key={col.key} className="p-2 text-black">{row[col.key] as React.ReactNode}</td>
          ))}
          {actions && <td className="p-2">{actions}</td>}
        </tr>
      ))}
    </tbody>
  </table>
); 