import React, { useMemo } from "react";
import Icon from "@mdi/react";
import { mdiVideoInputAntenna } from "@mdi/js";
import { Selector } from "@/components/Selector";

interface NodeFormProps {
  nodeName: string;
  setNodeName: (value: string) => void;
  nodeUrl: string;
  setNodeUrl: (value: string) => void;
  videoSpeed: string;
  videoSpeedOptions: { text: string; value: string }[];
  handleSelect: (value: string) => void;
  handleAddNode: () => void;
  isEditing?: boolean;
  handleEditNode?: () => void;
}

const NodeForm: React.FC<NodeFormProps> = ({
  nodeName,
  setNodeName,
  nodeUrl,
  setNodeUrl,
  videoSpeed,
  videoSpeedOptions,
  handleSelect,
  handleAddNode,
  isEditing = false,
  handleEditNode,
}) => {
  const isFormValid = useMemo(() => {
    return nodeName.trim() !== "" && nodeUrl.trim() !== "" && videoSpeed !== "";
  }, [nodeName, nodeUrl, videoSpeed]);

  return (
    <div className="w-full max-w-[28em]">
      <div className="bg-white rounded-xl w-full shadow-lg">
        <div className="p-3">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Node" : "New Node"}
          </h2>
        </div>
        <hr className="border-gray-200" />
        <div className="p-3 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="nodeName" className="text-gray-700 font-medium">
              Name
            </label>
            <input
              type="text"
              id="nodeName"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="border rounded-lg p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="nodeUrl" className="text-gray-700 font-medium">
              URL
            </label>
            <input
              type="text"
              id="nodeUrl"
              value={nodeUrl}
              onChange={(e) => setNodeUrl(e.target.value)}
              className="border rounded-lg p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-medium">Preview</p>
            <div className="bg-[#F6F7F9] w-full h-[10vw] rounded-lg flex items-center justify-center overflow-hidden">
              {nodeUrl ? (
                <iframe
                  src={`https://www.youtube.com/embed/${nodeUrl}&controls=0&rel=0&showinfo=0&autoplay=1`}
                  className="w-full h-full object-cover"
                  onError={(e) => console.error("Error loading video:", e)}
                />
              ) : (
                <Icon
                  path={mdiVideoInputAntenna}
                  size={2}
                  className="opacity-20"
                />
              )}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label
              htmlFor="nodeVideoSpeed"
              className="text-gray-700 font-medium whitespace-nowrap"
            >
              Video Speed
            </label>
            <Selector
              options={videoSpeedOptions}
              onSelect={(value) => handleSelect(value)}
              selectValue={"value"}
              selectText={"text"}
            />
          </div>
          <button
            type="button"
            className={`bg-black rounded-lg p-2 text-white mt-4 ${
              isFormValid ? "" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={isEditing ? handleEditNode : handleAddNode}
            disabled={!isFormValid}
          >
            {isEditing ? "Save Changes" : "Add Node"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeForm;
