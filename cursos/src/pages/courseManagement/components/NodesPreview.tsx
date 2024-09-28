import React from "react";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

interface NodeData {
  data: {
    nodeName?: string;
    url?: string;
  };
  id: string;
}

interface NodeListProps {
  nodes: NodeData[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  courseTitle: string;
}

const NodePreviewList: React.FC<NodeListProps> = ({
  nodes,
  handleEdit,
  handleDelete,
  courseTitle,
}) => {
  const isButtonDisabled = !courseTitle || nodes.length < 3;

  return (
    <div className="w-full max-w-[28em] absolute bottom-5">
      <div className="bg-white rounded-xl w-full">
        <div className="p-3 flex justify-between">
          <h2 className="text-[1.3em]">Nodes List</h2>
          <p className="font-medium opacity-50">{nodes.length}</p>
        </div>
        <hr className="text-[#E2E2E2]" />
        <div className="p-3 flex flex-col gap-3 max-h-40 overflow-auto">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="flex items-center gap-2 justify-between"
            >
              <div className="flex flex-col">
                <p className="truncate max-w-[15em]">{node.data?.nodeName}</p>
                <p className="truncate max-w-[12em] font-medium opacity-50">
                  {node.data?.url}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  onClick={() => handleEdit(node.id)}
                  className="bg-[#215A4F] px-4 rounded-md py-1 text-white font-medium cursor-pointer"
                >
                  Edit
                </div>
                <div
                  onClick={() => handleDelete(node.id)}
                  className="rounded-full p-1 bg-[#F7CDCD] text-[#D60707] cursor-pointer"
                  style={{ border: "1px solid #D60707" }}
                >
                  <Icon path={mdiClose} size={0.5} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodePreviewList;
