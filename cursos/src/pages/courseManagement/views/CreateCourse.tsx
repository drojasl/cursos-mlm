import { useState, useRef, useCallback, useEffect } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  ConnectionMode,
  Edge as RFEdge,
} from "@xyflow/react";
import Node from "../components/Node";
import NodeForm from "../components/NodeForm";
import NodePreviewList from "../components/NodesPreview";
import "@xyflow/react/dist/style.css";
import "../styles.css";
import axios from "../../../../axiosConfig";
import { useParams } from "react-router-dom";

interface EdgeType extends RFEdge {}

const nodeTypes = {
  textUpdater: Node,
};

const videoSpeedOptions = [
  { text: "1.0x", value: "1.0" },
  { text: "1.25x", value: "1.25" },
  { text: "1.5x", value: "1.5" },
];

const CreateCourse = ({ mode }: { mode: "create" | "edit" }) => {
  const edgeReconnectSuccessful = useRef(true);

  const { id } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges] = useEdgesState<EdgeType>([]);
  const [nodeName, setNodeName] = useState("");
  const [nodeUrl, setNodeUrl] = useState("");
  const [videoSpeed, setVideoSpeed] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [updatedCourseTitle, setUpdatedCourseTitle] = useState("");
  const [buttonText, setButtonText] = useState("Create Course");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isCourseCreated, setIsCourseCreated] = useState(false);
  const [pathId, setPathId] = useState<number | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchCourseData(id);
    }
  }, [mode, id]);

  const fetchCourseData = async (courseId: string) => {
    try {
      const response = await axios.get(`/getCourse/${courseId}`);
      if (response.data.success) {
        const { course } = response.data;
        const { nodes } = course;

        setCourseTitle(course.title);
        setPathId(course.path_id);
        setUpdatedCourseTitle(course.title);

        const nodesWithPosition = nodes.map((node: any) => ({
          id: node.id.toString(),
          position: { x: node.position_x, y: node.position_y },
          data: {
            nodeName: node.title,
            url: node.url,
            id: node.id,
            videoSpeed: node.speed,
          },
          type: "textUpdater",
        }));

        setNodes(nodesWithPosition);

        let params: any = [];

        nodes.forEach((node: any) => {
          node.connections.forEach((connection: any) => {
            params.push({
              source: node.id.toString(),
              target: connection.node_target_id.toString(),
              sourceHandle: `source-${node.id.toString()}-${connection?.source?.toString()}`,
              targetHandle: `source-${connection.node_target_id.toString()}-${connection?.target?.toString()}`,
            });
          });
        });

        params.map((param: any) => {
          setEdges((eds) => addEdge(param, eds));
        });

        setIsCourseCreated(true);
        setButtonText("Update Title");
        setIsButtonDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleSelect = (value: string) => {
    setVideoSpeed(value);
  };

  const handleButtonClick = () => {
    if (buttonText === "Create Course") {
      createCourse();
    } else {
      updateCourseTitle();
    }
  };

  const handleCourseTitleChange = (e: any) => {
    const title = e.target.value;
    if (buttonText === "Create Course") {
      setCourseTitle(title);
      setIsButtonDisabled(!(title.length >= 10));
    } else {
      setUpdatedCourseTitle(title);
      const shouldEnableButton = title !== courseTitle && title.length >= 10;
      setIsButtonDisabled(!shouldEnableButton);
    }
  };

  const createCourse = async () => {
    try {
      const response = await axios.post(`/createCourse/${courseTitle}`);

      if (response.data.success) {
        setIsCourseCreated(true);
        setUpdatedCourseTitle(courseTitle);
        setButtonText("Update Title");
        setIsButtonDisabled(true);
        const pathId = response.data.id;
        setPathId(pathId);
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const updateCourseTitle = async () => {
    try {
      const response = await axios.post(
        `/updateCourseTitle/${updatedCourseTitle}`,
        {
          pathId,
        }
      );

      if (response.data.success) {
        setIsButtonDisabled(true);
      }
    } catch (error) {
      console.error("Error updating course title:", error);
    }
  };

  const handleAddNode = async () => {
    if (pathId === null) {
      console.error("No course path ID available.");
      return;
    }

    try {
      const response = await axios.post("/createNode", {
        nodeName,
        nodeUrl,
        videoSpeed,
        path_id: pathId,
      });

      if (response.data.success) {
        const nodeSpacing = 150;
        const newPosition = {
          x: 0,
          y: nodes.length * nodeSpacing,
        };

        const newNode = {
          id: response.data.id.toString(),
          position: newPosition,
          data: {
            nodeName: nodeName,
            url: nodeUrl,
            videoSpeed,
            id: response.data.id.toString(),
            previous_url: "",
            next_urls: [],
          },
          type: "textUpdater",
        };

        setNodes([...nodes, newNode]);
        setNodeName("");
        setNodeUrl("");
      }
    } catch (error) {
      console.error("Error adding node:", error);
    }
  };

  const organizeNodes = useCallback(() => {
    const updatedNodes = nodes.map((node) => {
      const connectionEdges = edges.filter((edge) => {
        const nodePair = [edge.source, edge.target].sort().join("-");
        const currentNodePair = [node.id, edge.target].sort().join("-");
        return nodePair === currentNodePair;
      });

      let previousUrl = "";
      let nextUrls = [];

      if (connectionEdges.length > 0) {
        const connectedNode = nodes.find(
          (n) =>
            n.id === connectionEdges[0].target ||
            n.id === connectionEdges[0].source
        );
        if (connectedNode) {
          previousUrl = connectedNode.data.id || "";
        }
      }

      if (connectionEdges.length > 0) {
        nextUrls = connectionEdges
          .map((edge) => {
            const connectedNode = nodes.find(
              (n) => n.id === edge.target || n.id === edge.source
            );
            return connectedNode ? connectedNode.data.id || "" : "";
          })
          .filter(Boolean);
      }

      const isFirstNode = nextUrls.length > 0 && previousUrl === "";

      return {
        ...node,
        data: {
          ...node.data,
          previous_url: previousUrl,
          next_urls: nextUrls,
          isFirstNode:
            node.data.previous_url === "/page/home" ? true : isFirstNode,
        },
      };
    });

    setNodes(updatedNodes);
  }, [nodes, edges, setNodes]);

  const onConnect = useCallback(
    async (params: any) => {
      try {
        const sourceNode = nodes.find((node) => node.id === params.source);
        const targetNode = nodes.find((node) => node.id === params.target);
        if (!sourceNode || !targetNode) {
          console.error("Source or target node not found");
          return;
        }
        const response = await axios.post("/nodesConnection", {
          sourceId: sourceNode.data.id,
          targetId: targetNode.data.id,
          courseId: pathId,
          connectionEdges: params,
        });

        if (response.data.success) {
          setEdges((eds) => addEdge(params, eds));
          organizeNodes();
        } else {
          console.error("Error creating connection:", response.data.message);
        }
      } catch (error) {
        console.error("Error creating connection:", error);
      }
    },
    [nodes, setEdges, organizeNodes, pathId]
  );

  const onEdgesChange = useCallback(
    async (changes: any[]) => {
      const removedEdges = changes.filter((change) => change.type === "remove");

      for (let removedEdge of removedEdges) {
        try {
          const response = await axios.post("/deleteConnections", {
            source: removedEdge.source,
            target: removedEdge.target,
          });

          if (response.data.success) {
            console.log("Connection deleted successfully");
          } else {
            console.error("Error deleting connection:", response.data.message);
          }
        } catch (error) {
          console.error("Error deleting connection:", error);
        }
      }

      setEdges((eds) =>
        eds.filter(
          (edge) => !removedEdges.some((change) => change.id === edge.id)
        )
      );
    },
    [setEdges]
  );

  const handleDeleteEdge = useCallback(
    async (edge: any) => {
      try {
        const response = await axios.post("/deleteConnections", {
          source: edge.source,
          target: edge.target,
          courseId: pathId,
        });

        if (response.data.success) {
          setEdges((eds) => eds.filter((e) => e.id !== edge.id));

          const sourceNode = nodes.find((node) => node.id === edge.source);
          const targetNode = nodes.find((node) => node.id === edge.target);

          if (sourceNode) {
            sourceNode.data.next_urls = sourceNode.data.next_urls.filter(
              (id: string) => id !== edge.target
            );
          }

          if (targetNode) {
            targetNode.data.previous_url = "";
          }

          setNodes([...nodes]);
          organizeNodes();
        } else {
          console.error("Error deleting connection:", response.data.message);
        }
      } catch (error) {
        console.error("Error deleting connection:", error);
      }
    },
    [nodes, setEdges, organizeNodes]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge: any, newConnection: any) => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, []);

  const onReconnectEnd = useCallback(
    (_: any, edge: any) => {
      if (!edgeReconnectSuccessful.current) {
        handleDeleteEdge(edge);
      }

      edgeReconnectSuccessful.current = true;
    },
    [handleDeleteEdge]
  );

  const handleEdit = (id: string) => {
    const nodeToEdit = nodes.find((node) => node.id === id);
    if (nodeToEdit) {
      setNodeName(nodeToEdit.data.nodeName || "");
      setNodeUrl(nodeToEdit.data.url || "");
      setEditingNodeId(nodeToEdit.id);
    }
  };

  const handleUpdateNode = async () => {
    if (!editingNodeId) {
      console.error("No node ID specified for update.");
      return;
    }

    try {
      const response = await axios.post("/updateNode", {
        nodeId: editingNodeId,
        nodeName: nodeName,
        nodeUrl: nodeUrl,
        videoSpeed: videoSpeed,
      });

      if (response.data.success) {
        console.log("Node updated successfully.");
        console.log(response.data.node.id);

        setNodes((nodes: any) => {
          return nodes.map((node: any) => {
            if (node.id == response.data.node.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  nodeName: response.data.node.title,
                  url: response.data.node.url,
                  videoSpeed: response.data.node.speed,
                },
              };
            } else {
              return node;
            }
          });
        });

        setNodeName("");
        setNodeUrl("");
        setEditingNodeId(null);
      } else {
        console.error("Error updating node:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating node:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.post("/deleteNode", { nodeId: id });

      if (response.data.success) {
        console.log("Node and related data deleted successfully.");

        setNodes((nds) => nds.filter((node) => node.id !== id));
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== id && edge.target !== id)
        );
      } else {
        console.error("Error deleting node:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };

  const onNodeDragStop = useCallback(async (event: any, node: any) => {
    console.log(node);
    try {
      const nodeData = {
        node_id: node.id,
        node_position: node.position,
      };

      await axios.post("/updatePositionNodes", {
        nodesData: [nodeData],
      });
    } catch (error) {
      console.error("Error updating node positions:", error);
    }
  }, []);

  useEffect(() => {
    organizeNodes();
  }, [edges]);

  return (
    <div className="h-full dots-pattern font-bold rounded-2xl p-3 flex gap-4 bg-[#F3F3F3] relative">
      <div className="w-full h-full flex-1">
        <div className="flex items-center bg-white w-fit rounded-lg px-2">
          <input
            type="text"
            name="courseTitle"
            placeholder="Course Title"
            value={
              buttonText === "Create Course" ? courseTitle : updatedCourseTitle
            }
            onChange={handleCourseTitleChange}
            className="px-2 py-1 rounded-lg text-[2em] focus:outline-none focus:ring-0"
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className={`bg-black rounded-lg p-2 text-white w-fit ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isButtonDisabled}
          >
            {buttonText}
          </button>
        </div>
        <div className="w-full py-2 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            zoomOnScroll={false}
            panOnScroll={false}
            panOnDrag={false}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            onNodeDragStop={onNodeDragStop}
          />
        </div>
      </div>

      {isCourseCreated && (
        <NodePreviewList
          nodes={nodes}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          courseTitle={courseTitle}
        />
      )}

      {isCourseCreated && (
        <NodeForm
          nodeName={nodeName}
          setNodeName={setNodeName}
          nodeUrl={nodeUrl}
          setNodeUrl={setNodeUrl}
          videoSpeed={videoSpeed}
          videoSpeedOptions={videoSpeedOptions}
          handleSelect={handleSelect}
          handleAddNode={handleAddNode}
          isEditing={editingNodeId !== null}
          handleEditNode={handleUpdateNode}
        />
      )}
    </div>
  );
};

export default CreateCourse;
