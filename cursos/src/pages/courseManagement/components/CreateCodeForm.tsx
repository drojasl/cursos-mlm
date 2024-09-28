import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiContentCopy, mdiAutorenew } from "@mdi/js";
import { Selector } from "@/components/Selector";
import { SelectorAdder } from "@/components/SelectorAdder";
import axios from "../../../../axiosConfig";

interface CreateCodeFormProps {
  courses: { id: string; title: string }[];
  onCodeAdded: () => void;
}

const codeOptions = [
  { value: "generateCode", title: "Generate a code" },
  { value: "customizedCode", title: "Customize code" },
];

const generateRandomCode = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let code = "";

  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  for (let i = 0; i < 4; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return code
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

const CreateCodeForm: React.FC<CreateCodeFormProps> = ({
  courses,
  onCodeAdded,
}) => {
  const [code, setCode] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [codeLimit, setCodeLimit] = useState<number>(1);
  const [codeType, setCodeType] = useState<string>(codeOptions[0].value);
  const [customCodes, setCustomCodes] = useState<any>([]);
  const [codeCustom, setCodeCustom] = useState<string>("");
  const [codeNumberCustom, setCodeNumberCustom] = useState<string>("");

  useEffect(() => {
    fetchUniqueCode();
  }, []);

  useEffect(() => {
    setIsFormValid(!!code && !!selectedCourse && codeLimit > 0);
  }, [code, selectedCourse, codeLimit]);

  const fetchUniqueCode = async () => {
    let unique = false;
    let newCode = "";
    let attempts = 0;

    while (!unique && attempts < 5) {
      newCode = generateRandomCode();
      try {
        const response = await axios.post("/checkAccessCode", {
          code: newCode,
        });
        if (response.data.isUnique) {
          unique = true;
        }
      } catch (error) {
        console.error("Error checking access code:", error);
      }
      attempts++;
    }

    if (unique) {
      setCode(newCode);
    } else {
      console.error(
        "Failed to generate a unique code after multiple attempts."
      );
    }
  };

  const handleGenerateNewCode = async () => {
    await fetchUniqueCode();
  };

  const handleSelectCodeType = async (value: string) => {
    if (value === "customizedCode") {
      try {
        const response = await axios.post("/getCustomCodes", {
          userId: 1,
        });

        if (response.data.success) {
          setCustomCodes(response.data.codes);
        } else {
          console.error("No codes found:", response.data.message);
          setCustomCodes([]);
        }
      } catch (error) {
        console.error("Error retrieving custom codes:", error);
        setCustomCodes([]);
      }
    } else {
      handleGenerateNewCode();
    }
    setCodeType(value);
  };

  const handleSelectCourse = (value: string) => {
    setSelectedCourse(value);
  };

  const handleAddCode = async () => {
    if (isFormValid) {
      try {
        await axios.post("/addAccessCode", {
          userId: 1,
          code,
          pathId: selectedCourse,
          codeLimit,
        });
        onCodeAdded();
        setCode("");
        setSelectedCourse("");
        setCodeLimit(1);
      } catch (error) {
        console.error("Error adding the code:", error);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleAddNewCode = async (newCode: string) => {
    try {
      const response = await axios.post("/addCustomCode", {
        userId: 1,
        code: newCode,
      });

      if (response.data.success) {
        const newCodeData = response.data.code;

        if (newCodeData) {
          setCustomCodes((prevCodes: any[]) => [...prevCodes, newCodeData]);
        } else {
          console.error(
            "El nuevo código no tiene la estructura esperada:",
            newCodeData
          );
        }
      } else {
        console.error("Error adding the custom code:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding the custom code:", error);
    }
  };

  const handleSelectCustomCode = (code: string) => {
    setCodeCustom(code);
  };

  const handleCodeNumberChange = (e: any) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 3) {
      setCodeNumberCustom(value);
    }
  };

  useEffect(() => {
    setCode(codeCustom + codeNumberCustom);
  }, [codeCustom, codeNumberCustom]);

  const deleteCustomCode = async (id: string) => {
    try {
      const response = await axios.post("/deleteCustomCode", {
        userId: 1,
        code: id,
      });

      if (response.data.success) {
        setCustomCodes((prevCodes: any[]) =>
          prevCodes.filter((code) => code.id !== id)
        );
      } else {
        console.error("Error deleting the custom code:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting the custom code:", error);
    }
  };

  return (
    <div className="w-full max-w-[28em] bg-white h-fit rounded-xl">
      <div className="p-3">
        <h2 className="text-xl font-bold">New Code</h2>
      </div>
      <hr className="border-gray-200" />
      <div className="p-3 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between items-center gap-4">
            <label
              htmlFor="codeGenerator"
              className="text-gray-700 font-medium"
            >
              Code
            </label>
            <Selector
              options={codeOptions}
              onSelect={handleSelectCodeType}
              selectValue={"value"}
              selectText={"title"}
              border={false}
              defaultValue={codeOptions[0].value}
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            {codeType !== "generateCode" && (
              <div className="flex items-center w-full">
                <SelectorAdder
                  options={customCodes}
                  selectText={"code"}
                  selectValue={"id"}
                  onSelect={handleSelectCustomCode}
                  handleAddNewCode={handleAddNewCode}
                  handleDelete={deleteCustomCode}
                  maxLength={4}
                  caseType={"upper"}
                />

                <input
                  type="text"
                  min={0}
                  id="codeGenerator"
                  value={codeNumberCustom}
                  onChange={handleCodeNumberChange}
                  className="border rounded-lg p-2 w-full flex text-center justify-center"
                />
              </div>
            )}
            {codeType === "generateCode" && (
              <>
                <div className="flex items-center w-full gap-2">
                  <input
                    type="text"
                    id="codeGenerator"
                    value={code}
                    readOnly
                    disabled
                    className="border rounded-lg p-2 w-full flex text-center justify-center"
                  />
                  <div
                    className="p-2 bg-[#215A4F] rounded-md text-white cursor-pointer"
                    onClick={() => handleCopy()}
                  >
                    <Icon path={mdiContentCopy} size={0.6} />
                  </div>
                  <div
                    className="p-2 bg-black rounded-md text-white cursor-pointer"
                    onClick={handleGenerateNewCode}
                  >
                    <Icon path={mdiAutorenew} size={0.6} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="nodeVideoSpeed"
            className="text-gray-700 font-medium whitespace-nowrap"
          >
            Target
          </label>
          <Selector
            options={courses}
            onSelect={handleSelectCourse}
            selectValue={"id"}
            selectText={"title"}
          />
        </div>
        <div className="flex gap-2 items-center">
          <label
            htmlFor="codeLimit"
            className="text-gray-700 font-medium whitespace-nowrap"
          >
            Use Limit
          </label>
          <input
            type="number"
            min={1}
            id="codeLimit"
            value={codeLimit}
            onChange={(e) => setCodeLimit(Number(e.target.value))}
            className="border rounded-lg p-2 w-full flex text-center justify-center"
          />
        </div>
        <button
          type="button"
          className={`bg-black rounded-lg p-2 text-white mt-4 ${
            isFormValid ? "" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleAddCode}
          disabled={!isFormValid}
        >
          Add Code
        </button>
      </div>
    </div>
  );
};

export default CreateCodeForm;
