<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Node;
use App\Models\Next;
use App\Models\Path;
use App\Models\AccessCode;
use App\Models\CoursesHistory;
use App\Models\CodeUsed;
use App\Models\User;
use App\Models\NodeConnection;

use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    public function __construct()
    {
        // header('Access-Control-Allow-Origin: *');
        // header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        // header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }

    public function createCourse(Request $request, $courseTitle)
    {
        DB::beginTransaction();
        try {
            $path = Path::create([
                'title' => $courseTitle,
                'user_id' => 1,
                'url' => null,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Course created successfully',
                'courseTitle' => $courseTitle,
                'id' => $path->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error creating course',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateCourseTitle(Request $request, $newTitle)
    {
        try {
            $request->validate([
                'pathId' => 'required|integer|exists:paths,id',
            ]);

            $path = Path::findOrFail($request->pathId);

            $path->title = $newTitle;
            $path->save();

            return response()->json(['success' => true, 'message' => 'Title updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update title', 'error' => $e->getMessage()], 500);
        }
    }

    public function createNode(Request $request)
    {
        $data = $request->validate([
            'nodeName' => 'required|string',
            'nodeUrl' => 'required|string',
            'videoSpeed' => 'required|string',
            'path_id' => 'required|integer',
        ]);

        try {
            $node = Node::create([
                'title' => $data['nodeName'],
                'url' => $data['nodeUrl'],
                'speed' => $data['videoSpeed'],
                'previous_url' => NULL,
                'path_id' => $data['path_id'],
            ]);

            return response()->json([
                'success' => true,
                'id' => $node->id,
                'message' => 'Node created successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating node',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateNode(Request $request)
    {
        $validated = $request->validate([
            'nodeId' => 'required|exists:nodes,id',
            'nodeName' => 'required|string',
            'nodeUrl' => 'required|url',
            'videoSpeed' => 'required|string'
        ]);

        $node = Node::find($validated['nodeId']);

        if ($node) {
            $node->update([
                'title' => $validated['nodeName'],
                'url' => $validated['nodeUrl'],
                'speed' => $validated['videoSpeed']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Node updated successfully',
                'node' => $node
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Node not found'], 404);
    }

    public function deleteNode(Request $request)
    {
        $validated = $request->validate([
            'nodeId' => 'required|exists:nodes,id',
        ]);

        $nodeId = $validated['nodeId'];

        Node::where('previous_url', "course/{$nodeId}")
            ->update(['previous_url' => null]);

        Node::where('id', $nodeId)->delete();

        Next::where('node_id', $nodeId)->delete();

        Next::where('url', "course/{$nodeId}")->delete();

        return response()->json(['success' => true, 'message' => 'Node and related data deleted successfully']);
    }

    public function nodesConnection(Request $request)
    {
        $validated = $request->validate([
            'sourceId' => 'required|integer',
            'targetId' => 'required|integer',
            'courseId' => 'required|integer',
            'connectionEdges' => 'required|array',
        ]);

        $sourceId = $validated['sourceId'];
        $targetId = $validated['targetId'];
        $connectionEdges = $validated['connectionEdges'];

        //! GET SOURCE NODE
        $sourceNode = Node::where('id', $sourceId)->first();

        if (!$sourceNode) {
            return response()->json(['error' => 'Source node not found'], 404);
        }

        if (empty($sourceNode->previous_url)) {
            $sourceNode->update(['previous_url' => '/page/home']);

            Path::where('id', $sourceNode->path_id)
                ->update(['url' => $sourceId]);
        }

        //! GET TARGET NODE
        $targetNode = Node::where('id', $targetId)->first();

        if (!$targetNode) {
            return response()->json(['error' => 'Target node not found'], 404);
        }

        //! UPDATE 'previous_url' FOR TARGET NODE
        $previousUrl = "/course/{$sourceId}";
        $targetNode->update(['previous_url' => $previousUrl]);

        //! CREATE REGISTER IN TABLE NEXTS
        Next::firstOrCreate([
            'node_id' => $sourceId,
            'url' => $targetId,
            'label' => 'Continue',
        ], [
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        //! EDIT TO LOWER NODES HANDLES
        $sourceHandle = strtolower($this->extractPosition($connectionEdges['sourceHandle']));
        $targetHandle = strtolower($this->extractPosition($connectionEdges['targetHandle']));

        //! CREATE REGISTER IN TABLE NODE_CONNECTIONS
        NodeConnection::firstOrCreate([
            'node_source_id' => $sourceId,
            'node_target_id' => $targetId,
            'source' => $sourceHandle,
            'target' => $targetHandle,
        ], [
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function deleteConnection(Request $request)
    {

        $validated = $request->validate([
            'source' => 'required|integer',
            'target' => 'required|integer',
            'courseId' => 'required|integer',
        ]);

        $sourceId = $validated['source'];
        $targetId = $validated['target'];
        $courseId = $validated['courseId'];

        try {
            //! UPDATE 'previous_url' FROM NODES TABLE
            $targetNode = Node::where('id', $targetId)
                ->where('previous_url', '/course/' . $sourceId)
                ->first();

            if ($targetNode) {
                $targetNode->previous_url = null;
                $targetNode->save();
            }

            //! DELETE FROM 'Next' TABLE
            Next::where('node_id', $sourceId)
                ->where('url', $targetId)
                ->delete();

            //! DELETE FROM 'NodeConnection' TABLE
            NodeConnection::where('node_source_id', $sourceId)
                ->where('node_target_id', $targetId)
                ->delete();

            //! UPDATE 'Path' RECORD
            $path = Path::find($courseId);
            if ($path) {
                $nodeWithHomeUrl = Node::where('previous_url', '/page/home')->first();
                if ($nodeWithHomeUrl) {
                    $path->url = $nodeWithHomeUrl->id;
                } else {
                    $path->url = null;
                }
                $path->save();
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getCourse(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'tokens' => 'array'
        ]);

        $code = $validated['code'];
        $tokens = $validated['tokens'] ?? [];

        try {
            $accessCode = AccessCode::where('access_code', $code)->first();

            if (!$accessCode) {
                return response()->json(['success' => false, 'message' => 'El código de acceso no existe.'], 404);
            }

            $path = Path::where('id', $accessCode->path_id)->first(['url', 'id', 'title', 'user_id']);


            if (!$path) {
                return response()->json(['success' => false, 'message' => 'No se encontró el curso asociado al código.'], 404);
            }

            $user = User::where('id', $path->user_id)->first(['name', 'last_name', 'email', 'id']);

            if (count($tokens) > 0) {
                $codeUsed = CodeUsed::where('access_code_id', $accessCode->id)
                    ->whereIn('token', $tokens)
                    ->first();

                if ($codeUsed) {
                    $token = $codeUsed->token;
                    $codeUsed->touch();

                    $nodeDataList = [];
                    $currentUrl = $path->url;
                    while ($currentUrl) {
                        $nodeData = $this->getNodeNext($currentUrl);
                        $nodeDataList[] = $nodeData;
                        $currentUrl = $nodeData['next_url'];
                    }

                    $courseData = [
                        'course_id' => $path->id,
                        'title' => $path->title,
                        'user' => $user,
                        'nodes' => $nodeDataList
                    ];

                    return response()->json([
                        'success' => true,
                        'course_data' => $courseData,
                        'token' => $token,
                    ]);
                }
            } else {
                $usedCount = CodeUsed::where('access_code_id', $accessCode->id)->count();

                if ($accessCode->used_limit !== null && $usedCount >= $accessCode->used_limit) {
                    return response()->json(['success' => false, 'message' => 'Se ha alcanzado el límite de usos para este código de acceso.'], 403);
                }
            }

            $nodeDataList = [];
            $currentUrl = $path->url;

            while ($currentUrl) {
                $nodeData = $this->getNodeNext($currentUrl);
                $nodeDataList[] = $nodeData;
                $currentUrl = $nodeData['next_url'];
            }

            $courseData = [
                'course_id' => $path->id,
                'title' => $path->title,
                'user' => $user,
                'nodes' => $nodeDataList
            ];

            $token = bin2hex(random_bytes(16));

            CodeUsed::create([
                'token' => $token,
                'access_code_id' => $accessCode->id,
                'created_at' => now(),
            ]);

            CoursesHistory::create([
                'token' => $token,
                'path_id' => $path->id,
                'user_id' => $path->user_id,
            ]);

            return response()->json([
                'success' => true,
                'course_data' => $courseData,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getCourseEdit($courseId)
    {
        try {
            $coursePath = Path::where('id', $courseId)->select('title', 'id')->first();

            if (!$coursePath) {
                return response()->json(['success' => false, 'message' => 'Curso no encontrado'], 404);
            }

            $course = [
                'title' => $coursePath->title,
                'path_id' => $coursePath->id,
                'nodes' => []
            ];

            $nodes = Node::where('path_id', $coursePath->id)->get();

            foreach ($nodes as $node) {
                // Obtener el siguiente nodo
                $nextStart = Next::where('node_id', $node->id)->first();

                // Obtener las conexiones del nodo
                $nodeConnections = NodeConnection::where('node_source_id', $node->id)->get();

                // Transformar conexiones a un array con las columnas deseadas
                $connectionsArray = $nodeConnections->map(function ($connection) {
                    return [
                        'node_target_id' => $connection->node_target_id,
                        'source' => $connection->source,
                        'target' => $connection->target,
                    ];
                });

                // Agregar datos del nodo al array del curso
                $course['nodes'][] = [
                    'id' => $node->id,
                    'title' => $node->title,
                    'url' => $node->url,
                    'speed' => $node->speed,
                    'previous_url' => $node->previous_url,
                    'position_x' => $node->position_x,
                    'position_y' => $node->position_y,
                    'next_url' => $nextStart ? $nextStart->url : null,
                    'label' => $nextStart ? $nextStart->label : null,
                    'connections' => $connectionsArray // Agregar las conexiones transformadas
                ];
            }

            // Retorna el curso con los datos de los nodos
            return response()->json([
                'success' => true,
                'course' => $course
            ]);
        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function updatePositionNodes(Request $request)
    {
        $validated = $request->validate([
            'nodesData' => 'required|array',
            'nodesData.*.node_id' => 'required|string',
            'nodesData.*.node_position' => 'required|array',
            'nodesData.*.node_position.x' => 'required|numeric',
            'nodesData.*.node_position.y' => 'required|numeric',
        ]);

        $nodesData = $validated['nodesData'];

        foreach ($nodesData as $node) {
            $nodeModel = Node::where('id', $node['node_id']);

            if ($nodeModel) {
                $nodeModel->update([
                    'position_x' => $node['node_position']['x'],
                    'position_y' => $node['node_position']['y'],
                ]);
            }
        }

        return response()->json(['message' => 'Node positions updated successfully']);
    }

    public function validateToken($token)
    {
        $exists = CoursesHistory::where('token', $token)->exists();

        // Devuelve una respuesta JSON con el estado del token
        return response()->json(['valid' => $exists]);
    }

    private function getNodeNext($id)
    {
        $startNode = Node::where('id', $id)->first();

        $nexts = Next::where('node_id', $id)->first(['url', 'label']);

        $nodeData = [
            'id' => $startNode->id,
            'path_id' => $startNode->path_id,
            'title' => $startNode->title,
            'video_url' => $startNode->url,
            'speed' => $startNode->speed,
            'previous_url' => $startNode->previous_url,
            'next_url' => $nexts ? $nexts->url : null,
            'label' => $nexts ? $nexts->label : null,
            'played' => false
        ];

        return $nodeData;
    }

    private function extractPosition($handle)
    {
        $parts = explode('-', $handle);
        return end($parts);
    }
}
