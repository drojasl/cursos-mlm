<?php

namespace App\Http\Controllers;

use App\Models\Path;
use App\Models\CodeUsed;
use App\Models\CustomerCodes;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;
use App\Models\AccessCode;

class CodesController extends Controller
{
    public function checkAccessCode(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:7',
        ]);

        $code = $validated['code'];

        try {
            $exists = AccessCode::where('access_code', $code)->exists();

            return response()->json([
                'isUnique' => !$exists,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al verificar el código: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getUserCodes(Request $request)
    {
        $validated = $request->validate([
            'userId' => 'required|integer',
        ]);

        $userId = $validated['userId'];

        try {
            $codes = AccessCode::where('user_id', $userId)->get();

            $codesData = [];

            foreach ($codes as $code) {
                $usedCount = CodeUsed::where('access_code_id', $code->id)->count();

                $pathTitle = Path::where('id', $code->path_id)->value('title');

                $createdAt = $code->created_at ? $code->created_at->toDateTimeString() : 'No disponible';

                $codesData[] = [
                    'id' => $code->id,
                    'code' => $code->access_code,
                    'codeLimit' => $code->used_limit,
                    'usedCount' => $usedCount,
                    'pathTitle' => $pathTitle,
                    'createdAt' => $createdAt,
                ];
            }

            return response()->json([
                'codes' => $codesData,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al verificar el código: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function addAccessCode(Request $request)
    {
        // Validar los datos del request
        $validated = $request->validate([
            'userId' => 'required|integer',
            'code' => 'required|string|unique:access_codes,access_code|max:255', // Cambiar 'code' a 'access_code'
            'pathId' => 'required|integer',
            'codeLimit' => 'required|integer|min:1',
        ]);

        try {
            $accessCode = new AccessCode();
            $accessCode->user_id = $validated['userId'];
            $accessCode->path_id = $validated['pathId'];
            $accessCode->access_code = $validated['code']; // Cambiar 'code' a 'access_code'
            $accessCode->used_limit = $validated['codeLimit'];
            $accessCode->created_at = now();
            $accessCode->save();

            return response()->json([
                'success' => true,
                'message' => 'Código añadido exitosamente.',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al añadir el código: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteAccessCode(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:access_codes,id',
        ]);

        try {
            $code = AccessCode::findOrFail($request->id);

            CodeUsed::where('access_code_id', $request->id)->delete();

            $code->delete();

            return response()->json(['success' => true], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error deleting code'], 500);
        }
    }

    public function getCustomCodes(Request $request)
    {
        $request->validate([
            'userId' => 'required|integer|exists:users,id',
        ]);

        try {
            $codes = CustomerCodes::where('user_id', $request->userId)->get();

            if ($codes->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'No codes found for this user'], 404);
            }

            return response()->json(['success' => true, 'codes' => $codes], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error retrieving codes'], 500);
        }
    }

    public function addCustomCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'userId' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $existingCode = CustomerCodes::where('code', $request->input('code'))->first();

        if ($existingCode) {
            return response()->json([
                'success' => false,
                'message' => 'The code already exists',
            ], 409);
        }

        try {
            $customCode = CustomerCodes::create([
                'code' => $request->input('code'),
                'description' => $request->input('description'),
                'user_id' => $request->input('userId'),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Custom code added successfully',
                'code' => [
                    'id' => $customCode->id, // Devolver el ID del nuevo código
                    'code' => $customCode->code,
                    'description' => $customCode->description,
                    'user_id' => $customCode->user_id
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error adding custom code',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteCustomCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|integer|exists:customer_codes,id',
            'userId' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $code = CustomerCodes::find($request->input('code'));

            if (!$code) {
                return response()->json([
                    'success' => false,
                    'message' => 'Code not found',
                ], 404);
            }

            $code->delete();

            return response()->json([
                'success' => true,
                'message' => 'Custom code deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting custom code',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
