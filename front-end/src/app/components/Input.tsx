"use client";
import React, { useState } from "react";
import axios from "axios";
import { IoMdArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import ShimmerTable from "./ShimmerTable";
import Table from "./Table";
const Input: React.FC = () => {
  const [domain, setDomain] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  console.log(data);

  const domainNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  const validateDomainName = () => {
    const urlRegex = /^www\.[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    return urlRegex.test(domain);
  };

  const checkSSLCertificate = () => {
    if (!domain) {
      setData(null);
      return toast.info("Please enter domain name");
    }

    if (validateDomainName()) {
      setData(null);
      fetchData();
    } else {
      toast.error("Invalid domain name");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/check_ssl", {
        domain: domain,
      });

      if (response.status == 200) {
        setData(response.data);
        toast.success("successfully get data");
      } else {
        setData([]);
        toast.info(response.data);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      toast.error("Something went wrong in request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-[700px] mx-auto border border-[#609CEC] rounded-lg mt-5">
        <div className="bg-[#609CEC] text-white  py-2 px-4 rounded-t-lg">
          Server Hostname
        </div>
        <div className="p-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="www.google.com"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
            value={domain}
            onChange={domainNameInput}
          />
          <button
            onClick={checkSSLCertificate}
            className="bg-[#609CEC] w-[150px] text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            Check SSL <IoMdArrowForward className="ml-1" />
          </button>
        </div>
      </div>

      {loading && <ShimmerTable />}

      {data && <Table data={data} />}
    </>
  );
};

export default Input;
