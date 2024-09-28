<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Node;
use App\Models\AccessCode;
use App\Models\CodeUsed;
use App\Models\Path;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{

    public function __construct()
    {
        // header('Access-Control-Allow-Origin: *');
        // header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        // header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }

    /**
     * Crear una conexión entre nodos.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserCourses(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|integer',
        ]);

        $userId = $validated['userId'];

        DB::beginTransaction();
        try {
            $courses = Path::where('user_id', $userId)->get();

            DB::commit();

            return response()->json(['success' => true, 'courses' => $courses], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getAdminDataAndCourses(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|integer',
        ]);

        $userId = $validated['userId'];

        DB::beginTransaction();
        $userData = User::where('id', $userId)->first();

        try {
            // Buscar los cursos que pertenecen al usuario
            $courses = Path::where('user_id', $userId)->get();

            foreach ($courses as $course) {
                // Obtener los nodes asociados a este curso
                $nodes = Node::where('path_id', $course->id)->get();
                $course->nodes = $nodes;

                // Contar el número total de nodes
                $course->total_nodes = $nodes->count();

                // Contar los access_codes asociados a este path
                $accessCodes = AccessCode::where('path_id', $course->id)->get();
                $course->access_code_count = $accessCodes->count();

                // Inicializar el contador de cuántas veces se han usado los códigos de acceso
                $totalAccessCodeUsedCount = 0;

                // Iterar sobre los access_codes para contar cuántas veces han sido usados
                foreach ($accessCodes as $accessCode) {
                    // Contar cuántas veces se ha utilizado cada access_code en la tabla code_used
                    $usedCount = CodeUsed::where('access_code_id', $accessCode->id)->count();
                    $totalAccessCodeUsedCount += $usedCount;
                }

                // Agregar la cuenta total de usos de códigos de acceso al curso
                $course->total_access_code_used_count = $totalAccessCodeUsedCount;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'userData' => $userData,
                'courses' => $courses,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
