// src/components/Table.js

import React from "react";

type Item = {
  validity: boolean;
  expiration_date: string;
  issuer: string;
  subject: string;
  is_valid_for_domain: boolean;
};

const Table: React.FC<{ data: Item }> = ({ data }) => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">SSL Certificate Information</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold">Validity</td>
            <td className="px-4 py-2">{data.validity ? "Valid" : "Invalid"}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold">Expiration Date</td>
            <td className="px-4 py-2">{data.expiration_date}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold">Issuer</td>
            <td className="px-4 py-2">{data.issuer}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold">Subject</td>
            <td className="px-4 py-2">{data.subject}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold">Domain Validity</td>
            <td className="px-4 py-2">
              {data.is_valid_for_domain ? "Yes" : "No"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
