import React from "react";

const ShimmerTable: React.FC = () => {
  return (
    <div className="animate-pulse max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">
        <div className="h-6 bg-gray-200 rounded w-72"></div>
      </h2>
      <table className="min-w-full bg-white border border-gray-200">
        <tbody>
          {Array(5)
            .fill("")
            .map((_, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShimmerTable;
