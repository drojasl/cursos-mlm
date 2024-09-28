import React, { useState, useEffect } from "react";
import axios from "../../../../axiosConfig";

interface CodesListProps {
  refresh: boolean;
}

const CodesList: React.FC<CodesListProps> = ({ refresh }) => {
  const [codes, setCodes] = useState<any>([]);

  useEffect(() => {
    fetchCodes();
  }, [refresh]);

  const fetchCodes = async () => {
    try {
      const response = await axios.get("/getUserCodes", {
        params: { userId: 1 },
      });

      if (response.data.codes) {
        setCodes(response.data.codes);
      }
    } catch (error) {
      console.error("Error fetching codes:", error);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const handleDelete = async (codeId: number) => {
    try {
      await axios.post("/deleteAccessCode", {
        id: codeId,
      });
      fetchCodes();
    } catch (error) {
      console.error("Error deleting the code:", error);
    }
  };

  return (
    <div className="w-full bg-white h-fit rounded-xl">
      <div className="p-3">
        <h2 className="text-xl font-bold">Codes List</h2>
      </div>
      <hr className="border-gray-200" />
      <div className="p-3 grid grid-cols-12 opacity-50">
        <div className="col-span-2">
          <p>Code</p>
        </div>
        <div className="col-span-1 text-center">
          <p>Used Count</p>
        </div>
        <div className="col-span-1 text-center">
          <p>Used Limit</p>
        </div>
        <div className="col-span-2 text-center">
          <p>Created at</p>
        </div>
        <div className="col-span-3 text-center">
          <p>Target</p>
        </div>
        <div className="col-span-3 text-end">
          <p>Actions</p>
        </div>
      </div>
      {codes.length > 0 ? (
        codes.map((code: any) => (
          <div className="p-3 grid grid-cols-12" key={code?.id}>
            <div className="col-span-2">
              <p>{code?.code}</p>
            </div>
            <div className="col-span-1 text-center">
              <p>{code?.usedCount}</p>
            </div>
            <div className="col-span-1 text-center">
              <p>{code?.codeLimit}</p>
            </div>
            <div className="col-span-2 text-center">
              <p>{code?.createdAt}</p>
            </div>
            <div className="col-span-3 text-center">
              <p>{code?.pathTitle}</p>
            </div>
            <div className="col-span-3 justify-end items-center flex gap-2">
              <button
                type="button"
                className="bg-[#215A4F] rounded-lg py-2 px-4 text-white"
                onClick={() => handleCopy(code?.code)}
              >
                Copy Code
              </button>
              <button
                type="button"
                className="bg-[#D60707] rounded-lg py-2 px-4 text-[#D60707] bg-opacity-20"
                style={{ border: "1px solid #D60707" }}
                onClick={() => handleDelete(code?.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full items-center text-center justify-center py-5">
          <p>No codes available.</p>
        </div>
      )}
    </div>
  );
};

export default CodesList;
