import { Handle, Position } from "@xyflow/react";
import Icon from "@mdi/react";
import { mdiResizeBottomRight } from "@mdi/js";

interface NodeData {
  nodeName?: string;
  videoSpeed?: string;
  id?: string;
  isFirstNode?: boolean;
}

interface NodeProps {
  data: NodeData;
  isConnectable: boolean;
}

function Node({ data, isConnectable }: NodeProps) {
  const {
    nodeName = "Default Node",
    videoSpeed = "1.0",
    id = "N/A",
    isFirstNode = false,
  } = data;

  return (
    <div>
      <div className="relative">
        {isFirstNode && (
          <div className="bg-white text-[#CCCCCC] rounded-full py-1 px-2 w-fit z-[100] mb-2">
            STARTING NODE
          </div>
        )}
      </div>
      <div className="text-updater-node">
        {!isFirstNode && (
          <Handle
            type="source"
            position={Position.Top}
            id={`source-${id}-top`}
            isConnectable={isConnectable}
          />
        )}
        <div
          className="bg-[#E0E0F9] text-black relative py-3 px-4 rounded-lg w-fit min-w-[17em] shadow-md"
          style={{ border: "2px solid #675FFC", maxWidth: "300px" }}
        >
          <Icon
            path={mdiResizeBottomRight}
            size={1}
            className="absolute top-1 right-1 transform scale-y-[-1]"
          />
          <p className="text-[1.2em] truncate">{nodeName}</p>{" "}
          <div className="flex items-center justify-between opacity-40">
            <p>{videoSpeed}</p>
            <p>ID: {id}</p>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          id={`source-${id}-bottom`}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Left}
          id={`source-${id}-left`}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          id={`source-${id}-right`}
          isConnectable={isConnectable}
        />
      </div>
    </div>
  );
}

export default Node;
